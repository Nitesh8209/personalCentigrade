import { test } from '@playwright/test';
import RetoolDownloader from '../../pages/retool';
import { retoolConfig } from '../utils/retoolConfig';
import path from 'path';
import fs from 'fs';

test.describe('Retool Login and Data Fetch', () => {

  const retoolStoragePath = path.join(__dirname, '..', 'data', 'retool-auth.json');
  const outputPath = path.join(__dirname, '..', 'data', 'form-data.json');

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext();

    if (!fs.existsSync(retoolStoragePath)) {
      const page = await context.newPage();
      const retool = new RetoolDownloader(
        page,
        retoolConfig.email,
        retoolConfig.password
      );

      // Perform login and save authentication state
      await retool.login();
      await context.storageState({ path: retoolStoragePath });
      await page.close();
    } else {
      test.use({ storageState: retoolStoragePath });
    }
  });

  test('Login to Retool and Fetch Form Data', async ({ page }) => {
    const retool = new RetoolDownloader(page, retoolConfig.email, retoolConfig.password);

    // Download data from Retool
    await retool.downloadData();

    // Wait for and save the downloaded file
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    await download.saveAs(outputPath);
  });

})
