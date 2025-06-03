import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';

// Test suite for creating and managing a modular benefit project
test.describe('Create and Manage Modular Benefit Project', { tag: '@API' }, () => {
  // Retrieve necessary data from storage for the test
  const { projectAccessToken, projectId } = getData('Api');
  let headers;
  let modularProjectId;

  // Set up headers before all tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`
    };
  });

  // Test case to create a modular benefit project
  test('Create Modular-Benefit-Project', async () => {
    const data = {
      grapheneProjectId: projectId,
    };
    const modularUrl = `${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project`;
    const response = await postRequest(modularUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    // Assertions to verify the response
    expect(response.status).toBe(201);
    expect(responseBody).toHaveProperty('id', expect.any(Number));
    expect(responseBody).toHaveProperty('grapheneProjectId', projectId);

    // Save the mbp ID for later tests
    modularProjectId = responseBody.id;
    await saveData({ modularProjectId: modularProjectId }, 'Api');
  })

  // Test case to retrieve modular benefit projects
  test('Get modular-benefit-project', async () => {
    if (!modularProjectId) {
      const data = getData('Api');
      modularProjectId = data.modularProjectId;
    }
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project`;

    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    // Assertions to validate the response
    expect(response.status).toBe(200);
    expect(responseBody[0]).toHaveProperty('id', modularProjectId);
    expect(responseBody[0]).toHaveProperty('grapheneProjectId', projectId);
    expect(responseBody[0]).toHaveProperty('classificationCategory', null);
    expect(responseBody[0]).toHaveProperty('classificationMethod', null);
    expect(responseBody[0]).toHaveProperty('projectType', null);
    expect(responseBody[0]).toHaveProperty('projectScale', null);
  })

  // Test case to update the modular benefit project
  test('Update modular-benefit-project', async () => {
    if (!modularProjectId) {
      const data = getData('Api');
      modularProjectId = data.modularProjectId;
    }
    const data = {
      classificationCategory: "[\"Carbon reduction\",\"Carbon removal\"]",
      classificationMethod: "Natural - The activity claim uses natural methods (e.g. IFM)",
      projectScale: "Medium (10,000 - 100,000 tCO2e)",
      projectType: "ifm"
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
    expect(responseBody.projectType).toMatchObject({
      id: 14,
      name: "ifm",
      nickname: "IFM",
      description: "Improved Forest Management (IFM)"
    });
    expect(responseBody).toHaveProperty('projectScale', "Medium (10,000 - 100,000 tCO2e)");
  })

  // Test case to retrieve the modular benefit project by ID
  test('Get modular-benefit-project by ID', async () => {
    if (!modularProjectId) {
      const data = getData('Api');
      modularProjectId = data.modularProjectId;
    }

    const getProjectUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}`;

    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    // Assertions to verify the details of the retrieved project
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('id', modularProjectId);
    expect(responseBody).toHaveProperty('grapheneProjectId', projectId);
    expect(responseBody).toHaveProperty('classificationCategory', "[\"Carbon reduction\",\"Carbon removal\"]");
    expect(responseBody).toHaveProperty('classificationMethod', "Natural - The activity claim uses natural methods (e.g. IFM)");
    expect(responseBody.projectType).toMatchObject({
      id: 14,
      name: "ifm",
      nickname: "IFM",
      description: "Improved Forest Management (IFM)"
    });
    expect(responseBody).toHaveProperty('projectScale', "Medium (10,000 - 100,000 tCO2e)");
  })

  // Test case to create a configuration for the modular benefit project
  test('Create Modular-Benefit-Project with Config for Methodology', async () => {
    if (!modularProjectId) {
      const data = getData('Api');
      modularProjectId = data.modularProjectId;
    }
    const config_id = 13;
    const mbpConfigUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}/config/${config_id}`;
    const mbpConfigData = {}
    const mbpresponse = await postRequest(mbpConfigUrl, mbpConfigData, headers);
    const mbpResponseBody = mbpresponse.json();

    // Validate the response
    expect(mbpresponse.status).toBe(200);
  })

  // Test case to retrieve configuration data for a modular benefit project
  test('Get Modular-Benefit-Project Config Data by Config_ID', async () => {
    if (!modularProjectId) {
      const data = getData('Api');
      modularProjectId = data.modularProjectId;
    }
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
    expect(firstResponce.viewStepId === null || typeof firstResponce.viewStepId === 'number').toBe(true)
    expect(firstResponce.viewSectionId === null || typeof firstResponce.viewSectionId === 'number').toBe(true)
  })

})