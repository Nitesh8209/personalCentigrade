import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';

// Test suite for creating and managing a modular benefit project
test.describe('Create and Manage Modular Benefit Project', () => {
  // Retrieve necessary data from storage for the test
  const { InviteaccessToken, projectId } = getData('Api');
  let headers;
  let modularProjectId;

  // Set up headers before all tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
    };
  });

  // Test case to create a modular benefit project
  test('Create Modular-Benefit-Project', async () => {
    const data = {
      classificationCategory: "[\"Carbon reduction\",\"Carbon removal\"]",
      classificationMethod: "Natural - The activity claim uses natural methods (e.g. IFM)",
      grapheneProjectId: projectId,
      projectScale: "Small (1000 - 10000 tCO2e)",
      projectType: "Improved Forest Management (IFM)"
    };
    const modularUrl = `${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project`;
    const response = await postRequest(modularUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    // Assertions to verify the response
    expect(response.status).toBe(201);
    expect(responseBody).toHaveProperty('id', expect.any(Number));
    expect(responseBody).toHaveProperty('grapheneProjectId', projectId);
    expect(responseBody).toHaveProperty('classificationCategory', "[\"Carbon reduction\",\"Carbon removal\"]");
    expect(responseBody).toHaveProperty('classificationMethod', "Natural - The activity claim uses natural methods (e.g. IFM)");
    expect(responseBody).toHaveProperty('projectType', "Improved Forest Management (IFM)");
    expect(responseBody).toHaveProperty('projectScale', "Small (1000 - 10000 tCO2e)");

    // Save the mbp ID for later tests
    modularProjectId = responseBody.id;
    await saveData({ modularProjectId: modularProjectId }, 'Api');
  })

  // Test case to retrieve modular benefit projects
  test('Get modular-benefit-project', async () => {
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project`;

    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    // Assertions to validate the response
    expect(response.status).toBe(200);
    expect(responseBody[0]).toHaveProperty('id', modularProjectId);
    expect(responseBody[0]).toHaveProperty('grapheneProjectId', projectId);
    expect(responseBody[0]).toHaveProperty('classificationCategory', "[\"Carbon reduction\",\"Carbon removal\"]");
    expect(responseBody[0]).toHaveProperty('classificationMethod', "Natural - The activity claim uses natural methods (e.g. IFM)");
    expect(responseBody[0]).toHaveProperty('projectType', "Improved Forest Management (IFM)");
    expect(responseBody[0]).toHaveProperty('projectScale', "Small (1000 - 10000 tCO2e)");
  })

  // Test case to update the modular benefit project
  test('Update modular-benefit-project', async () => {
    const data = {
      projectScale: "Medium (10000 - 100000 tCO2e)",
    };
    const modularUrl = `${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project/${modularProjectId}`;

    const response = await putRequest(modularUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    // Assertions to confirm the update
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', modularProjectId);
    expect(responseBody).toHaveProperty('grapheneProjectId', projectId);
    expect(responseBody).toHaveProperty('classificationCategory', "[\"Carbon reduction\",\"Carbon removal\"]");
    expect(responseBody).toHaveProperty('classificationMethod', "Natural - The activity claim uses natural methods (e.g. IFM)");
    expect(responseBody).toHaveProperty('projectType', "Improved Forest Management (IFM)");
    expect(responseBody).toHaveProperty('projectScale', "Medium (10000 - 100000 tCO2e)");
  })

  // Test case to retrieve the modular benefit project by ID
  test('Get modular-benefit-project by ID', async () => {
    const getProjectUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}`;

    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    // Assertions to verify the details of the retrieved project
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', modularProjectId);
    expect(responseBody).toHaveProperty('grapheneProjectId', projectId);
    expect(responseBody).toHaveProperty('classificationCategory', "[\"Carbon reduction\",\"Carbon removal\"]");
    expect(responseBody).toHaveProperty('classificationMethod', "Natural - The activity claim uses natural methods (e.g. IFM)");
    expect(responseBody).toHaveProperty('projectType', "Improved Forest Management (IFM)");
    expect(responseBody).toHaveProperty('projectScale', "Medium (10000 - 100000 tCO2e)");
  })

  // Test case to create a configuration for the modular benefit project
  test('Create Modular-Benefit-Project with Config for Methodology', async () => {
    const config_id = 1;
    const mbpConfigUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}/config/${config_id}`;
    const mbpConfigData = {}
    const mbpresponse = await postRequest(mbpConfigUrl, mbpConfigData, headers);
    const mbpResponseBody = mbpresponse.json();

    // Validate the response
    expect(mbpresponse.status).toBe(200);
  })

  // Test case to retrieve configuration data for a modular benefit project
  test('Get Modular-Benefit-Project Config Data by Config_ID', async () => {
    const getConfigUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}/config`;

    const response = await getRequest(getConfigUrl, headers);
    const responseBody = await response.json();
    const firstResponce = responseBody[0];

    // Validate the response and its properties
    expect(response.status).toBe(200);
    expect(firstResponce).toHaveProperty('id', expect.any(Number));
    expect(firstResponce).toHaveProperty('name', expect.any(String));
    expect(firstResponce).toHaveProperty('tier', expect.any(Number));
    expect(firstResponce).toHaveProperty('domain', expect.any(String));
    expect(firstResponce).toHaveProperty('component', expect.any(String));
    expect(firstResponce).toHaveProperty('label', expect.any(String));
    expect(firstResponce).toHaveProperty('type', expect.any(String));
    expect(firstResponce).toHaveProperty('viewStepId', expect.any(Number));
    expect(firstResponce).toHaveProperty('viewSectionId', expect.any(Number));
  })

})