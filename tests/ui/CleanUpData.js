import test, { expect } from '@playwright/test';
import API_ENDPOINTS from '../../api/apiEndpoints';
import { deleteRequest, getData, getRequest, postRequest } from '../utils/apiHelper';
import { Credentials, projectValidationCredentials } from '../data/testData';
import { ValidTestData } from '../data/SignUpData';



let headers;

export default async function globalTeardown() {
  const authdata = new URLSearchParams({
    username: projectValidationCredentials.email,
    password: projectValidationCredentials.password,
  });
  const authHeader = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  console.log('Delete tear down called......')

  // Delete the Project
  const authResponse = await postRequest(
    API_ENDPOINTS.authTOken,
    authdata,
    authHeader
  );
  const authResponseBody = await authResponse.json();
  const accessToken = authResponseBody.access_token;
  headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };
  const { ValidateProjectId } = getData('UI');
  const projectUrl = `${API_ENDPOINTS.createProject}/${ValidateProjectId}`
  const response = await deleteRequest(projectUrl, headers);
  console.log(response)


  // delete the organization AutomationUi
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const data = new URLSearchParams({
    username: Credentials.username,
    password: Credentials.password,
  });
  const authresponse = await postRequest(API_ENDPOINTS.authTOken, data, headers);
  const responseBody = await authresponse.json();
  const authaccessToken = responseBody.access_token;

  // Delete automationUi organization if exists 
  const organizationResponse = await getRequest(`${API_ENDPOINTS.organization}?name=${ValidTestData.organizationName}`, headers); // Replace with the actual organization ID
  const organizationResponseBody = await organizationResponse.json()
  console.log(organizationResponseBody)
  expect(organizationResponse.status).toBe(200);
  if(organizationResponseBody[0]?.id){
    const organizationId = organizationResponseBody[0].id; // Assuming the response contains an array of organizations
    const deleteOrganizationUrl = `${API_ENDPOINTS.organization}/${organizationId}`;
    const deleteOrganizationHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${authaccessToken}`
    };
    if (organizationResponseBody[0].organizationName == ValidTestData.organizationName) {
      // Send DELETE request to delete the organization
      const deleteOrganizationresponse = await deleteRequest(deleteOrganizationUrl, deleteOrganizationHeaders);
      console.log(deleteOrganizationresponse)
    }
  }

  // Delete automationApi organization if exists
  const automationApiResponse = await getRequest(`${API_ENDPOINTS.organization}?name=${ValidTestData.apiOrganizationName}`, headers); // Replace with the actual organization ID
  const automationApiResponsebody = await automationApiResponse.json()
  console.log(automationApiResponsebody)
  expect(automationApiResponse.status).toBe(200);
  if(automationApiResponsebody[0]?.id){
    const organizationId = automationApiResponsebody[0].id; // Assuming the response contains an array of organizations
    const deleteOrganizationUrl = `${API_ENDPOINTS.organization}/${organizationId}`;
    const deleteOrganizationHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${authaccessToken}`
    };
    if (automationApiResponsebody[0].organizationName == ValidTestData.apiOrganizationName) {
      // Send DELETE request to delete the organization
      const deleteOrganizationresponse = await deleteRequest(deleteOrganizationUrl, deleteOrganizationHeaders);
      console.log(deleteOrganizationresponse)
    }
  }

}