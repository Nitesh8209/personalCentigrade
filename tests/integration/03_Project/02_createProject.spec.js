import { test, expect } from '@playwright/test';
import { ProjectsPage } from "../../../pages/projectsPage"
import { LoginPage } from "../../../pages/loginPage"
import { ValidTestData } from '../../data/SignUpData';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData, saveData } from '../../utils/apiHelper';

test.describe('Create Project for Tests', () => {
  const { newEmail } = getData('Integration');


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
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    expect(page).toHaveURL(`${baseURL}/login`);
  })

  test('create project', async ({ page, baseURL }) => {
    const projectsPage = new ProjectsPage(page, baseURL);
    const projectName = 'Automationproject3';
    await projectsPage.createProject(projectName);

    // Wait for and validate project creation response
    const projectResponse = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.createProject)
    );
    expect(projectResponse.status()).toBe(201);
    const projectResponseBody = await projectResponse.json();

    // Wait for and validate modular benefit project response
    const mbpResponse = await page.waitForResponse(
      response => response.url().includes(`${API_ENDPOINTS.createProject}/${projectResponseBody.id}/modular-benefit-project`)
    );
    expect(mbpResponse.status()).toBe(201);
    const mbpResponseBody = await mbpResponse.json();

    // Wait for and validate project configuration response
    const configResponse = await page.waitForResponse(
      response => response.url().includes(`${API_ENDPOINTS.modularbenefitproject}/${mbpResponseBody.id}/config/13`)
    )
    expect(configResponse.status()).toBe(200);

    // Validate project title and URL
    const porjectTitle = await projectsPage.porjectTitle();
    expect(page).toHaveURL(`${baseURL}/projects/${projectResponseBody.id}/overview`);
    expect(porjectTitle).toBe(projectName);
    await saveData({ projectId: projectResponseBody.id }, 'Integration');
  })

})