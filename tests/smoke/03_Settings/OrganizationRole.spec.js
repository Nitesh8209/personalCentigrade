import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { Credentials } from "../../data/testData";
import { getPasswordAuthResponse, getSrpAuthResponse } from "../../utils/authHelper";

test.describe('View Basic Test cases', () => {

  test.afterEach(async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    expect(page.url()).toBe(`${baseURL}/login`);
  })

  test('Verify that the "Listed Projects" button is visible on the left Sidebar', async ({ page, baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
    
    // Ensure that the page navigates to the expected URL
    await page.waitForURL('**/listings');
    expect(page.url()).toBe(`${baseURL}/listings`);
    await expect(await projectsPage.listingsButton()).toBeVisible();
    await expect(await projectsPage.projectsHomeButton()).not.toBeVisible();
  })

  test('Update role type to Form basic', async ({ page, baseURL}) => {
  
      const loginPage = new LoginPage(page, baseURL);
      const projectsPage = new ProjectsPage(page, baseURL);
  
      // Navigate to the login page and Login
      await loginPage.navigate();
      await loginPage.login(Credentials.username, Credentials.password);
      await page.waitForLoadState('networkidle');
  
      // change the organization and navigate to the settings - organization page
      await projectsPage.selectOrg(ValidTestData.organizationName);
      await projectsPage.setting();
      await projectsPage.organizationButton();
  
      // Update the role type for the organization
      
      const removeViewBasicrole = projectsPage.removeViewBasicrole();
      await removeViewBasicrole.click();
      const organizationrole = projectsPage.organizationrole();
      await organizationrole.click();
      const FormBasicrole = projectsPage.FormBasicrole();
      await FormBasicrole.click();

      const SaveChanges = projectsPage.SaveChanges();
      await SaveChanges.click();

      // Get the success message displayed on the UI
      const updateMessage = await projectsPage.updateMessage();
      expect(updateMessage).toBe('Your changes have been saved.');
  
      // Reset the Organization
      const resetButton = await projectsPage.resetButton();
      await resetButton.click();
      await projectsPage.setting();
    });

    test('Verify that the "My Projects" button is visible on the left Sidebar', async ({ page, baseURL }) => {

      const loginPage = new LoginPage(page, baseURL);
      const projectsPage = new ProjectsPage(page, baseURL);
  
      // Navigate to login page and perform login
      await loginPage.navigate();
      await loginPage.login(newEmail, ValidTestData.newPassword);
      
      // Ensure that the page navigates to the expected URL
      await page.waitForURL('**/projects');
      expect(page.url()).toBe(`${baseURL}/projects`);
      await expect(await projectsPage.projectsHomeButton()).toBeVisible();
      await expect(await projectsPage.listingsButton()).not.toBeVisible();
      await expect(await projectsPage.createProjectButton()).not.toBeVisible();
    })
    
    test('Add role type to Form Creator', async ({ page, baseURL}) => {
  
      const loginPage = new LoginPage(page, baseURL);
      const projectsPage = new ProjectsPage(page, baseURL);
  
      // Navigate to the login page and Login
      await loginPage.navigate();
      await loginPage.login(Credentials.username, Credentials.password);
      await page.waitForLoadState('networkidle');
  
      // change the organization and navigate to the settings - organization page
      await projectsPage.selectOrg(ValidTestData.organizationName);
      await projectsPage.setting();
      await projectsPage.organizationButton();
  
      // Update the role type for the organization
      
      const organizationrole = projectsPage.organizationrole();
      await organizationrole.click();
      const FromCreateorrole = projectsPage.FromCreateorrole();
      await FromCreateorrole.click();

      const SaveChanges = projectsPage.SaveChanges();
      await SaveChanges.click();

      // Get the success message displayed on the UI
      const updateMessage = await projectsPage.updateMessage();
      expect(updateMessage).toBe('Your changes have been saved.');
  
      // Reset the Organization
      const resetButton = await projectsPage.resetButton();
      await resetButton.click();
      await projectsPage.setting();
    });

    test('Verify that the "Create Projects" button is visible', async ({ page, baseURL }) => {

      const loginPage = new LoginPage(page, baseURL);
      const projectsPage = new ProjectsPage(page, baseURL);
  
      // Navigate to login page and perform login
      await loginPage.navigate();
      await loginPage.login(newEmail, ValidTestData.newPassword);
      
      // Ensure that the page navigates to the expected URL
      await page.waitForURL('**/projects');
      expect(page.url()).toBe(`${baseURL}/projects`);
      await expect(await projectsPage.projectsHomeButton()).toBeVisible();
      await expect(await projectsPage.listingsButton()).not.toBeVisible();
      await expect(await projectsPage.createProjectButton()).toBeVisible();
    })

    test('Add role type View Basic', async ({ page, baseURL}) => {
  
      const loginPage = new LoginPage(page, baseURL);
      const projectsPage = new ProjectsPage(page, baseURL);
  
      // Navigate to the login page and Login
      await loginPage.navigate();
      await loginPage.login(Credentials.username, Credentials.password);
      await page.waitForLoadState('networkidle');
  
      // change the organization and navigate to the settings - organization page
      await projectsPage.selectOrg(ValidTestData.organizationName);
      await projectsPage.setting();
      await projectsPage.organizationButton();
  
      // Update the role type for the organization
      
      const organizationrole = projectsPage.organizationrole();
      await organizationrole.click();
      const ViewBasicrole = projectsPage.ViewBasicrole();
      await ViewBasicrole.click();

      const SaveChanges = projectsPage.SaveChanges();
      await SaveChanges.click();

      // Get the success message displayed on the UI
      const updateMessage = await projectsPage.updateMessage();
      expect(updateMessage).toBe('Your changes have been saved.');
  
      // Reset the Organization
      const resetButton = await projectsPage.resetButton();
      await resetButton.click();
      await projectsPage.setting();
    });

});

