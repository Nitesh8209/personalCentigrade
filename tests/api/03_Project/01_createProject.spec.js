import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';
import { project } from '../../data/projectData';
import { apiProjectCreadentials } from '../../data/testData';


test.describe('Project API Tests', { tag: '@API' }, () => {
  // Extract necessary data from the shared data store
  let projectId;
  let headers;
  let projectAccessToken;


  test.beforeAll(async () => {
    const authdata = new URLSearchParams({
      username: apiProjectCreadentials.email,
      password: apiProjectCreadentials.password,
    });
    const authHeader = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const authResponse = await postRequest(API_ENDPOINTS.authTOken, authdata, authHeader);
    expect(authResponse.status).toBe(200);
    const authResponseBody = await authResponse.json();
    projectAccessToken = authResponseBody.access_token;
    await saveData({ projectAccessToken: projectAccessToken }, 'Api');

    // Set headers with Invite access token for authorization
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`
    };
  });

  // Test case to create a project without authorization
  test('Create Project without Authorization', async () => {
    const data = {
      name: project.projectName,
      organizationId: apiProjectCreadentials.organizationId
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
      organizationId: apiProjectCreadentials.organizationId
    };

    const response = await postRequest(API_ENDPOINTS.createProject, JSON.stringify(projectData), headers);
    const responseBody = await response.json();

    // Assert the response status and body
    expect(response.status).toBe(201);
    expect(responseBody).toHaveProperty('id', expect.any(Number));
    expect(responseBody).toHaveProperty('name', project.projectName);
    expect(responseBody).toHaveProperty('organizationId', apiProjectCreadentials.organizationId);

    // Save the project ID for future use
    projectId = responseBody.id;
    await saveData({ projectId: projectId }, 'Api');
  })

  // Test case to retrieve a project by its ID
  test('Get Project By projet ID', async () => {
    if(!projectId){
      const data = getData('Api');
      projectId = data.projectId;
    }
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    // Assert the response status and project properties
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', projectId);
    expect(responseBody).toHaveProperty('name', project.projectName);
    expect(responseBody).toHaveProperty('organizationId', apiProjectCreadentials.organizationId);
  })

  // Test case to update project details
  test('Update Project Data', async ({ baseURL }) => {
    if(!projectId){
      const data = getData('Api');
      projectId = data.projectId;
    }
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
    expect(responseBody).toHaveProperty('organizationId', apiProjectCreadentials.organizationId);
  })

  // // Test case to retrieve the state of the project by its ID
  test('Get Project state By ID', async () => {
      if(!projectId){
      const data = getData('Api');
      projectId = data.projectId;
    }
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