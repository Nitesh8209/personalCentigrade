import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest } from '../../utils/apiHelper';
import { dataSeries} from '../../data/projectData';


test.describe('Reamining Fields Data Upload Tests' ,{tag: '@API'}, () => {
  // Extract required data for testing
  const { projectAccessToken, draftProjectId , guid} = getData('Api');

  let headers;
  let seriesId;

  // Set up the authorization header before running tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`,
      'x-centigrade-organization-id': 409
    };
  });

  // Test to upload series data
  dataSeries.forEach(({ name, indexOrder }, index) => {
    test(`Upload the series data for ${name} indexOrder ${indexOrder}`, async () => {
      const uploadSeriesUrl = `${API_ENDPOINTS.createProjectguid(guid)}/series`;

      const response = await postRequest(uploadSeriesUrl, JSON.stringify(dataSeries[index]), headers);
      const responseBody = await response.json();
      const seriesData = responseBody.seriesData;

      expect(response.status).toBe(201);
      expect(responseBody).toHaveProperty('name', name);
      expect(responseBody).toHaveProperty('indexOrder', indexOrder);

      // Validate series data
      seriesData.forEach((item, seriesDataindex) => {
        expect(item).toHaveProperty('indexOrder', dataSeries[index].seriesData[seriesDataindex].indexOrder);
        expect(item).toHaveProperty('indexName', dataSeries[index].seriesData[seriesDataindex].indexName);
        expect(item).toHaveProperty('value', dataSeries[index].seriesData[seriesDataindex].value);
        expect(item.valueType).toHaveProperty('typeName', dataSeries[index].seriesData[seriesDataindex].dataTypeName);
      })
    })
  })

  // Test to fetch series data by name
  dataSeries.forEach(({ name, indexOrder }, index) => {
    test(`Get series Data by series Name ${name}`, async () => {
      const getSeriesUrl = `${API_ENDPOINTS.createProject}/${draftProjectId}/series/${name}`;

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
        expect(item).toHaveProperty('indexOrder', dataSeries[index].seriesData[seriesDataindex].indexOrder);
        expect(item).toHaveProperty('indexName', dataSeries[index].seriesData[seriesDataindex].indexName);
        expect(item).toHaveProperty('value', dataSeries[index].seriesData[seriesDataindex].value);
        expect(item.valueType).toHaveProperty('typeName', dataSeries[index].seriesData[seriesDataindex].dataTypeName);
      })
    })
  })

  // Test to fetch series data by ID
  test('Get series Data by id', async () => {
    const getSeriesUrl = `${API_ENDPOINTS.createProject}/${draftProjectId}/seriesid/${seriesId}`;

    const response = await getRequest(getSeriesUrl, headers);
    const responseBody = await response.json();
    const seriesData = responseBody.seriesData;

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('seriesId', seriesId);
    expect(responseBody).toHaveProperty('indexOrder', dataSeries[0].indexOrder);

    // Validate series data
    seriesData.forEach((item, seriesDataindex) => {
      expect(item).toHaveProperty('indexOrder', dataSeries[0].seriesData[seriesDataindex].indexOrder);
      expect(item).toHaveProperty('indexName', dataSeries[0].seriesData[seriesDataindex].indexName);
      expect(item).toHaveProperty('value', dataSeries[0].seriesData[seriesDataindex].value);
      expect(item.valueType).toHaveProperty('typeName', dataSeries[0].seriesData[seriesDataindex].dataTypeName);
    })
  })

})