import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import fs from 'fs';
import path from 'path';
import { ListingPage } from '../../../pages/listingsPage';
import { checkDisplayDependencyField, getFieldValue, getFileValue, setupPage } from '../../utils/listingsProjectHelper';
import { ProjectListings } from '../../../pages/projectListingPage';
import { safeExpect } from '../../utils/authHelper';
import { authStates, project } from '../../data/projectData';
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { ListingOverviewPage } from '../../../pages/listingsOverviewPage';
import { apiProjectCreadentials, quickLinkGroupData } from '../../data/testData';

// Load view data from JSON file
const viewDatapath = path.join(__dirname, '..', '..', 'data', 'view-data.json');
export const viewData = JSON.parse(fs.readFileSync(viewDatapath, 'utf-8'));

// Iterate through authentication states
for (const authState of authStates) {
  test.describe(`Buyer Overview Page - ${authState.name}`, { tag: ['@UI', '@SMOKE'] }, () => {
  const { newEmail, BuyerprojectGuid } = getData('UI');

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
    let overviewPage;
    test.beforeAll(async ({ browser, baseURL }) => {
      const context = await browser.newContext();
      page = await context.newPage();

      // Navigate to project details
      const listingPage = new ListingPage(page);
      overviewPage = new ListingOverviewPage(page);

      const loginPage = authState.isAuthenticated ? new LoginPage(page, baseURL) : null;
      // await setupPage(page, loginPage, credentials, listingPage, baseURL);
      await page.goto(`${baseURL}/listings/projects/${BuyerprojectGuid}/overview`);

    });

    const overviewTopic = viewData.topics[0];
    const stepGroup = overviewTopic.step_groups[0];

    test('Verify org and project name are visible', async () => {
      await expect.soft(await overviewPage.aISearchOverview()).toBeVisible();
      await expect.soft(await overviewPage.mainContent()).toBeVisible();
      await expect.soft(await overviewPage.orgName(apiProjectCreadentials.organizationName)).toBeVisible();
      await expect.soft(await overviewPage.projectName(project.buyerProject)).toBeVisible();
    });

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

    test('Verify Quick Links functionality', async () => {
      await expect.soft(await overviewPage.summaryPanel()).toBeVisible();
      await expect.soft(await overviewPage.quickLinkGroup()).toBeVisible();
      await expect.soft(await overviewPage.quickLinkGroupHeading()).toBeVisible();
      await expect.soft(await overviewPage.quickLinkGroupHeading()).toHaveText('Quick links');

      for (const quickLink of quickLinkGroupData) {
        const quickLinkLabel = await overviewPage.quickLinkGroupTextLink(quickLink.label)
        await expect.soft(quickLinkLabel).toBeVisible();
        await quickLinkLabel.click();

        if(authState.isAuthenticated){
          await expect.soft(await overviewPage.stepLink(quickLink.stepLabel)).toBeVisible();
          await expect.soft(page.url()).toContain(quickLink.path);
        }else{
          await expect.soft(await overviewPage.stepLink(quickLink.unAuthStepLabel)).toBeVisible();
          await expect.soft(page.url()).toContain(quickLink.unAuthPath);
        }


        const overView = await overviewPage.navbarOverview();
        await overView.click();
      }

    })

    test('Verify Location section', async () => {
      await expect.soft(await overviewPage.location()).toBeVisible();
      await expect.soft(await overviewPage.locationHeading()).toBeVisible();
      await expect.soft(await overviewPage.locationHeading()).toHaveText('Location: United Kingdom, India');
      await expect.soft(await overviewPage.locationMap()).toBeVisible();

    })

    test('Verify Project images and videos', async () => {
      const value = await getFileValue('projectMedia-projectFile-storage');
      await expect.soft(await overviewPage.navbarOverview()).toBeVisible();
      if (value) {
        await expect.soft(await overviewPage.projectImage()).toBeVisible();
        await expect.soft(await overviewPage.projectImageHeading()).toBeVisible();
        await expect.soft(await overviewPage.projectImageHeading()).toHaveText('Project images and videos');
        await expect.soft(await overviewPage.projectImageView()).toBeVisible();
      } else {
        await expect.soft(await overviewPage.projectImage()).not.toBeVisible();
        await expect.soft(await overviewPage.projectImageView()).not.toBeVisible();
      }

    })

    test('verify read more and read less functionality and modal', async () => {
      const readMoreButton = await overviewPage.readMoreButton();
      await expect.soft(readMoreButton).toBeVisible();
      await readMoreButton.click();
      await expect.soft(await overviewPage.readMoreModal()).toBeVisible();
      await expect.soft(await overviewPage.readMoreModalHeading()).toBeVisible();
      await expect.soft(await overviewPage.readMoreModalContent()).toBeVisible();

      const readMoreModalCloseButton = await overviewPage.readMoreModalClose();
      await readMoreModalCloseButton.click();
      await expect.soft(await overviewPage.readMoreModal()).not.toBeVisible();
      await expect.soft(await overviewPage.readMoreButton()).toBeVisible();
    });
    
  });
}
