import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { ProjectsPage } from '../../../pages/projectsPage';
import { getData } from '../../utils/apiHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { publishProjectData } from '../../data/IntegrationtestData';
import path from 'path';

test.describe('Add data for publishing the project', () => {
  const { newEmail, projectId } = getData('Integration');
  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'auth-admin.json');
  test.use({ storageState: authStoragePath });


  test.beforeEach(async ({page, baseURL}) => {
     // Initialize browser and login
     const loginPage = new LoginPage(page, baseURL);

     await loginPage.navigate();
  });


  publishProjectData.forEach(({ description, action, uploadFile }) => {
    test(`Add data in ${description}`, async ({page, baseURL }) => {
      
      const projectsPage = new ProjectsPage(page, baseURL);
      await projectsPage.viewProject();

      // Wait for responses related to project and modular benefits
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
      await expect(page).toHaveURL(`${baseURL}/projects/${projectId}/overview`);
    
      const projectTitle = await projectsPage.porjectTitle();
      expect(projectTitle).toBe('Automationproject3');
      
      // Disable specific UI elements
      await page.addStyleTag({
        content: '#zsfeedbackwidgetdiv { pointer-events: none; }'
      });


      await projectsPage[action]();       

      if (uploadFile) {
        // Handle file upload
        const filePath = require('path').resolve(__dirname, '../../assets/file2.png');
        await projectsPage.uploadfile(filePath);

        // Upload the file and verify the upload process
        const projectFileResponse = await page.waitForResponse(response =>
          response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}`) &&
          response.status() === 200
        );

        expect(projectFileResponse.status()).toBe(200);

        const fileMessage = await projectsPage.uploadfileSuccessMsg();
        await expect(fileMessage).toBe('file2.png');
      }

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
    });
  });

  test('Publish project', async ({ page, baseURL }) => {
    const projectsPage = new ProjectsPage(page, baseURL);
    await projectsPage.viewProject();

    const publishButton = await projectsPage.publishButton();
    await publishButton.waitFor({ state: 'visible' });
    await publishButton.click();

    const unpublishButton = await projectsPage.unPublishButton();
    await unpublishButton.waitFor({ state: 'visible' });
    expect(await unpublishButton.isVisible()).toBe(true);

    const shareButton = await projectsPage.shareButton();
    expect(await shareButton.isVisible()).toBe(true);
  });

  test('Unpublish project', async ({page, baseURL }) => {
    const projectsPage = new ProjectsPage(page, baseURL);
    await projectsPage.viewProject();

    const unpublishButton = await projectsPage.unPublishButton();

    // Find the "Unpublish" button and wait for it to be visible
    await unpublishButton.waitFor({ state: 'visible' });
    await unpublishButton.click();
    await projectsPage.confirmButton();
    const publishButton = await projectsPage.publishButton();

    // Find the "Publish" button and check its visibility
    await publishButton.waitFor({ state: 'visible' });
    expect(await publishButton.isVisible()).toBe(true);
  });
});
