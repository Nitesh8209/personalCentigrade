import { test, expect } from '@playwright/test';
import { ListingPage } from '../../../pages/listingsPage';
import { LoginPage } from "../../../pages/loginPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import path from 'path';
import fs from 'fs';
import { ProjectListings } from '../../../pages/projectListingPage';
import { validateStepGroupVisiblity, validateTopicVisiblity } from '../../utils/listingsProjectHelper';

const ViewDataPath = path.join(__dirname, '..', '..', 'data', 'view-data.json');
const viewData = JSON.parse(fs.readFileSync(ViewDataPath, 'utf-8'));


// Validate the visibility of the topic and step group for unauthenticated users
test.describe('Topic and Step Group Visibility for Unauthenticated Users', { tag: ['@UI', '@SMOKE'] }, () => {

  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    const listingPage = new ListingPage(page);
    await page.goto(`${baseURL}/listings`);

     // Click on first project to navigate to project details
     const projectTitle = await listingPage.projectItemCardContentMainTitle();
     await expect(projectTitle).toBeVisible();
     await projectTitle.click();
     await page.waitForURL('**/overview');
  });

  // Loop through each topic and validate visibility
  for (const topic of viewData.topics) {

    if(topic.label == 'Updates') continue;
    // Validate topic visibility
    test(`Verify Topic is Visible: ${topic.label} for Unauthenticated Users`, async () => {
      const errors = [];
      const projectListings = new ProjectListings(page);
     
      await validateTopicVisiblity(projectListings, topic, errors);

      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }
    });


    // Validate step group visibility
    if (topic.step_groups) {

      // Check if the step group has a label
      const hasField = topic.step_groups.some(group => group.label !== '');

      // Validate step group visibility
      test(`Verify Step Groups in Topic: ${topic.label} for Unauthenticated Users`, async () => {
        
        // Skip the test if no step group label is found
        test.skip(!hasField, `No Step Group Label found in ${topic.label}`);
        
        const errors = [];
        const projectListings = new ProjectListings(page);
        const topicLabel = await projectListings.topicName(topic.label);
        await topicLabel.click();
        
        // Loop through each step group and validate visibility
        for (const stepGroup of topic.step_groups) {
          if (!stepGroup?.steps) continue;
          await validateStepGroupVisiblity(projectListings, stepGroup, errors);
        }

        if (errors.length > 0) {
          throw new Error(`Validation errors found:\n${errors.join('\n')}`);
        }
      });
    }
  }

});

// validate the visibility of the topic and step group for authenticated users
test.describe('Topic and StepGroup Visibility for Authenticated Users', { tag: ['@UI', '@SMOKE'] }, () => {

  const { newEmail } = getData('UI');

    const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-buyer-auth.json');
    test.use({ storageState: authStoragePath });

    let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page, baseURL);
    const listingPage = new ListingPage(page);

    // Navigate to the login page and perform login
    await loginPage.navigate();
    await page.waitForURL('**/projects');
    const ListingsButton = await listingPage.listings();
    await expect(ListingsButton).toBeVisible();
    await ListingsButton.click();
    await page.waitForURL('**/listings');

    const projectTitle = await listingPage.projectItemCardContentMainTitle();
      await expect(projectTitle).toBeVisible();
      await projectTitle.click();
      await page.waitForURL('**/overview');
  });
  
  // Loop through each topic and validate visibility
  for (const topic of viewData.topics) {

    // Validate topic visibility
    test(`Verify Topic is Visible: ${topic.label} for Authenticated Users`, async () => {
      const errors = [];
      const projectListings = new ProjectListings(page);
      
      await validateTopicVisiblity(projectListings, topic, errors);

      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }
    });


    // Validate step group visibility
    if (topic.step_groups) {

      // Check if the step group has a label
      const hasField = topic.step_groups.some(group => group.label !== '');

      // Validate step group visibility
      test(`Verify Step Groups in Topic: ${topic.label} for Authenticated Users`, async () => {
        
        // Skip the test if no step group label is found
        test.skip(!hasField, `No Step Group Label found in ${topic.label}`);
        
        const errors = [];
        const projectListings = new ProjectListings(page);
        
        const topicLabel = await projectListings.topicName(topic.label);
        await topicLabel.click();

        // Loop through each step group and validate visibility
        for (const stepGroup of topic.step_groups) {
          if (!stepGroup?.steps) continue;
          await validateStepGroupVisiblity(projectListings, stepGroup, errors);
        }

        if (errors.length > 0) {
          throw new Error(`Validation errors found:\n${errors.join('\n')}`);
        }
      });

    }
  }

});