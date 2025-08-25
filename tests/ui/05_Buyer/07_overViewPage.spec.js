import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import fs from 'fs';
import path from 'path';
import { ListingPage } from '../../../pages/listingsPage';
import { checkDisplayDependencyField, setupPage } from '../../utils/listingsProjectHelper';
import { ProjectListings } from '../../../pages/projectListingPage';
import { safeExpect } from '../../utils/authHelper';
import { authStates } from '../../data/projectData';
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';

// Load view data from JSON file
const viewDatapath = path.join(__dirname, '..', '..', 'data', 'view-data.json');
export const viewData = JSON.parse(fs.readFileSync(viewDatapath, 'utf-8'));

// Iterate through authentication states
for (const authState of authStates) {
  test.describe(`Buyer Overview Page - ${authState.name}`, { tag: ['@UI', '@SMOKE'] }, () => {

    // Determine credentials based on authentication state
    const credentials = authState.isAuthenticated ? {
      email: getData('UI').newEmail,
      password: ValidTestData.newPassword
    } : null;

    // Use storage state if authenticated
    if (authState.isAuthenticated) {
      const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-buyer-auth.json');
      test.use({ storageState: authStoragePath });
    }

    let page;
    test.beforeAll(async ({ browser, baseURL }) => {
      const context = await browser.newContext();
      page = await context.newPage();

      // Navigate to project details
      const listingPage = new ListingPage(page);
      const loginPage = authState.isAuthenticated ? new LoginPage(page, baseURL) : null;
      await setupPage(page, loginPage, credentials, listingPage, baseURL);
    });

    const overviewTopic = viewData.topics[0];
    const stepGroup = overviewTopic.step_groups[0];

    test(`Validate fields label and value in step group: ${stepGroup.label}`, async () => {

      const errors = [];
      const projectListings = new ProjectListings(page);

      // Iterate through sections in the step
      for (const step of stepGroup.steps) {
        for (const section of step?.sections || []) {
          if (section?.field_groups == null) continue;
          const hasValidSection = section.field_groups.some(fieldGroup => fieldGroup.fields);
          if (!hasValidSection) continue;

          // Iterate through field groups in the section
          for (const fieldGroup of section?.field_groups || []) {
            if (fieldGroup?.fields == null) continue;

            // Iterate through fields in the field group
            for (const field of fieldGroup?.fields || []) {
              if (field == null) continue;

              // Handle fields without display dependencies
              if (!field.display_dependencies) {
                if (field.label) {
                  await safeExpect(`verify the label and value ${field.label}`, async () => {
                    const locator = await projectListings.contentOverviewFieldLocator(field, step);
                    if (locator) {
                      await expect(locator).toBeVisible({ timeout: 20000 });
                      await projectListings.overViewFieldValue(field, locator, step)
                    }
                  }, errors);
                }
              }
              // Handle fields with display dependencies
              else {
                const hasdependencyfield = await checkDisplayDependencyField(field);

                if (hasdependencyfield) {
                  if (field.label) {
                    await safeExpect(`In dependency field verify the label and value ${field.label}`, async () => {
                      const locator = await projectListings.contentOverviewFieldLocator(field, step);
                    if (locator) {
                      await expect(locator).toBeVisible({ timeout: 20000 });
                      await projectListings.overViewFieldValue(field, locator, step)
                    }
                    }, errors);
                  }
                }
              }
            }
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }
    });

    // Test for verifying the brief project summary and location map on the Overview Page
    test('Verify brief project summary on Overview Page', async () => {
      const errors = [];
      const projectListings = new ProjectListings(page);

      await safeExpect('Verify brief project summary elements', async () => {
        const ProjectSummary = await projectListings.ProjectSummary();
        await expect(ProjectSummary).toBeVisible({ timeout: 20000 });
        await expect(await projectListings.headingProjectSummary()).toBeVisible();
        await expect(await projectListings.headingProjectSummary()).toHaveText('Brief project summary');
        await expect(await projectListings.missionStatement()).toBeVisible();
        await expect(await projectListings.headingMissionStatement()).toHaveText('Mission statement');
        await expect(await projectListings.contentMissionStatement()).toBeVisible();
        await expect(await projectListings.learnMoreButton()).toBeVisible();
      }, errors);

      await safeExpect('Verify the project location elements', async () => {
        await expect(await projectListings.locationMap()).toBeVisible();
        await expect(await projectListings.headingLocationMap()).toBeVisible();
        await expect(await projectListings.headingLocationMap()).toHaveText('Project location: United Kingdom, India');
        await expect(await projectListings.map()).toBeVisible();

      }, errors);

      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }
    })

    // Test for verifying the learn more button functionality on the Overview Page
    test('Navigate to Project Story via Learn More button', async () => {
      const errors = [];
      const projectListings = new ProjectListings(page);

      await safeExpect('Verify navigation to Project Story', async () => {
        await expect(await projectListings.learnMoreButton()).toBeVisible({ timeout: 20000 });
        const learnMore = await projectListings.learnMoreButton();
        await learnMore.click();
        await expect(await page.url()).toContain('/projectStory');
        await page.goBack();
      }, errors);

      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }
    });

    // Test for verifying the view data link functionality on the Overview Page
    test('Navigate to Project Data via View Data link', async () => {
      const errors = [];
      const projectListings = new ProjectListings(page);

      await safeExpect('Verify navigation to Project Data', async () => {
        await expect(await projectListings.linkViewData()).toBeVisible({ timeout: 20000 });
        const linkViewData = await projectListings.linkViewData();
        await linkViewData.click();
        await expect(await page.url()).toContain('/projectData');
      }, errors);

      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }
    });


  });
}
