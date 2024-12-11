import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/loginPage';
import { ValidTestData } from '../../data/SignUpData';
import { ProjectsPage } from '../../../pages/projectsPage';
import { Credentials } from '../../data/testData';
import API_ENDPOINTS from '../../../api/apiEndpoints';

test.describe('Update Role Type of the organization', () => {

  test.beforeEach(async ({ page, baseURL }) => {

    // Initialize browser and login
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to the login page
    await loginPage.navigate();

    // Enter username and password
    await loginPage.enterEmail(Credentials.username);
    await loginPage.enterPassword(Credentials.password);
    await loginPage.submit();
    await page.waitForLoadState('networkidle');
  })

  test.afterEach(async ({ page, baseURL }) => {
    // After each test, log out of the application
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    expect(page).toHaveURL(`${baseURL}/login`);
  })

  test('Update the role type', async ({ page, baseURL }) => {

    // Test case to update the role type for an organization
    const projectsPage = new ProjectsPage(page, baseURL);

    await projectsPage.selectOrg(ValidTestData.organizationName);
    await projectsPage.setting();
    await projectsPage.organizationButton();

    // Update the role type for the organization
    await projectsPage.updateroleType();

    // Wait for the response from the API that confirms the role update
    const rolesResponse = await page.waitForResponse(
      response => response.url().includes(`${API_ENDPOINTS.organization}/`)
    )

    const responseData = await rolesResponse.json();
    const organizationTypes = responseData.organizationTypes;

    // Get the success message displayed on the UI
    const updateMessage = await projectsPage.updateMessage();
    expect(updateMessage).toBe('Your changes have been saved.');

    // Verify specific organization types exist in the API response
    const formBasicExists = organizationTypes.some(type => type.name === 'FORM_BASIC');
    const formCreatorExists = organizationTypes.some(type => type.name === 'FORM_CREATOR');

    // Assertions to ensure the role types are correctly updated
    expect(formBasicExists).toBeTruthy();
    expect(formCreatorExists).toBeTruthy();
  })

})