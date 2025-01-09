import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest } from '../../utils/apiHelper';
import { actualsData, actualsFileType, acutalSeriesData, forcastData, projectApproach } from '../../data/projectData';
import { validateProjectFieldValues } from '../../utils/projectHelper';
const fs = require('fs');

// Reading the test file (image) for upload
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

test.describe('TIER2 Actuals Data Upload Tests', () => {
  // Extracting token and project ID from API data
  const { InviteaccessToken, projectId } = getData('Api');
  let headers;

  // Setting up headers before all tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
    };
  });

  // Test: Creating project field values
  test('Create Project-Field-Values ', async () => {
    const projectFieldValueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    // Sending a POST request to create project field values
    const response = await postRequest(projectFieldValueUrl, JSON.stringify(actualsData), headers);
    const responseBody = await response.json();

    // Assertions to verify the API response
    expect(response.status).toBe(201);
    expect(Array.isArray(responseBody)).toBe(true);

    // Validating the response data
    validateProjectFieldValues( actualsData.items, responseBody);

  })

  // Test: Fetching project field values
  test('Get Project-Field-Values', async () => {
    const projectFieldValueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    // Sending a GET request to retrieve project field values
    const response = await getRequest(projectFieldValueUrl, headers);
    const responseBody = await response.json();

    // Assertions for the response
    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody)).toBe(true);

    // Merging all expected data for validation
    const expectedData = [...projectApproach.items, ...forcastData.items, ...actualsData.items];

    // Validating the response data
    validateProjectFieldValues(expectedData, responseBody);
  })

  // Parallel Test Suite: Uploading files for different types
  test.describe.parallel('Upload Files', () => {
    actualsFileType.forEach(({ projectFileType }) => {
      test(`should successfully upload a file of type: ${projectFileType}`, async ({ request }) => {
        const fileUrl = `${API_ENDPOINTS.createProject}/${projectId}/file`;
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

        // Uploading file via POST request
        const response = await request.post(fileUrl, fileData);
        const responseBody = await response.json();

        // Assertions for the file upload response
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('url', expect.any(String));
        expect(responseBody).toHaveProperty('fileUploadId', expect.any(Number));
        expect(responseBody).toHaveProperty('projectFileId', expect.any(Number));
        expect(responseBody).toHaveProperty('filePath', expect.any(String));
      });
    });
  });

  // Test Suite: Uploading series data
  acutalSeriesData.forEach(({ name, indexOrder }, index) => {
    test(`Upload series data for ${name}`, async () => {
      const uploadSeriesUrl = `${API_ENDPOINTS.createProject}/${projectId}/series`;

      // Sending a POST request to upload series data
      const response = await postRequest(uploadSeriesUrl, JSON.stringify(acutalSeriesData[index]), headers);
      const responseBody = await response.json();
      const seriesData = responseBody.seriesData;

      // Assertions for the response
      expect(response.status).toBe(201);
      expect(responseBody).toHaveProperty('name', name);
      expect(responseBody).toHaveProperty('indexOrder', indexOrder);

      // Validating each item in the series data
      seriesData.forEach((item, seriesDataindex) => {
        expect(item).toHaveProperty('indexOrder', acutalSeriesData[index].seriesData[seriesDataindex].indexOrder);
        expect(item).toHaveProperty('indexName', acutalSeriesData[index].seriesData[seriesDataindex].indexName);
        expect(item).toHaveProperty('value', acutalSeriesData[index].seriesData[seriesDataindex].value);
        expect(item.valueType).toHaveProperty('typeName', acutalSeriesData[index].seriesData[seriesDataindex].dataTypeName);
      })
    })
  })

  // Test Suite: Fetching series data by name
  acutalSeriesData.forEach(({ name, indexOrder }, index) => {
    test(`Get series data by series name ${name}`, async () => {
      const getSeriesUrl = `${API_ENDPOINTS.createProject}/${projectId}/series/${name}`;

      // Sending a GET request to fetch series data
      const response = await getRequest(getSeriesUrl, headers);
      const responseBody = await response.json();
      const seriesData = responseBody.seriesData;

      // Assertions for the response
      expect(response.status).toBe(200);
      expect(responseBody).toHaveProperty('name', name);
      expect(responseBody).toHaveProperty('indexOrder', indexOrder);

      // Validating each item in the series data
      seriesData.forEach((item, seriesDataindex) => {
        expect(item).toHaveProperty('indexOrder', acutalSeriesData[index].seriesData[seriesDataindex].indexOrder);
        expect(item).toHaveProperty('indexName', acutalSeriesData[index].seriesData[seriesDataindex].indexName);
        expect(item).toHaveProperty('value', acutalSeriesData[index].seriesData[seriesDataindex].value);
        expect(item.valueType).toHaveProperty('typeName', acutalSeriesData[index].seriesData[seriesDataindex].dataTypeName);
      })
    })

  })


})