import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { ValidTestData } from '../../data/SignUpData';
import { ProjectsPage } from '../../../pages/projectsPage';
import { getData } from '../../utils/apiHelper';
import { Credentials } from '../../data/testData';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { forecastData, publishProjectData } from '../../data/IntegrationtestData';


test.describe('add data for TIER-1 forecast fields', () => {
  const { newEmail, projectId } = getData('Integration');

  test.beforeEach(async ({ page, baseURL }) => {

    // Initialize browser and login
    const loginPage = new LoginPage(page, baseURL);

    await loginPage.navigate();
    await loginPage.enterEmail(newEmail);
    await loginPage.enterPassword(ValidTestData.newPassword);
    await loginPage.submit();
    await page.waitForLoadState('networkidle');
  })

  test.afterEach(async ({ page, baseURL }) => {
    // Perform logout steps after each test
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    expect(page).toHaveURL(`${baseURL}/login`);
  })


  forecastData.forEach(({ description, action, uploadFile }) => {
    test(`add data in ${description}`, async ({ page, baseURL }) => {
      const projectsPage = new ProjectsPage(page, baseURL);
      await projectsPage.viewProject()

      // Verify the project title and page URL
      const porjectTitle = await projectsPage.porjectTitle();
      expect(porjectTitle).toBe('Automationproject3');
      expect(page).toHaveURL(`${baseURL}/projects/${projectId}/overview`);

      await page.addStyleTag({
        content: '#zsfeedbackwidgetdiv { pointer-events: none; }'
      });

      await projectsPage[action]();


      if (uploadFile) {
        const path = require('path');
        const filePath = path.join(__dirname, '../../assets/file2.png');
        await projectsPage.uploadfile(filePath);

        // Upload the file and verify the upload process
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


})