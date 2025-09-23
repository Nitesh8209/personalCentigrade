import { test, expect } from '@playwright/test'
import { safeExpect } from '../../utils/authHelper';
import path from 'path';
import { ListingPage } from '../../../pages/listingsPage';
import { LoginPage } from "../../../pages/loginPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { setupPage } from '../../utils/listingsProjectHelper';
import { AiSearch } from '../../../pages/aiSearch';

test.describe('AI Search Functionality Tests', { tag: '@UI' }, () => {
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

  test.afterAll(async () => {
    await page?.close();
  });

  test.describe('AI Search UI Elements', () => {

    test('should display Ask Centigrade.AI CTA and search components', async () => {
      const errors = [];

      // Verify main CTA button
      await safeExpect('CTA button should be visible', async () => {
        const ctaButton = await aiSearch.centigradeAiButton();
        await expect(ctaButton).toBeVisible({ timeout: 20000 });
      }, errors);

      // Verify search bar components
      await safeExpect('Search bar components should be visible and functional', async () => {
        const searchBar = await aiSearch.AiSearchBar();
        const searchBarHeading = await aiSearch.AiSearchBarHeading();
        const searchBarInput = await aiSearch.AiSearchBarInput();
        const searchBarIcon = await aiSearch.AiSearchBarInputIcon();

        await expect(searchBar).toBeVisible({ timeout: 20000 });
        await expect(searchBarHeading).toBeVisible();
        await expect(searchBarInput).toBeVisible();
        await expect(searchBarInput).toHaveAttribute('type', 'text');
        await expect(searchBarIcon).toBeVisible();
      }, errors);

      // Verify suggestion questions
      await safeExpect('AI search suggestions should be visible', async () => {
        const questionsWrapper = await aiSearch.AIQuestionsWrapper();
        const firstQuestion = await aiSearch.AIQuestionsFirst();
        const secondQuestion = await aiSearch.AIQuestionsSecond();
        const thirdQuestion = await aiSearch.AIQuestionsThird();

        await expect(questionsWrapper).toBeVisible();
        await expect(firstQuestion).toBeVisible();
        await expect(secondQuestion).toBeVisible();
        await expect(thirdQuestion).toBeVisible();
      }, errors);

      if (errors.length > 0) {
        throw new Error(`AI search UI elements validation failed:\n${errors.join('\n')}`);
      }
    });

  });

  test.describe('AI Search Drawer Functionality', () => {

    test('should open and close drawer when clicking CTA button', async () => {
      const errors = [];

      await safeExpect('Drawer should open when CTA button is clicked', async () => {
        const ctaButton = await aiSearch.centigradeAiButton();
        await expect(ctaButton).toBeVisible({ timeout: 20000 });

        await ctaButton.click();

        const drawer = await aiSearch.drawer();
        const drawerContent = await aiSearch.drawerContent();

        await expect(drawer).toBeVisible();
        await expect(drawerContent).toBeVisible();
      }, errors);

      await safeExpect('Drawer should close when close button is clicked', async () => {
        const closeButton = await aiSearch.closeDrawerButton();
        await expect(closeButton).toBeVisible();

        await closeButton.click();

        const drawer = await aiSearch.drawer();
        await expect(drawer).not.toBeVisible();
      }, errors);

      if (errors.length > 0) {
        throw new Error(`Drawer functionality test failed:\n${errors.join('\n')}`);
      }
    });

    test('should open drawer and populate search when entering text and pressing Enter', async () => {
      const errors = [];
      const searchQuery = 'what is the use of project?';

      await safeExpect('Drawer should open with search results when Enter is pressed', async () => {
        const searchInput = await aiSearch.AiSearchBarInput();
        await searchInput.click();
        await searchInput.fill(searchQuery);
        await searchInput.press('Enter');

        const drawer = await aiSearch.drawer();
        const drawerContent = await aiSearch.drawerContent();
        const drawerSearchInput = await aiSearch.drawerAiSearchInput();

        await expect(drawer).toBeVisible();
        await expect(drawerContent).toBeVisible();
        await expect(drawerSearchInput).toBeVisible();
        await expect(drawerSearchInput).toHaveValue(searchQuery);
      }, errors);

      await safeExpect('Search results should display with proper components', async () => {
        const prose = await aiSearch.prose();
        const sources = await aiSearch.aiSources();
        const sourceLabel = await aiSearch.sourceLabel();
        const thumbsUp = await aiSearch.thumbsUp();
        const thumbsDown = await aiSearch.thumbsDown();

        await expect(prose).toBeVisible();
        await expect(sources).toBeVisible();
        await expect(sourceLabel).toBeVisible();
        await expect(sourceLabel).toHaveText('Sources');
        await expect(thumbsUp).toBeVisible();
        await expect(thumbsDown).toBeVisible();
      }, errors);

      if (errors.length > 0) {
        throw new Error(`Search functionality test failed:\n${errors.join('\n')}`);
      }
    });

    test('should display both AI search and keyword search tabs', async () => {
      const errors = [];

      // Ensure drawer is open
      await aiSearch.ensureDrawerIsOpen();

      await safeExpect('Both search tabs should be visible', async () => {
        const drawerHeader = await aiSearch.drawerHeader();
        const aiTab = await aiSearch.centigradeAiTab();
        const searchTab = await aiSearch.searchTab();

        await expect(drawerHeader).toBeVisible();
        await expect(aiTab).toBeVisible();
        await expect(searchTab).toBeVisible();
      }, errors);

      if (errors.length > 0) {
        throw new Error(`Search tabs validation failed:\n${errors.join('\n')}`);
      }
    });

  });

  test.describe('AI Search Interaction Features', () => {

    test('should display search results when clicking suggested questions', async () => {
      const errors = [];

      // Ensure drawer is closed first
      await aiSearch.ensureDrawerIsClosed();

      await safeExpect('Clicking suggested question should open drawer with results', async () => {
        const firstQuestion = await aiSearch.AIQuestionsFirst();
        await firstQuestion.click();

        const drawer = await aiSearch.drawer();
        const drawerContent = await aiSearch.drawerContent();
        const prose = await aiSearch.prose();
        const sources = await aiSearch.aiSources();
        const sourceLabel = await aiSearch.sourceLabel();
        const thumbsUp = await aiSearch.thumbsUp();
        const thumbsDown = await aiSearch.thumbsDown();

        await expect(drawer).toBeVisible();
        await expect(drawerContent).toBeVisible();
        await expect(prose).toBeVisible();
        await expect(sources).toBeVisible();
        await expect(sourceLabel).toBeVisible();
        await expect(sourceLabel).toHaveText('Sources');
        await expect(thumbsUp).toBeVisible();
        await expect(thumbsDown).toBeVisible();
      }, errors);

      if (errors.length > 0) {
        throw new Error(`Suggested questions interaction failed:\n${errors.join('\n')}`);
      }
    });

    test('should allow users to provide feedback via thumbs up/down', async () => {
      const errors = [];

      // Ensure drawer is open with search results
      await aiSearch.ensureDrawerHasSearchResults();

      await safeExpect('Feedback buttons should work correctly', async () => {
        // Test thumbs up
        const thumbsUp = await aiSearch.thumbsUp();
        const thumbsDown = await aiSearch.thumbsDown();

        await expect(thumbsUp).toBeVisible({ timeout: 20000 });
        await expect(thumbsDown).toBeVisible();

        // Click thumbs up
        await thumbsUp.click();
        const thumbsUpSolid = await aiSearch.thumbsUpSolid();
        await expect(thumbsUpSolid).toBeVisible();

        // Click thumbs down
        await thumbsDown.click();
        const thumbsDownSolid = await aiSearch.thumbsDownSolid();
        await expect(thumbsDownSolid).toBeVisible();
      }, errors);

      await safeExpect('Feedback modal should open and close properly', async () => {
        const dialog = await aiSearch.dialog();
        await expect(dialog).toBeVisible();

        const modalClose = await aiSearch.modalClose();
        await modalClose.click();

        await expect(dialog).not.toBeVisible();
      }, errors);

      if (errors.length > 0) {
        throw new Error(`Feedback functionality test failed:\n${errors.join('\n')}`);
      }
    });

  });

})