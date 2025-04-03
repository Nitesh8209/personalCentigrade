import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { ValidTestData } from '../../data/SignUpData';
import { ProjectsPage } from '../../../pages/projectsPage';
import { deleteRequest, getData, getRequest } from '../../utils/apiHelper';
import { Credentials } from '../../data/testData';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { EnhancementsData } from '../../data/IntegrationtestData';
const fs = require('fs');
const path = require('path');

test.describe('add data for TIER-3 Enhancements fields', () => {
  const { newEmail, projectId } = getData('Integration');
  const { admin_access_token } = getData();
  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'auth-admin.json');

  test.afterEach(async ({ page, baseURL }) => {
    // Perform logout steps after each test
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    await expect(page).toHaveURL(`${baseURL}/login`);
  })

  test.afterAll(async () => {
    // Delete the authStroage file after tests are complete
    if (fs.existsSync(authStoragePath)) {
      fs.unlinkSync(authStoragePath);
    }
  });

  // Iterate through the EnhancementsData array and create a test for each item
  EnhancementsData.forEach(({ description, action, uploadFile }) => {
    test(`add data in ${description}`, async ({ page, baseURL }) => {
      const loginPage = new LoginPage(page, baseURL);

      await loginPage.navigate();
      await loginPage.enterEmail(newEmail);
      await loginPage.enterPassword(ValidTestData.newPassword);
      await loginPage.submit();
      await page.waitForLoadState('networkidle');

      const projectsPage = new ProjectsPage(page, baseURL);
      await projectsPage.viewProject()

      // Verify the project title and page URL
      const projectTitle = await projectsPage.projectTitle();
      expect(projectTitle).toBe('Automationproject3');
      expect(page).toHaveURL(`${baseURL}/projects/${projectId}/overview`);

      await page.addStyleTag({
        content: '#zsfeedbackwidgetdiv { pointer-events: none; }'
      });

      await projectsPage[action]();

      if (uploadFile) {
        const path = require('path');
        const filePath = path.join(__dirname, '../../assets/file2.png');

        // Upload the file and verify the upload process
        await projectsPage.uploadfile(filePath);
        const projectFileResponse = await page.waitForResponse(response =>
          response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}`) &&
          response.status() === 200
        );


        expect(projectFileResponse.status()).toBe(200);

        const fileMessage = await projectsPage.uploadfileSuccessMsg();
        expect(fileMessage).toBe('file2.png');
      }

      await page.waitForLoadState('networkidle');
      await projectsPage.saveProjectDetails();

      // Verify the API response for saving the project field values
      const pfvResponse = await page.waitForResponse(response =>
        response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}/project-field-values`) &&
        response.status() === 201
      );

      expect(pfvResponse.status()).toBe(201);
      const savedMessage = await projectsPage.updateMessage();
      expect(savedMessage).toBe('Your changes have been saved');

      // Verify the subsequent API response for retrieving project field values
      const pfvGetResponse = await page.waitForResponse(response =>
        response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}/project-field-values`) &&
        response.status() === 200
      );
      expect(pfvGetResponse.status()).toBe(200);

    })
  })

  test('Update the role type', async ({ page, baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);

    await loginPage.navigate();
    await loginPage.enterEmail(Credentials.username);
    await loginPage.enterPassword(Credentials.password);
    await loginPage.submit();
    await page.waitForLoadState('networkidle');

    // Test case to update the role type for an organization
    const projectsPage = new ProjectsPage(page, baseURL);

    await projectsPage.selectOrg(ValidTestData.organizationName);
    await projectsPage.setting();
    await projectsPage.organizationButton();

    // Update the role type for the organization
    await projectsPage.removeRoletype();

    // Get the success message displayed on the UI
    const updateMessage = await projectsPage.updateMessage();
    expect(updateMessage).toBe('Your changes have been saved.');

    const resetButton = await projectsPage.resetButton();
    await resetButton.click();
    await page.waitForTimeout(5000);
    await projectsPage.setting();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${admin_access_token}`
    };
    const projectUrl = `${API_ENDPOINTS.createProject}/${projectId}`
    const response = await deleteRequest(projectUrl, headers);
    expect(response.status).toBe(204);

    const OrganizationUrl = `${API_ENDPOINTS.organization}?name=${ValidTestData.organizationName}`;
    const getOrganization = await getRequest(OrganizationUrl, headers);
    const getOrganizationresponse = await getOrganization.json();

    const deleteOrganizationUrl = `${API_ENDPOINTS.organization}/${getOrganizationresponse[0].id}`;
    const deleteOrganizationHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${admin_access_token}`
    };

    // Send DELETE request to delete the organization
    const deleteOrganizationresponse = await deleteRequest(deleteOrganizationUrl, deleteOrganizationHeaders);
    expect(deleteOrganizationresponse.status).toBe(200);
  })

})