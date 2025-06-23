import { test, expect } from '@playwright/test'
import { safeExpect } from '../../utils/authHelper';
import path from 'path';
import { ListingPage } from '../../../pages/listingsPage';
import { LoginPage } from "../../../pages/loginPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { setupPage } from '../../utils/listingsProjectHelper';
import { AiSearch } from '../../../pages/aiSearch';

test.describe('AI search Test cases', () => {
  const { newEmail } = getData('UI');
  const credentials = {
    email: newEmail,
    password: ValidTestData.newPassword
  };

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');
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

  test('User can view Ask Centigrade.AI CTA on the header of the project overview page and also on the top of the pages', async () => {
    const errors = [];

    await safeExpect('Verify the CTA', async () => {
      await expect(await aiSearch.centigradeAiButton()).toBeVisible({ timeout: 20000 });
    }, errors);

    await safeExpect('Verify the search box', async () => {
      await expect(await aiSearch.AiSearchBar()).toBeVisible({ timeout: 20000 });
      await expect(await aiSearch.AiSearchBarHeading()).toBeVisible();
      await expect(await aiSearch.AiSearchBarInput()).toBeVisible();
      await expect(await aiSearch.AiSearchBarInput()).toHaveAttribute('type', 'text');
      await expect(await aiSearch.AiSearchBarInputIcon()).toBeVisible();
    }, errors);

    await safeExpect('verify the suggestion shown for AI search', async () => {
      await expect(await aiSearch.AIQuestionsWrapper()).toBeVisible();
      await expect(await aiSearch.AIQuestionsFirst()).toBeVisible();
      await expect(await aiSearch.AIQuestionsSecond()).toBeVisible();
      await expect(await aiSearch.AIQuestionsThird()).toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`AI search CTA error \n${errors.join('\n')}`)
    }

  })

  test('User can see side drawer when click on the Ask Centigrade.AI CTA', async () => {
    const errors = [];

    await safeExpect('Verify the Drawer opened', async () => {
      await expect(await aiSearch.centigradeAiButton()).toBeVisible({ timeout: 20000 });
      const aiButton = await aiSearch.centigradeAiButton()
      await aiButton.click();
      await expect(await aiSearch.drawer()).toBeVisible();
      await expect(await aiSearch.drawerContent()).toBeVisible();
    }, errors)

    await safeExpect('Close the Ai Drawer', async () => {
      const closeDrawerButton = await aiSearch.closeDrawerButton();
      await expect(closeDrawerButton).toBeVisible();
      await closeDrawerButton.click();
      await expect(await aiSearch.drawer()).not.toBeVisible();
    }, errors)

    if (errors.length > 0) {
      throw new Error(`AI search CTA error \n${errors.join('\n')}`)
    }
  })

  test('User can see side drawer when hit enter after adding search text', async () => {
    const errors = [];

    await safeExpect('Verify the Drawer opened', async () => {
      const AiSearchBarInput = await aiSearch.AiSearchBarInput();
      await AiSearchBarInput.click();
      await AiSearchBarInput.fill('what is the use of project?');
      await AiSearchBarInput.press('Enter');
      await expect(await aiSearch.drawer()).toBeVisible();
      await expect(await aiSearch.drawerContent()).toBeVisible();
      await expect(await aiSearch.drawerAiSearchInput()).toBeVisible();
      await expect(await aiSearch.drawerAiSearchInput()).toHaveValue('what is the use of project?');
    }, errors)

    await safeExpect('Verify the search result is specific to the search', async () => {

    }, errors)

    if (errors.length > 0) {
      throw new Error(`AI search CTA error \n${errors.join('\n')}`)
    }
  })

  test('User can see the keyword search and AI search is part of the drawer', async () => {
    const errors = [];

    if (!(await (await aiSearch.drawer()).isVisible())) {
      const centigradeAiButton = await aiSearch.centigradeAiButton();
      await centigradeAiButton.click();
    }

    await safeExpect('Verify that the two tabs AI search and KeyWord search', async () => {
      await expect(await aiSearch.drawerHeader()).toBeVisible();
      await expect(await aiSearch.centigradeAiTab()).toBeVisible();
      await expect(await aiSearch.searchTab()).toBeVisible();
    }, errors)

    if (errors.length > 0) {
      throw new Error(`AI search CTA error \n${errors.join('\n')}`)
    }

  })

})