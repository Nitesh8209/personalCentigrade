import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest } from '../../utils/apiHelper';
import { validateProjectFieldValues } from '../../utils/projectHelper';
import * as fs from 'fs';
import path from 'path';

test.describe('Fill all Fields', { tag: '@API' }, () => {
  // Retrieve required data like tokens, organizationId, and projectId from saved data
  const { projectAccessToken, guid } = getData('Api');

  let headers;
  let remainingFields;
  let projectApproach;

  test.beforeAll(async () => {
    // Set headers with authorization token and content type
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`,
      'x-centigrade-organization-id': 409
    };

    const filePathTier0 = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "Project-publish-data.json"
    );
    const rawDataTier0 = fs.readFileSync(filePathTier0, "utf-8");
    const tier0Fields = JSON.parse(rawDataTier0);
    projectApproach = tier0Fields.fields;

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "Project-publish-data-non-tier0.json"
    );
    const rawData = fs.readFileSync(filePath, "utf-8");
    const fieldsData = JSON.parse(rawData);
    remainingFields = fieldsData.fields;
  });

  // Test to create project field values
  test('Post Request project-field-values for all Fields', async () => {
    const projectfieldvalueUrl = `${API_ENDPOINTS.createProjectguid(guid)}/project-field-values`;

    // Send a POST request with project approach data
    const response = await postRequest(projectfieldvalueUrl, JSON.stringify(remainingFields), headers);
    const responseBody = await response.json();
 
    // Verify the response status and structure
    expect(response.status).toBe(201);
    expect(Array.isArray(responseBody)).toBe(true);

    // Validate the response data
    validateProjectFieldValues(remainingFields.items, responseBody);
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
    const expectedData = [...projectApproach.items, ...remainingFields.items];
    validateProjectFieldValues(expectedData, responseBody);
  })

})