import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { ValidTestData } from '../../data/SignUpData';
import { ProjectsPage } from '../../../pages/projectsPage';
import { getData } from '../../utils/apiHelper';
import { Credentials } from '../../data/testData';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { publishProjectData } from '../../data/IntegrationtestData';


test.describe('add data for publish the project', () => {
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
    // Log out after each test to reset state
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    expect(page).toHaveURL(`${baseURL}/login`);
  })

  // Iterate over publishProjectData to create tests dynamically
  publishProjectData.forEach(({ description, action, uploadFile }) => {
    test(`add data in ${description}`, async ({ page, baseURL }) => {
      const projectsPage = new ProjectsPage(page, baseURL);
      await projectsPage.viewProject()

      // Wait for API responses related to project data and modular benefits
      const [projectResponse, mbpResponse] = await Promise.all([
        page.waitForResponse(response =>
          response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}`) &&
          response.status() === 200
        ),
        page.waitForResponse(response =>
          response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project`) &&
          response.status() === 200
        )
      ]);

      // Verify responses for project and modular benefit endpoints
      expect(projectResponse.status()).toBe(200);
      expect(mbpResponse.status()).toBe(200);

      expect(page).toHaveURL(`${baseURL}/projects/${projectId}/overview`);

      // Add CSS to disable specific UI elements
      await page.addStyleTag({
        content: '#zsfeedbackwidgetdiv { pointer-events: none; }'
      });

      const porjectTitle = await projectsPage.porjectTitle();
      expect(porjectTitle).toBe('Automationproject3');

      await projectsPage[action]();


      if (uploadFile) {
        // Handle file upload if applicable
        const filePath = require('path').resolve(__dirname, '../../assets/file2.png');

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

  test('Publish project', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.viewProject()
    const publishButton = await projectsPage.publishButton();

    // Find the "Publish" button and wait for it to be visible
    await publishButton.waitFor({ state: 'visible' });
    await publishButton.click();

    // Find the "Unpublish" button and check its visibility
    const unpublishButton = await projectsPage.unPublishButton();
    await unpublishButton.waitFor({ state: 'visible' });
    const isButtonVisible = await unpublishButton.isVisible();
    expect(isButtonVisible).toBe(true);

    // Find the "Share" button and check its visibility
    const shareButton = await projectsPage.shareButton();
    const isShareButtonVisible = await shareButton.isVisible();
    expect(isShareButtonVisible).toBe(true);
  })

  test('Unpublish project', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.viewProject();

    const unpublishButton = await projectsPage.unPublishButton();

    // Find the "Unpublish" button and wait for it to be visible
    await unpublishButton.waitFor({ state: 'visible' });
    await unpublishButton.click();
    await projectsPage.confirmButton();
    const publishButton = await projectsPage.publishButton();

    // Find the "Publish" button and check its visibility
    await publishButton.waitFor({ state: 'visible' });
    const isButtonVisible = await publishButton.isVisible();
    expect(isButtonVisible).toBe(true);
  })

})