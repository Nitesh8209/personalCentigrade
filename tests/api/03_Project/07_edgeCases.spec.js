import { test, expect } from '@playwright/test';
import { deleteRequest, getData, getRequest, postRequest, putRequest } from '../../utils/apiHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { forcastSeries } from '../../data/projectData';
const fs = require('fs');

// Read the file from the specified path into a buffer
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

test.describe('Edge Case Testing for Projects API', () => {
  // Fetch authentication token and project-related IDs from saved test data
  const { InviteaccessToken, projectId, modularProjectId } = getData('Api');
  let headers;

  test.beforeAll(async () => {
    // Initialize headers for requests
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
    };
  });

  const expectModelNotFound = async (response, resourceId) => {
    const responseBody = await response.json();
    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'GrapheneProject not found');
    expect(responseBody.context).toHaveProperty('graphene_project_id', resourceId);
  };

  test('Delete a project by ID', async () => {
    const projectUrl = `${API_ENDPOINTS.createProject}/${projectId}`
    const response = await deleteRequest(projectUrl, headers);
    expect(response.status).toBe(204);
  })

  test('Fetch a deleted project', async () => {
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    const response = await getRequest(getProjectUrl, headers);

    await expectModelNotFound(response, projectId);
  })

  test('Attempt to update a deleted project', async () => {
    const ProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}`;
    console.log(ProjectUrl);
    const projectData = {
      domain: "https://devfoundry.centigrade.earth/",
    };
    const response = await putRequest(ProjectUrl, JSON.stringify(projectData), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'graphene_project not found');
    expect(responseBody.context).toHaveProperty('graphene_project_id', projectId);
  })

  test('Check the state of a deleted project', async () => {
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}/state`;
    const response = await getRequest(getProjectUrl, headers);

    await expectModelNotFound(response, projectId);
  })

  test('Attempt to update the state of a deleted project', async () => {
    const projectstateUrl = `${API_ENDPOINTS.createProject}/${projectId}/state`;
    const data = {}
    const response = await putRequest(projectstateUrl, JSON.stringify(data), headers);

    await expectModelNotFound(response, projectId);
  })

  test('Create a modular-benefit-project of a deleted project', async () => {
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

    // write the expect message
  })

  test('Fetch a non-existent modular-benefit-project', async () => {
    const getProjectUrl = `${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project`;
    const response = await getRequest(getProjectUrl, headers);

    await expectModelNotFound(response, projectId);
  })

  test('Update a modular-benefit-project of a deleted project', async () => {
    const data = {
      projectScale: "Medium (10000 - 100000 tCO2e)",
    };
    const modularUrl = `${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project/${modularProjectId}`;
    const response = await putRequest(modularUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', "mbp not found");
    expect(responseBody.context).toHaveProperty('exception', '404: mbp not found');
  })

  test('Fetch modular-benefit-project by ID of a deleted project', async () => {
    const getProjectUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}`;
    const response = await getRequest(getProjectUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', "Project not found");
    expect(responseBody.context).toHaveProperty('exception', '404: Project not found');
  })

  test('set config for project', async () => {
    const config_id = 1;
    const mbpConfigUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}/config/${config_id}`;
    const mbpConfigData = {}
    const mbpresponse = await putRequest(mbpConfigUrl, mbpConfigData, headers);
    const mbpResponseBody = await mbpresponse.json();

    expect(mbpresponse.status).toBe(500);
    expect(mbpResponseBody).toHaveProperty('statusCode', 500);
    expect(mbpResponseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(mbpResponseBody).toHaveProperty('errorMessage', "An error occurred while processing the request: 404: Project not found");
    expect(mbpResponseBody.context).toHaveProperty('exception', '500: An error occurred while processing the request: 404: Project not found');
  })

  test('Get Modular-Benefit-Project Config Data by Config_ID', async () => {
    const getConfigUrl = `${API_ENDPOINTS.modularbenefitproject}/${modularProjectId}/config`;
    const response = await getRequest(getConfigUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', "Project not found");
    expect(responseBody.context).toHaveProperty('exception', '404: Project not found');
  })

  // test('Create Project-Field-Values of a deleted project', async () => {
  //   const projectfieldvalueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;
  //   const response = await postRequest(projectfieldvalueUrl, JSON.stringify(projectApproach), headers);
  //   const responseBody = await response.json();

  //   // given internal server error so after write expect message
  // })

  test('Fetch Project-Field-Values of a deleted project', async () => {
    const projectfieldvalueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;
    const response = await getRequest(projectfieldvalueUrl, headers);

    await expectModelNotFound(response, projectId);
  })

  test('Fetch Project Fields of a deleted project', async () => {
    const projectFiledsUrl = `${API_ENDPOINTS.createProject}/${projectId}/fields`;
    const response = await getRequest(projectFiledsUrl, headers);

    await expectModelNotFound(response, projectId);
  })

  test('Upload file to a deleted project', async ({ request }) => {
    const fileUrl = `${API_ENDPOINTS.createProject}/${projectId}/file`;
    const fileData = {
      multipart: {
        projectFileType: 'projectMedia',
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
    const response = await request.post(fileUrl, fileData);
    const responseBody = await response.json();

    expect(response.status()).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'GrapheneProject not found');
    expect(responseBody.context).toHaveProperty('graphene_project_id', projectId);
  })

  test('Upload series data to a deleted project', async () => {
    const uploadSeriesUrl = `${API_ENDPOINTS.createProject}/${projectId}/series`;
    const response = await postRequest(uploadSeriesUrl, JSON.stringify(forcastSeries[0]), headers);

    await expectModelNotFound(response, projectId);
  })

  test('Fetch series Data to a deleted project', async () => {
    const getSeriesUrl = `${API_ENDPOINTS.createProject}/${projectId}/series/estimatedBaseline`;
    const response = await getRequest(getSeriesUrl, headers);

    await expectModelNotFound(response, projectId);
  })

})