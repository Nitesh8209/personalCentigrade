const { test, expect } = require('@playwright/test');
const { API_ENDPOINTS } = require('../../../api/apiEndpoints');
const { deleteRequest, postRequest, getRequest } = require('../../utils/apiHelper');
const { API_BASE_URL, Credentials } = require('../../data/testData');
const { ValidTestData } = require('../../data/SignUpData');

test.describe('Edge Case Testing for Settings Page', () => {

  test('Delete the Organization', async () => {
    const url = `${API_BASE_URL}/auth/token`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const data = new URLSearchParams({
      username: Credentials.username,
      password: Credentials.password,
    });

    const response = await postRequest(url, data, headers);
    const responseBody = await response.json();
    expect(response.status).toBe(200);

    const accessToken = responseBody.access_token;

    const organizationResponse = await getRequest(`${API_ENDPOINTS.organization}?name=${ValidTestData.organizationName}`, headers); // Replace with the actual organization ID
    const organizationResponseBody = await organizationResponse.json()
    expect(organizationResponse.status).toBe(200);
    const organizationId = organizationResponseBody[0].id; // Assuming the response contains an array of organizations
    
    const deleteOrganizationUrl = `${API_ENDPOINTS.organization}/${organizationId}`;
    const deleteOrganizationHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${accessToken}`
    };

    // // Send DELETE request to delete the organization
    const deleteOrganizationresponse = await deleteRequest(deleteOrganizationUrl, deleteOrganizationHeaders);
    expect(deleteOrganizationresponse.status).toBe(200);
  });
})