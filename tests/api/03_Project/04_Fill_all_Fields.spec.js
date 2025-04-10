import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, getRequest, postRequest } from '../../utils/apiHelper';
import { projectApproach, remainingFields } from '../../data/projectData';
import { validateProjectFieldValues } from '../../utils/projectHelper';

test.describe('Fill all Fields', { tag: '@API' }, () => {
  // Retrieve required data like tokens, organizationId, and projectId from saved data
  const { projectAccessToken, projectId } = getData('Api');

  let headers;

  test.beforeAll(async () => {
    // Set headers with authorization token and content type
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`
    };
  });

  // Test to create project field values
  test('Post Request project-field-values for all Fields', async () => {
    const projectfieldvalueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

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

    const projectfieldvalueUrl = `${API_ENDPOINTS.createProject}/${projectId}/project-field-values`;

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