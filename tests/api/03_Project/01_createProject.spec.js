import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';
import { organizationtypeData, project } from '../../data/projectData';


test.describe('Project API Tests', () => {
  // Extract necessary data from the shared data store
  const { organizationId, InviteaccessToken } = getData('Api');
  const { admin_access_token } = getData();
  let projectId;
  let headers;


  test.beforeAll(async () => {
    // Set headers with Invite access token for authorization
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
    };
  });

  // Test case to create a project without authorization
  test('Create Project without Authorization', async () => {
    const data = {
      name: project.projectName,
      organizationId: organizationId
    };

    const projectHeader = {
      'Content-Type': 'application/json',
    }
    const response = await postRequest(API_ENDPOINTS.createProject, JSON.stringify(data), projectHeader);
    const responseBody = await response.json();

    // Assert the response status and body
    expect(response.status).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'Not authenticated');
  })

  // Test case to create a project with valid authorization
  test('Create Project with Authorization', async () => {
    const projectData = {
      name: project.projectName,
      organizationId: organizationId
    };

    const response = await postRequest(API_ENDPOINTS.createProject, JSON.stringify(projectData), headers);
    const responseBody = await response.json();

    // Assert the response status and body
    expect(response.status).toBe(201);
    expect(responseBody).toHaveProperty('id', expect.any(Number));
    expect(responseBody).toHaveProperty('name', project.projectName);
    expect(responseBody).toHaveProperty('organizationId', organizationId);

    // Save the project ID for future use
    projectId = responseBody.id;
    await saveData({ projectId: projectId }, 'Api');
  })

  // Test case to retrieve projects by organization ID
  // test('Get the Project By Organization ID', async () => {
  //   const projectUrl = `${API_ENDPOINTS.createProject}?organizationId=${organizationId}`;
  //   const projectHeaders = {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${admin_access_token}`
  //   };
  //   const response = await getRequest(projectUrl, projectHeaders);
  //   const responseBody = await response.json();

  //   // Assert the response status and properties of the first project
  //   expect(response.status).toBe(200);
  //   expect(responseBody[0]).toHaveProperty('id', projectId);
  //   expect(responseBody[0]).toHaveProperty('name', project.projectName);
  //   expect(responseBody[0]).toHaveProperty('organizationId', organizationId);
  // })

  // Test case to attempt accessing a project without the required role-type access
  test('Get Project without Role-Type Access', async () => {
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();
    console.log(responseBody)
    // Assert the expected 404 error response
    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'member does not have FORM role');
    expect(responseBody.context).toHaveProperty('project_id', projectId);
  })

  // Iterate through organization type data to update roles for each type
  organizationtypeData.forEach(({ name, roleTypeId, description }) => {
    test(`update the role type - ${name}`, async () => {
      const organizationtypeData =
      {
        name: name,
        organizationId: organizationId,
        roleTypeId: roleTypeId
      }

      const organizationTypeHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${admin_access_token}`
      };

      const response = await postRequest(API_ENDPOINTS.organizationtype, JSON.stringify(organizationtypeData), organizationTypeHeaders);
      const responseBody = await response.json();

      // Assert the response status and body properties
      expect(response.status).toBe(201);
      expect(responseBody).toHaveProperty('name', name);
      expect(responseBody.roleType).toHaveProperty('id', roleTypeId);
      expect(responseBody.roleType).toHaveProperty('name', name);
      expect(responseBody.roleType).toHaveProperty('description', description);
      expect(responseBody.roleType).toHaveProperty('segment', 'ORGANIZATIONAL_ROLE');
    })
  })

  // Test case to retrieve a project by its ID
  test('Get Project By projet ID', async () => {
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    // Assert the response status and project properties
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', projectId);
    expect(responseBody).toHaveProperty('name', project.projectName);
    expect(responseBody).toHaveProperty('organizationId', organizationId);
  })

  // Test case to update project details
  test('Update Project Data', async ({baseURL}) => {
    const ProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const projectData = {
      domain: `${baseURL}/`,
    };

    const response = await putRequest(ProjectUrl, JSON.stringify(projectData), headers);
    const responseBody = await response.json();

    // Assert the response status and updated project properties
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', projectId);
    expect(responseBody).toHaveProperty('domain', `${baseURL}/`);
    expect(responseBody).toHaveProperty('organizationId', organizationId);
  })

  // Test case to retrieve the state of the project by its ID
  test('Get Project state By ID', async () => {
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}/state`;

    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    // Assert the response status and state-related properties
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', null);
    expect(responseBody).toHaveProperty('projectState', 'CREATED');
    expect(responseBody).toHaveProperty('stateDescription', null);
    expect(responseBody).toHaveProperty('stateType', null);
    expect(responseBody).toHaveProperty('order', null);
  })

})