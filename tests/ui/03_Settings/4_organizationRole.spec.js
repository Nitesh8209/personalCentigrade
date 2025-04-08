import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { Credentials } from "../../data/testData";
import { safeExpect } from "../../utils/authHelper";
import { getData } from "../../utils/apiHelper";
import { ValidTestData } from "../../data/SignUpData";
import path from "path";

const { newEmail } = getData('UI');
test.describe('View Basic Test cases', { tag: '@UI' }, () => {

    let page;
  
    test.beforeAll(async ({ browser, baseURL }) => {
      const context = await browser.newContext();
      page = await context.newPage();

      const loginPage = new LoginPage(page, baseURL);
      await loginPage.navigate();
    });
  
    // Close the browser page after all tests are complete
    test.afterAll(async () => {
      await page.close();
    });

  test.afterEach(async ({ baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    expect(page.url()).toBe(`${baseURL}/login`);
  })

  test('Verify that the "Listed Projects" button is visible on the left Sidebar', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);
    const errors = [];

    // Navigate to login page and perform login
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Ensure that the page navigates to the expected URL
    await safeExpect('Navigate to listings Page', async () => {
      await page.waitForURL('**/listings');
      expect(page.url()).toBe(`${baseURL}/listings`);
    }, errors);

    await safeExpect('Validate listings Button',
      async () => await expect(await projectsPage.listingsButton()).toBeVisible(),
      errors);

    await safeExpect('Validate Project Button',
      async () => await expect(await projectsPage.projectsHomeButton()).not.toBeVisible(),
      errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }  

  })

  test('Verify access control and error handling for project page without the necessary role', async ({ baseURL }) => {
    const errors = [];

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to the login page and Login
    await loginPage.login(newEmail, ValidTestData.newPassword);
    await page.waitForURL('**/listings');

    // Verify the Project Button on the Left sidebar
    await safeExpect('Projects Button should not displayed',
      async () => {
        await expect(await projectsPage.projectsHomeButton()).not.toBeVisible();
      },
      errors
    );

    // Navigate to the project page and verify the error page
    await page.goto(`${baseURL}/projects`);
    await safeExpect('Error page is displayed',
      async () => {
        await expect(await projectsPage.ErrorBoundryPage()).toBeVisible();
        await expect(await projectsPage.errorContainer()).toBeVisible();
        await expect(await projectsPage.Errorbgcontainer()).toBeVisible();
      },
      errors
    );

    // Verify the error page text
    await safeExpect('Error page text is displayed',
      async () => {
        await expect(await projectsPage.errorContainerHeading()).toBeVisible();
        await expect(await projectsPage.errorContainerHeading()).toHaveText('Page not found');
        await expect(await projectsPage.errorContainerText()).toBeVisible();
        await expect(await projectsPage.errorContainerText()).toHaveText('The page you are looking for does not exist, or has been moved');
        await expect(await projectsPage.backToProjectsButton()).toBeVisible();
        await expect(await projectsPage.backToProjectsButton()).toHaveText('< Back to Projects');
      },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  });

  test('Update role type to Form basic', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to the login page and Login
    const errors = [];
    await loginPage.login(Credentials.username, Credentials.password);
    await page.waitForLoadState('networkidle');

    // change the organization and navigate to the settings - organization page
    await safeExpect('select the another organization',
      async () => await projectsPage.selectOrg(ValidTestData.organizationName),
      errors);

    await safeExpect('Go to settings organization page', async () => {
      await projectsPage.setting();
      await projectsPage.organizationButton();
    }, errors);

    // Update the role type for the organization
    await safeExpect('Update the Role Type', async () => {
      const removeViewBasicrole = await projectsPage.removeViewBasicrole();
      await expect(removeViewBasicrole).toBeVisible();
      await removeViewBasicrole.click();
      const organizationrole = await projectsPage.organizationrole();
      await organizationrole.click();
      const FormBasicrole = await projectsPage.FormBasicrole();
      await FormBasicrole.click();

      const SaveChanges = await projectsPage.SaveChanges();
      await SaveChanges.click();
    }, errors)


    // Get the success message displayed on the UI
    await safeExpect('Success Message should shown', async () => {
      const updateMessage = await projectsPage.updateMessage();
      expect(updateMessage).toBe('Your changes have been saved.');
    }, errors);

    // Reset the Organization
    await safeExpect('Reset the Organization', async () => {
      const resetButton = await projectsPage.resetButton();
      await resetButton.click();
      await projectsPage.setting();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    } 

  });

  test('Verify that the "My Projects" button is visible on the left Sidebar', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to login page and perform login
    const errors = [];
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Ensure that the page navigates to the expected URL
    await safeExpect('Navigate to Projects page', async () => {
      await page.waitForURL('**/projects');
      expect(page.url()).toBe(`${baseURL}/projects`);
    }, errors);

    await safeExpect('Validate the project , listing, and create project buttons', async () => {
      await expect(await projectsPage.projectsHomeButton()).toBeVisible();
      await expect(await projectsPage.listingsButton()).not.toBeVisible();
      await expect(await projectsPage.createProjectButton()).not.toBeVisible();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    } 

  })

  test('Add role type to Form Creator', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to the login page and Login
    const errors = [];
    await loginPage.login(Credentials.username, Credentials.password);
    await page.waitForLoadState('networkidle');

    // change the organization and navigate to the settings - organization page
    await safeExpect('Change the organization and Navigate to the settings organization', async () => {
      await projectsPage.selectOrg(ValidTestData.organizationName);
      await page.waitForTimeout(2000);
      await projectsPage.setting();
      await projectsPage.organizationButton();
    }, errors);

    // Update the role type for the organization
    await safeExpect('Update the role type for the organization', async () => {
      const organizationrole = await projectsPage.organizationrole();
      await expect(organizationrole).toBeVisible();
      await organizationrole.click();
      const FromCreateorrole = await projectsPage.FromCreateorrole();
      await FromCreateorrole.click();
      const SaveChanges = await projectsPage.SaveChanges();
      await SaveChanges.click();
    }, errors);

    // Get the success message displayed on the UI
    await safeExpect('success message displayed', async () => {
      const updateMessage = await projectsPage.updateMessage();
      expect(updateMessage).toBe('Your changes have been saved.');
    }, errors);

    // Reset the Organization
    await safeExpect('Reset the Organization', async () => {
      const resetButton = await projectsPage.resetButton();
      await resetButton.click();
      await projectsPage.setting();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    } 

  });

  test('Verify that the "Create Projects" button is visible', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to login page and perform login
    const errors = [];
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Ensure that the page navigates to the expected URL
    await safeExpect('Navigate to Projects page', async () => {
      await page.waitForURL('**/projects');
      expect(page.url()).toBe(`${baseURL}/projects`);
    }, errors);

    await safeExpect('Validate the project , listing, and create project buttons', async () => {
      await expect(await projectsPage.projectsHomeButton()).toBeVisible();
      await expect(await projectsPage.listingsButton()).not.toBeVisible();
      await expect(await projectsPage.createProjectButton()).toBeVisible();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    } 

  })

  test('Add role type View Basic', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to the login page and Login
    const errors = [];
    await loginPage.login(Credentials.username, Credentials.password);
    await page.waitForLoadState('networkidle');

    // change the organization and navigate to the settings - organization page
    await safeExpect('Change the organization and Navigate to the settings organization', async () => {
      await projectsPage.selectOrg(ValidTestData.organizationName);
      await page.waitForTimeout(2000);
      await projectsPage.setting();
      await projectsPage.organizationButton();
    }, errors);

    // Update the role type for the organization
    await safeExpect('Update the role type for the organization', async () => {
      const organizationrole = await projectsPage.organizationrole();
      await expect(organizationrole).toBeVisible();
      await organizationrole.click();
      const ViewBasicrole = await projectsPage.ViewBasicrole();
      await expect(ViewBasicrole).toBeVisible();
      await ViewBasicrole.click();
      const SaveChanges = await projectsPage.SaveChanges();
      await SaveChanges.click();
    }, errors);

    // Get the success message displayed on the UI
    await safeExpect('success message displayed', async () => {
      const updateMessage = await projectsPage.updateMessage();
      expect(updateMessage).toBe('Your changes have been saved.');
    }, errors);

    // Reset the Organization
    await safeExpect('Reset the Organization', async () => {
      const resetButton = await projectsPage.resetButton();
      await resetButton.click();
      await projectsPage.setting();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    } 

  });

});

