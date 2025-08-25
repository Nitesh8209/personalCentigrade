import { test, expect } from "@playwright/test";
import { ListingPage } from "../../../pages/listingsPage";
import { LoginPage } from "../../../pages/loginPage";
import { setupPage } from "../../utils/listingsProjectHelper";
import path from "path";
import { ValidTestData } from "../../data/SignUpData";
import { getData } from "../../utils/apiHelper";
import { SearchModal } from "../../../pages/searchModal";
import { AiSearch } from "../../../pages/aiSearch";

// Test suite for search functionality in the buyer view
test.describe('Search Functionlity in the Public view', async () => {

  let page;

   // Setup before all tests: create new browser context, page, and perform login
  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    const listingPage = new ListingPage(page);
    await setupPage(page, null, null, listingPage, baseURL);
  })

  // Test to verify search box and button visibility and content
  test('Should not visible search box', async () => {
    const searchModal = new SearchModal(page);
    await page.waitForLoadState('networkidle');
    await expect(await searchModal.searchButton()).not.toBeVisible();
    await expect(await searchModal.searchBoxIcon()).not.toBeVisible();
  })

})

// Test suite for search functionality in the buyer view
test.describe('Search Functionlity in the buyer view', async () => {
  // Retrieve test data for new email and set up credentials object
  const { newEmail } = getData('UI');
  const credentials = {
    email: newEmail,
    password: ValidTestData.newPassword
  };

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-buyer-auth.json');
  test.use({ storageState: authStoragePath });

  let page;
  let aiSearch;

   // Setup before all tests: create new browser context, page, and perform login
  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page, baseURL);
    const listingPage = new ListingPage(page);
    aiSearch = new AiSearch(page);
    await setupPage(page, loginPage, credentials, listingPage, baseURL);
  })

  // Test to verify search box and button visibility and content
  test('Should search Tab shown', async () => {
    const searchModal = new SearchModal(page);
    const aiCentigrade = await aiSearch.centigradeAiButton();
    await expect(aiCentigrade).toBeVisible({ timeout: 20000 });
    await aiCentigrade.click();
    await expect(await aiSearch.searchTab()).toBeVisible();
    await expect(await aiSearch.searchTab()).toHaveText('Search');
  })

  // Test to verify search modal appears when clicking search box
  test('Should search modal shown when click on search box', async () => {
    if (!(await (await aiSearch.drawer()).isVisible())) {
      const centigradeAiButton = await aiSearch.centigradeAiButton();
      await centigradeAiButton.click();
    }
    const searchModal = new SearchModal(page);
    const searchTab = await aiSearch.searchTab();
    await searchTab.click();

    await expect(await searchModal.searchModal()).toBeVisible();
    await expect(await searchModal.searchInputWrapper()).toBeVisible()
    await expect(await searchModal.searchInput()).toBeVisible();
    const placeholder = await (await searchModal.searchInput()).getAttribute('placeholder');
    await expect(placeholder).toBe('Search this project...');
    await expect(await searchModal.searchIcon()).toBeVisible();
  })

  // Test to verify "no results" message for invalid search term
  test('should show "no results" message for invalid search', async () => {
    const searchModal = new SearchModal(page);
    if (!(await (await aiSearch.drawer()).isVisible())) {
      const centigradeAiButton = await aiSearch.centigradeAiButton();
      await centigradeAiButton.click();
    }

    if (!(await (await searchModal.searchModal()).isVisible())) {
      const searchTab = await aiSearch.searchTab();
      await searchTab.click();
    }

    const inputField = await searchModal.searchInput();
    await inputField.fill('invalid field');

    await expect(await searchModal.NoResultsFound()).toBeVisible();
    await expect(await searchModal.NoResultsFound()).toHaveText('No results found for invalid field');
  })

  // Test to verify search results appear for valid search term
  test('should return results for a valid search term', async () => {
    const searchModal = new SearchModal(page);
    if (!(await (await aiSearch.drawer()).isVisible())) {
      const centigradeAiButton = await aiSearch.centigradeAiButton();
      await centigradeAiButton.click();
    }

    if (!(await (await searchModal.searchModal()).isVisible())) {
      const searchTab = await aiSearch.searchTab();
      await searchTab.click();
    }

    await page.waitForLoadState('networkidle');

    const inputField = await searchModal.searchInput();
    await inputField.clear();
    await inputField.fill('yes');
    await expect(await searchModal.SearchContent()).toBeVisible();
    const searchItems = await searchModal.SearchItem();
    await expect(await searchItems.first()).toBeVisible();
    const resultCount = await (await searchModal.SearchItem()).count();
    await expect(resultCount).toBeGreaterThan(0);
  })

  // Test to verify clicking a search result navigates to correct page
  test('should land on the page when click on search text', async () => {
    const searchModal = new SearchModal(page);
    const searchItems = await searchModal.SearchItem();
    if (!(await (await aiSearch.drawer()).isVisible())) {
      const centigradeAiButton = await aiSearch.centigradeAiButton();
      await centigradeAiButton.click();
    }

    if (!(await (await searchModal.searchModal()).isVisible())) {
      const searchTab = await aiSearch.searchTab();
      await searchTab.click();
    }

    if (!(await (await searchItems.first()).isVisible())) {
      const inputField = await searchModal.searchInput();
      await inputField.fill('yes');
      await expect(await searchModal.SearchContent()).toBeVisible();
      await expect(await searchItems.first()).toBeVisible();
    }

    const firstItem = await searchItems.first();
    const firstItemText = await firstItem.innerText();
    const title = firstItemText.split(' > ')[0];
    const navAccordianItem = firstItemText.split(' > ')[2];

    await firstItem.click();

    await expect(await searchModal.tabListTitle()).toBeVisible();
    await expect(await searchModal.tabListTitle()).toHaveText(title);

    await expect(await searchModal.navAccordionItem()).toBeVisible();
    await expect(await searchModal.navAccordionItem()).toHaveText(navAccordianItem);
  })

})