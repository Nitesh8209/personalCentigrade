import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest } from '../../utils/apiHelper';
import { FileType, projectApproach } from '../../data/projectData';
import  validateProjectFieldValues  from '../../utils/projectHelper';
const fs = require('fs');

// Load the file to be used for upload tests
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

test.describe('TIER0 Project Management Tests for Publish', () => {
  // Retrieve required data like tokens, organizationId, and projectId from saved data
  const { InviteaccessToken, organizationId, projectId } = getData('Api');

  let headers;

  test.beforeAll(async () => {
    // Set headers with authorization token and content type
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
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
    const projectFiledsUrl = `${API_ENDPOINTS.createProject}/${projectId}/fields?searchText=waterVerificationBody`;
    const response = await getRequest(projectFiledsUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody[0]).toHaveProperty('name', 'waterVerificationBody');
    expect(responseBody[0]).toHaveProperty('value', 'test');
  })

  // tests for file upload with different file types
  test.describe('Upload File', () => {
    FileType.forEach(({ projectFileType }) => {
      test(`should successfully upload a file of type: ${projectFileType}`, async ({ request }) => {
        const fileUrl = `${API_ENDPOINTS.createProject}/${projectId}/file`;

        // Prepare file data for upload
        const fileData = {
          multipart: {
            projectFileType: projectFileType,
            file: {
              name: 'file.png',
              mimeType: 'application/octet-stream',
              buffer: fileBuffer,
            },
          },
          headers: {
            'Authorization': `Bearer ${InviteaccessToken}`,
          }
        };

        // Perform file upload
        const response = await request.post(fileUrl, fileData);
        const responseBody = await response.json();

        // Verify upload success and response structure
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('url', expect.any(String));
        expect(responseBody).toHaveProperty('fileUploadId', expect.any(Number));
        expect(responseBody).toHaveProperty('projectFileId', expect.any(Number));
        expect(responseBody).toHaveProperty('filePath', expect.any(String));
      });
    });
  });

  // Test to update the project state to TIER_0
  test('Update Project State', async () => {
    const projectstateUrl = `${API_ENDPOINTS.createProject}/${projectId}/state`;
    const data = {}

    // Send request to update project state
    const response = await putRequest(projectstateUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    // Validate state update
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', null);
    expect(responseBody).toHaveProperty('projectState', 'TIER_0');
    expect(responseBody).toHaveProperty('stateDescription', null);
    expect(responseBody).toHaveProperty('stateType', null);
    expect(responseBody).toHaveProperty('order', null);
  })

  // Test to publish the project after updating its state
  test('Publish the Project after updating project state', async () => {
    const ProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const projectData = {
      isPublished: true,
    };

    // Send request to publish project
    const response = await putRequest(ProjectUrl, JSON.stringify(projectData), headers);
    const responseBody = await response.json();

    // Validate publish success
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', projectId);
    expect(responseBody).toHaveProperty('isPublished', true);
    expect(responseBody).toHaveProperty('organizationId', organizationId);
  })

  // Test to unpublish the project
  test('UnPublish the Project', async () => {
    const ProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const projectData = {
      isPublished: false,
    };

    // Send request to unpublish project
    const response = await putRequest(ProjectUrl, JSON.stringify(projectData), headers);
    const responseBody = await response.json();

    // Validate unpublish success
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('isPublished', false);
  })

})