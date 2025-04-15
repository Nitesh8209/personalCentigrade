import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';
import { project, projectApproach } from '../../data/projectData';
import { validateProjectFieldValues } from '../../utils/projectHelper';
import { apiProjectCreadentials } from '../../data/testData';


test.describe('TIER0 Project Management Tests for Publish', { tag: '@API' }, () => {
  // Retrieve required data like tokens, organizationId, and projectId from saved data
  const { projectAccessToken, admin_access_token, projectId } = getData('Api');

  let headers;

  test.beforeAll(async () => {
    // Set headers with authorization token and content type
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`
    };
  });

  // Test to create project field values
  test('Create Project-Field-Values ', async () => {
    const projectfieldvalueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    // Send a POST request with project approach data
    const response = await postRequest(projectfieldvalueUrl, JSON.stringify(projectApproach), headers);
    const responseBody = await response.json();

    // Verify the response status and structure
    expect(response.status).toBe(201);
    expect(Array.isArray(responseBody)).toBe(true);

    // Validate the response data
    validateProjectFieldValues(projectApproach.items, responseBody);
  })

  // Test to retrieve project field values
  test('Get Project-Field-Values', async () => {

    const projectfieldvalueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    // Send a GET request to retrieve project field values
    const response = await getRequest(projectfieldvalueUrl, headers);

    // Verify response status and structure
    expect(response.status).toBe(200);
    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBe(true);

    // Validate the response data
    validateProjectFieldValues(projectApproach.items, responseBody);
  })

  // Test to retrieve specific project fields based on a search query
  test('Retrieve Project Fields', async () => {
    const projectFiledsUrl = `${API_ENDPOINTS.createProject}/${projectId}/fields?searchText=projectMission`;
    const response = await getRequest(projectFiledsUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.fields.projectMission).toHaveProperty('name', 'projectMission');
    expect(responseBody.fields.projectMission).toHaveProperty('value', 'test');
  })

  test('Publish project', async () => {
    const publishProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}/publish`;

    const data = { notes: "Project first published" };

    const response = await postRequest(publishProjectUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.id).toBe(projectId);
    expect(responseBody.organizationId).toBe(apiProjectCreadentials.organizationId);
    expect(responseBody.isPublished).toBe(false);
    expect(responseBody.reviewState).toBe('PENDING_REVIEW');
    expect(responseBody.latestVersions.published).toBe(null);
  })

  test('should not Update the Review State of project  by Admin', async () => {
    const reviewProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const data = { reviewState: "REVIEWED" };

    const response = await putRequest(reviewProjectUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(403);
    expect(responseBody.statusCode).toBe(403);
    expect(responseBody.errorType).toBe("VALIDATION_ERROR");
    expect(responseBody.errorMessage).toBe("review_state cannot be updated");
  })

  test('should be Update the Review State of project by superUser', async () => {
    const reviewProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;

    const data = { reviewState: "REVIEWED" };

    const reviewHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${admin_access_token}`
    };

    const response = await putRequest(reviewProjectUrl, JSON.stringify(data), reviewHeaders);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(projectId);
    expect(responseBody.name).toBe(project.projectName);
    expect(responseBody.organizationId).toBe(apiProjectCreadentials.organizationId);
    expect(responseBody.isPublished).toBe(false);
    expect(responseBody.reviewState).toBe('REVIEWED');
  })

  test('Publish project after REVIEWED', async () => {
    const publishProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}/publish`;
    const data = { notes: "Project first published" };

    const response = await postRequest(publishProjectUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.id).toBe(projectId);
    expect(responseBody.organizationId).toBe(apiProjectCreadentials.organizationId);
    expect(responseBody.isPublished).toBe(true);
    expect(responseBody.reviewState).toBe('REVIEWED');
    expect(responseBody.latestVersions.published).not.toBe(null);

    const draftProjectId = responseBody.latestVersions.draft.projectId;
    await saveData({ draftProjectId: draftProjectId }, 'Api');
  })


  test('Get the public Project API After Publish', async () => {
    const publishProjectUrl = `${API_ENDPOINTS.getPublic}/${projectId}`;

    const response = await getRequest(publishProjectUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(projectId);
    expect(responseBody.organizationId).toBe(apiProjectCreadentials.organizationId);
    expect(responseBody.isPublished).toBe(true);
    expect(responseBody.reviewState).toBe('REVIEWED');
    expect(responseBody.latestVersions.published).not.toBe(null);
  })

  test('UnPublish the Project', async () => {
    const unpublishProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const unpublishprojectData = {
      isPublished: false,
    };

    // Send request to unpublish project
    const response = await putRequest(unpublishProjectUrl, JSON.stringify(unpublishprojectData), headers);
    const responseBody = await response.json();

    // Validate unpublish success
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('isPublished', false);
  })

  test('should not be able to Get the public Project API After unPublish', async () => {
    const publishProjectUrl = `${API_ENDPOINTS.getPublic}/${projectId}`;

    const response = await getRequest(publishProjectUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.errorType).toBe("INTERNAL_SERVER_ERROR");
    expect(responseBody.errorMessage).toBe("project is not published");
  })

})