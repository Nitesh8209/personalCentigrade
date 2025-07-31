import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';
import { project } from '../../data/projectData';
import { validateProjectFieldValues } from '../../utils/projectHelper';
import { apiProjectCreadentials } from '../../data/testData';
import * as fs from 'fs';
import path from 'path';


test.describe('TIER0 Project Management Tests for Publish', { tag: '@API' }, () => {
  // Retrieve required data like tokens, organizationId, and projectId from saved data
  const { projectAccessToken, admin_access_token, projectId , guid} = getData('Api');

  let headers;
  let ProjectData;

  test.beforeAll(async () => {

    // Set headers with authorization token and content type
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`,
      'x-centigrade-organization-id': 409
    };

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "Project-publish-data.json"
    );
    const rawData = fs.readFileSync(filePath, "utf-8");
    ProjectData = JSON.parse(rawData);
  });

  // Test to create project field values
  test('Create Project-Field-Values ', async () => {
    const projectfieldvalueUrl = `${API_ENDPOINTS.createProjectguid(guid)}/project-field-values`;

    // Send a POST request with project approach data
    const response = await postRequest(projectfieldvalueUrl, JSON.stringify(ProjectData.fields), headers);
    const responseBody = await response.json();

    // Verify the response status and structure
    expect(response.status).toBe(201);
    expect(Array.isArray(responseBody)).toBe(true);

    // Validate the response data
    validateProjectFieldValues(ProjectData.fields.items, responseBody);
  })

  // Test to retrieve project field values
  test('Get Project-Field-Values', async () => {

    const projectfieldvalueUrl = `${API_ENDPOINTS.createProjectguid(guid)}/project-field-values/draft`;

    // Send a GET request to retrieve project field values
    const response = await getRequest(projectfieldvalueUrl, headers);

    // Verify response status and structure
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);

    // Validate the response data
    validateProjectFieldValues(ProjectData.fields.items, responseBody);
  })

  // Test to retrieve specific project fields based on a search query
  test('Retrieve Project Fields', async () => {
    const projectFiledsUrl = `${API_ENDPOINTS.createProjectguid(guid)}/fields/draft?searchText=projectMission`;
    const response = await getRequest(projectFiledsUrl, headers);
    const responseBody = await response.json();
    const field = ProjectData.fields.items.find(f => f.keyName === 'projectMission');

    expect(response.status).toBe(200);
    expect(responseBody.fields.projectMission).toHaveProperty('name', 'projectMission');
    expect(responseBody.fields.projectMission).toHaveProperty('value', field.value);
  })


  test(`Upload File Tier 0`, async ({ request }) => {
    const filePath = './tests/assets/file.png';
    const fileBuffer = fs.readFileSync(filePath);

    const fileUrl = `${API_ENDPOINTS.createProjectguid(guid)}/file`;

    for (const { configFieldId } of ProjectData.fileData) {
      // Prepare file data for upload
      const fileData = {
        multipart: {
          configFieldId: configFieldId,
          file: {
            name: 'file.png',
            mimeType: 'application/octet-stream',
            buffer: fileBuffer,
          },
        },
        headers: {
          'Authorization': `Bearer ${projectAccessToken}`,
          'x-centigrade-organization-id': String(409),
        }
      };

      // Perform file upload
      const response = await request.post(fileUrl, fileData);
      await expect(response.status()).toBe(200);
    }
  })

  test('Publish project', async () => {
    const publishProjectUrl = `${API_ENDPOINTS.createProjectguid(guid)}/publish`;

    const data = { notes: "Project first published" };

    const response = await postRequest(publishProjectUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.id).toBe(projectId);
    expect(responseBody.organizationId).toBe(apiProjectCreadentials.organizationId);
    expect(responseBody.isPublished).toBe(false);
    expect(responseBody.reviewState).toBe('UNREVIEWED');
    expect(responseBody.latestVersions.published).toBe(null);
  })

  test('should not Update the Review State of project  by Admin', async () => {
    const reviewProjectUrl = `${API_ENDPOINTS.createProjectguid(guid)}`;
    const data = { reviewState: "REVIEWED" };

    const response = await putRequest(reviewProjectUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(403);
    expect(responseBody.statusCode).toBe(403);
    expect(responseBody.errorType).toBe("VALIDATION_ERROR");
    expect(responseBody.errorMessage).toBe("review_state cannot be updated");
  })

  test('should be Update the Review State of project by superUser', async () => {
    const reviewProjectUrl = `${API_ENDPOINTS.createProjectguid(guid)}`;

    const data = { reviewState: "REVIEWED" };

    const reviewHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${admin_access_token}`,
      'x-centigrade-organization-id': 409
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
    const publishProjectUrl = `${API_ENDPOINTS.createProjectguid(guid)}/publish`;
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
    const publishProjectUrl = `${API_ENDPOINTS.createProjectguid(guid)}/public`;
    const publicHeader = {}
    const response = await getRequest(publishProjectUrl, publicHeader);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(projectId);
    expect(responseBody.organizationId).toBe(apiProjectCreadentials.organizationId);
    expect(responseBody.isPublished).toBe(true);
    expect(responseBody.reviewState).toBe('REVIEWED');
    expect(responseBody.latestVersions).toBe(null);
  })

  test('UnPublish the Project', async () => {
    const unpublishProjectUrl = `${API_ENDPOINTS.createProjectguid(guid)}`;
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
    const publishProjectUrl = `${API_ENDPOINTS.createProjectguid(guid)}/public`;

    const response = await getRequest(publishProjectUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody.errorType).toBe("MODEL_NOT_FOUND");
    expect(responseBody.errorMessage).toBe("Project not found");
  })

})