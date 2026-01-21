import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { SettingsPage } from '../../../pages/settingsPage';
import { ProjectsPage } from '../../../pages/projectsPage';

 test.describe('Edge cases for Sign Up', { tag: ['@signUpUi', '@UI'] }, () => {

  let page;
  let unVerifiedEmail;
  let data;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    unVerifiedEmail = generateTestEmail();
    data = getData('UI');
  });

   // Close the browser page after all tests are complete
   test.afterAll(async () => {
    await page.close();
  });


  // Test for verifying the unverified status shown for an unverified user
  test('Verify the unverified Status shown for unverified user', async ({ baseURL}) => {
    const loginPage = new LoginPage(page, baseURL);
    const signUpPage = new SignUpPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);
    await signUpPage.completeSignUpProcess(ValidTestData.firstName, ValidTestData.lastName, ValidTestData.organizationName, unVerifiedEmail);
  
    await loginPage.navigate();
    await loginPage.acceptAll();
    await loginPage.login(data.newEmail, ValidTestData.newPassword);
    const settingButton = await projectsPage.SettingsButton();
    await settingButton.click();

    await projectsPage.teamTabButton();
    await expect(await settingsPage.useremail(unVerifiedEmail)).toBeVisible();
    await expect(await settingsPage.usertype(unVerifiedEmail)).toBeVisible();
    await expect(await settingsPage.usertype(unVerifiedEmail)).toHaveText('Requested');

    const ApproveButton = await settingsPage.approveButton(unVerifiedEmail);
    await ApproveButton.click();

    // verify the user status after approval
    await expect(await settingsPage.userstatus(unVerifiedEmail)).toBeVisible();
    await expect(await settingsPage.userstatus(unVerifiedEmail)).toHaveText('unVerified');
  })

 })
