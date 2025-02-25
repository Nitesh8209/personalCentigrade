import { test, expect } from '@playwright/test';
import { ListingPage } from '../../../pages/listingsPage';
import { LoginPage } from "../../../pages/loginPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { validateListingsProject, validatePageHeader } from '../../utils/listingsHelper';
import { safeExpect } from '../../utils/authHelper';

test.describe('Listings Page - UI and Navigation', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/listings`);
  });

  // Test case for verifying navigation elements and authentication buttons
  test('should display navigation elements and functional authentication buttons', async ({ page, baseURL }) => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await safeExpect(`Navigation should be visible`, async () => {
      await expect(await listingPage.navigation()).toBeVisible();
    }, errors);

    await safeExpect(`Logo should be visible`, async () => {
      await expect(await listingPage.logo()).toBeVisible();
    }, errors);

    await safeExpect(`Login Button visible`, async () => {
      const Login = await listingPage.login();
      await expect(await listingPage.login()).toBeVisible();
      await Login.click();
      await expect(await page.url()).toBe(`${baseURL}/login?from=%2Flistings`);
    }, errors);

    await safeExpect(`Create Account Button visible`, async () => {
      await page.goBack();
      const createAccount = await listingPage.createAccount();
      await expect(await listingPage.createAccount()).toBeVisible();
      await createAccount.click();
      await expect(await page.url()).toBe(`${baseURL}/create-account?from=%2Flistings`);
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

  // Test case for verifying page content structure and layout
  test('should display proper page header and content structure', async ({ page }) => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await validatePageHeader(listingPage, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  // Test case for verifying projects are visible for unauthenticated users
  test('should display projects on listings page for unauthenticated users', async ({ page }) => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await validateListingsProject(listingPage, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

});

test.describe('Listings Page - After Login', () => {
  const { newEmail } = getData('UI');

  test.beforeEach(async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);
    const listingPage = new ListingPage(page);

    // Navigate to the login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
    await page.waitForURL('**/projects');
    const ListingsButton = await listingPage.listings();
    await expect(ListingsButton).toBeVisible();
    await ListingsButton.click();
    await page.waitForURL('**/listings');
  });

  // Test case for verifying Navigation Header after authentication
  test('Verify navigation header is hidden after login', async ({ page, baseURL }) => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await safeExpect(`Verify Login and create account should not be visible`, async () => {
      await expect(page.url()).toBe(`${baseURL}/listings`);
      await expect(await listingPage.login()).not.toBeVisible();
      await expect(await listingPage.createAccount()).not.toBeVisible();
    }
      , errors);

    await safeExpect(`Verify Project Breadcrump should be visible`, async () => {
      await expect(await listingPage.ProjectBreadcrumb()).toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  // Test case for verifying page content structure for authenticated users
  test('should display Page content on the listings page', async ({ page }) => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await validatePageHeader(listingPage, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  // Test case for verifying project listings and help button for authenticated users
  test('should display Project on the listings page', async ({ page }) => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await validateListingsProject(listingPage, errors);

    await safeExpect(`Need Help Butotn Visibility`, async () => {
      await expect(await listingPage.needHelp()).toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });


});