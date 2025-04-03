import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';
import { actualsData, EnhancementsData, EnhancementsFileType, forcastData, projectApproach } from '../../data/projectData';
import  validateProjectFieldValues  from '../../utils/projectHelper';
const fs = require('fs');

// Read the file from the specified path into a buffer
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

test.describe('TIER3 Enhancements Data Upload Tests', () => {
  // Retrieve Invite Access Token and Project ID from stored data
  const { InviteaccessToken, projectId } = getData('Api');
  let headers;

  // Set up headers before running the tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
    };
  });

  // Test to create project field values
  test('Create Project-Field-Values', async () => {
    const projectFieldValuesUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    // Send a POST request with the Enhancements data
    const response = await postRequest(projectFieldValuesUrl, JSON.stringify(EnhancementsData), headers);
    const responseBody = await response.json();

    // Assert the response status and validate the returned data
    expect(response.status).toBe(201);
    expect(Array.isArray(responseBody)).toBe(true);

    // Validate the response data
    validateProjectFieldValues(EnhancementsData.items, responseBody );

  })

  // Test to retrieve project field values and validate them
  test('Get Project-Field-Values', async () => {

    const projectFieldValuesUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    // Send a GET request to fetch project field values
    const response = await getRequest(projectFieldValuesUrl, headers);
    const responseBody = await response.json();

    // Assert the response status and structure of the returned data
    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody)).toBe(true);

    // Combine multiple datasets to form the expected data
    const expectedData = [...projectApproach.items, ...forcastData.items, ...actualsData.items, ...EnhancementsData.items];

    // Validate the response data
    validateProjectFieldValues(expectedData, responseBody);
  })

  // test block for file uploads
  test.describe.parallel('Upload Files', () => {
    // Iterate through all enhancement file types and upload files
    EnhancementsFileType.forEach(({ projectFileType }) => {
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

        // Send a POST request to upload the file
        const response = await request.post(fileUrl, fileData);
        const responseBody = await response.json();

        // Assert the response status and validate the returned file details
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('url', expect.any(String));
        expect(responseBody).toHaveProperty('fileUploadId', expect.any(Number));
        expect(responseBody).toHaveProperty('projectFileId', expect.any(Number));
        expect(responseBody).toHaveProperty('filePath', expect.any(String));
      });
    });
  });


})