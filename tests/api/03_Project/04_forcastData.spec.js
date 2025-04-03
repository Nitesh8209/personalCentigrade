import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest } from '../../utils/apiHelper';
import { forcastData, forcastFileType, forcastSeries, projectApproach } from '../../data/projectData';
import  validateProjectFieldValues  from '../../utils/projectHelper';
const fs = require('fs');

// Read the test file into a buffer for upload
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

test.describe('TIER1 Forecast Data Upload Tests', () => {
  // Extract required data for testing
  const { InviteaccessToken, projectId } = getData('Api');

  let headers;
  let seriesId;

  // Set up the authorization header before running tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
    };
  });

  // Test to create project field values
  test('Create Project-Field-Values', async () => {

    const projectFieldValueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    const response = await postRequest(projectFieldValueUrl, JSON.stringify(forcastData), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(Array.isArray(responseBody)).toBe(true);

    // Validate the response data
    validateProjectFieldValues(forcastData.items, responseBody);
  })

  // Test to fetch project field values
  test('Get Project-Field-Values', async () => {

    const projectFieldValueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

    const response = await getRequest(projectFieldValueUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody)).toBe(true);
    const expectedData = [...projectApproach.items, ...forcastData.items];

    // Validate the response data
    validateProjectFieldValues(expectedData, responseBody);

  })

  // test suite for file uploads
  test.describe('Upload Files', () => {
    forcastFileType.forEach(({ projectFileType }) => {
      // Iterate through each file type to upload
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

        // Send the upload request and validate response
        const response = await request.post(fileUrl, fileData);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('url', expect.any(String));
        expect(responseBody).toHaveProperty('fileUploadId', expect.any(Number));
        expect(responseBody).toHaveProperty('projectFileId', expect.any(Number));
        expect(responseBody).toHaveProperty('filePath', expect.any(String));
      });
    });
  });

  // Test to upload series data
  forcastSeries.forEach(({ name, indexOrder }, index) => {
    test(`Upload the series data for ${name} indexOrder ${indexOrder}`, async () => {
      const uploadSeriesUrl = `${API_ENDPOINTS.createProject}/${projectId}/series`;

      const response = await postRequest(uploadSeriesUrl, JSON.stringify(forcastSeries[index]), headers);
      const responseBody = await response.json();
      const seriesData = responseBody.seriesData;

      expect(response.status).toBe(201);
      expect(responseBody).toHaveProperty('name', name);
      expect(responseBody).toHaveProperty('indexOrder', indexOrder);

      // Validate series data
      seriesData.forEach((item, seriesDataindex) => {
        expect(item).toHaveProperty('indexOrder', forcastSeries[index].seriesData[seriesDataindex].indexOrder);
        expect(item).toHaveProperty('indexName', forcastSeries[index].seriesData[seriesDataindex].indexName);
        expect(item).toHaveProperty('value', forcastSeries[index].seriesData[seriesDataindex].value);
        expect(item.valueType).toHaveProperty('typeName', forcastSeries[index].seriesData[seriesDataindex].dataTypeName);
      })
    })
  })

  // Test to fetch series data by name
  forcastSeries.forEach(({ name, indexOrder }, index) => {
    test(`Get series Data by series Name ${name}`, async () => {
      const getSeriesUrl = `${API_ENDPOINTS.createProject}/${projectId}/series/${name}`;

      const response = await getRequest(getSeriesUrl, headers);
      const responseBody = await response.json();
      const seriesData = responseBody.seriesData;

      // Store the series ID for future tests
      if (index == 0) {
        seriesId = responseBody.seriesId;
      }

      expect(response.status).toBe(200);
      expect(responseBody).toHaveProperty('name', name);
      expect(responseBody).toHaveProperty('indexOrder', indexOrder);

      // Validate series data
      seriesData.forEach((item, seriesDataindex) => {
        expect(item).toHaveProperty('indexOrder', forcastSeries[index].seriesData[seriesDataindex].indexOrder);
        expect(item).toHaveProperty('indexName', forcastSeries[index].seriesData[seriesDataindex].indexName);
        expect(item).toHaveProperty('value', forcastSeries[index].seriesData[seriesDataindex].value);
        expect(item.valueType).toHaveProperty('typeName', forcastSeries[index].seriesData[seriesDataindex].dataTypeName);
      })
    })
  })

  // Test to fetch series data by ID
  test('Get series Data by id', async () => {
    const getSeriesUrl = `${API_ENDPOINTS.createProject}/${projectId}/seriesid/${seriesId}`;

    const response = await getRequest(getSeriesUrl, headers);
    const responseBody = await response.json();
    const seriesData = responseBody.seriesData;

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('seriesId', seriesId);
    expect(responseBody).toHaveProperty('indexOrder', forcastSeries[0].indexOrder);

    // Validate series data
    seriesData.forEach((item, seriesDataindex) => {
      expect(item).toHaveProperty('indexOrder', forcastSeries[0].seriesData[seriesDataindex].indexOrder);
      expect(item).toHaveProperty('indexName', forcastSeries[0].seriesData[seriesDataindex].indexName);
      expect(item).toHaveProperty('value', forcastSeries[0].seriesData[seriesDataindex].value);
      expect(item.valueType).toHaveProperty('typeName', forcastSeries[0].seriesData[seriesDataindex].dataTypeName);
    })
  })

})