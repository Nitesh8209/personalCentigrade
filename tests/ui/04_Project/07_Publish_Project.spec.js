import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../../../pages/loginPage';
import { ProjectsPage } from '../../../pages/projectsPage';
import { FieldHandler } from '../../utils/fieldValidation';
import { getData } from '../../utils/apiHelper';
import * as fs from 'fs';
import { safeExpect } from "../../utils/authHelper";
import { project } from '../../data/projectData';
import { ValidTestData } from '../../data/SignUpData';

// Load form data from JSON file
const formDataPath = path.join(__dirname, '..', '..', 'data', 'form-data.json');
const formData = JSON.parse(fs.readFileSync(formDataPath, 'utf-8'));
const filePath = require('path').resolve(__dirname, '../../assets/file2.png');

test.describe('Fill All Required Fields and Save', () => {
  const { newEmail } = getData('UI');
  let page;
  let fieldHandler;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'auth-admin.json');
  test.use({ storageState: authStoragePath });

  const topic = formData.topics[0];

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);
    fieldHandler = new FieldHandler(page);

    // Navigate to the application and log in
    await loginPage.navigate();
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validate project title
    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);

    // Find and click on the topic label
    const topicElement = await fieldHandler.findLabel(topic.label);
    await topicElement.click();
  });


  // Iterate over each step group in the topic
  for (const stepGroup of topic.step_groups) {
    if (!stepGroup?.steps) continue;
    for (const step of stepGroup.steps) {

      // Iterate over each step in the step group
      test.describe(`Step: ${step.label}`, () => {
        test.beforeEach(async () => {
          const stepElement = await fieldHandler.findStep(step.label);

          // Check step visibility before proceeding
          await fieldHandler.checkStepVisibility(stepElement, step, test);
          await fieldHandler.checkValidateField(step, test);

          // Ensure step is visible and click on it
          await expect(stepElement).toBeVisible();
          await stepElement.click();
        })

        test(`Complete and Save All Fields for Step: ${step.label}`, async () => {
          const errors = [];

          // Iterate through sections within the step
          for (const section of step.sections) {
            if (!section?.field_groups) continue;
            for (const fieldGroup of section.field_groups) {
              if (!fieldGroup?.fields) continue;

              // Iterate through fields within each group
              for (const field of fieldGroup.fields) {

                // Skip specific fields based on conditions
                if (['Project name', 'Methodology'].includes(field.label)) continue;
                if(field.name == 'geographicLocation-projectFile-storage') continue;

                // Identify the input locator for the field
                const inputLocator = await fieldHandler.getLocator(
                  field.name, field.label, field.type, field.component
                );

                // Handle fields based on dependency conditions
                if (!field?.display_dependencies || (await inputLocator.isVisible())) {
                  await safeExpect(
                    `Filling field: ${field.label}`,
                    async () => {
                      await expect(inputLocator).toBeVisible();
                      await fieldHandler.fillField(inputLocator, filePath, field);
                    },
                    errors
                  );
                }

              }

            }
          }

          // Validate save button visibility and confirm save action
          await safeExpect('Save button visibility and execution', async () => {
            const saveButton = await fieldHandler.saveButton();
            await expect(saveButton).toBeVisible();
            await expect(saveButton).toBeEnabled();
            await saveButton.click();
            const successHeader = await fieldHandler.successMessageHeader();
            const successdiv = await fieldHandler.successMessagediv();
            const successMessage = await successdiv.innerText();
            await expect(successHeader).toBeVisible();
            await expect(successHeader).toHaveText('Draft saved')
            await expect(successdiv).toBeVisible();
            await expect(successMessage).toBe('Your changes have been saved to draft');
            await expect(saveButton).toBeDisabled();
          },
            errors
          );

          // If there are any errors, fail the test with all collected errors
          if (errors.length > 0) {
            throw new Error(`Validation errors found:\n${errors.join('\n')}`);
          }
        });

      })
    }
  }

})


test.describe('Publish the Project after completed the Tier 0 topic', () => {
  let projectsPage;
  let fieldHandler;
  let page;

  // Test configuration and setup
  const { newEmail } = getData('UI');

  test.use({
    contextOptions: {
      permissions: ['clipboard-read', 'clipboard-write']
    }
  });

  // Fixture to handle common setup
  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    projectsPage = new ProjectsPage(page, baseURL);
    fieldHandler = new FieldHandler(page);

    // Navigate and setup initial state
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);
  });

  test('Verify if Publish button is visible and enabled, and Tier 0 progress is 100%', async () => {
    const errors = [];

    // Verify Publish Button Visibility and Enablement
    await safeExpect('Publish Button should be visible and enabled',
      async () => {
        const publishButton = await projectsPage.publishButton();
        await expect(publishButton).toBeVisible();
        await expect(publishButton).toBeEnabled();
      },
      errors
    )

    // Verify Progress Bar Visibility and Progress Completion
    await safeExpect('Progress bar should be visible and show 100%',
      async () => {
        await expect(await projectsPage.projectOverviewTier0Cardprogressbarcontainer()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0Cardprogressbar()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0CardprogressbarText()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0CardprogressbarText()).toHaveText('Your progress: 100%');
      },
      errors
    )

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })


  test('Publish the project after completing Tier 0', async () => {
    const errors = [];

    // Click on Publish Button
    await safeExpect('Click on Publish button',
      async () => {
        const publishButton = await projectsPage.publishButton();
        await expect(publishButton).toBeVisible();
        await expect(publishButton).toBeEnabled();
        await publishButton.click();
      },
      errors
    );

    // Verify Success Message after Publishing
    await safeExpect('Check success message after publishing',
      async () => {
        const success = await fieldHandler.successMessagediv();
        const successMessage = await success.innerText();
        await expect(success).toBeVisible();
        await expect(successMessage).toBe('Your project has been published');
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  test('Verify Publish button is disabled after publishing', async () => {
    const errors = [];

    await safeExpect('Publish Button should be disabled after publishing',
      async () => {
        const publishButton = await projectsPage.publishButton();
        await expect(publishButton).toBeVisible();
        await expect(publishButton).toBeDisabled();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  test('Verify Unpublish and Share buttons are shown after publishing', async () => {
    const errors = [];

    // Check Unpublish Button Visibility
    await safeExpect('Unpublish button should be visible and enabled',
      async () => {
        const triggerButton = await projectsPage.unpublishTrigger();
        await triggerButton.click();
        const unpublishButton = await projectsPage.unPublishButton();
        await unpublishButton.waitFor({ state: 'visible' });
        await expect(unpublishButton).toBeVisible();
        await expect(unpublishButton).toBeEnabled();
      },
      errors
    );

    // Check Share Button Visibility
    await safeExpect('Share button should be visible and enabled',
      async () => {
        const shareButton = await projectsPage.shareButton();
        await expect(shareButton).toBeVisible();
        await expect(shareButton).toBeEnabled();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

  test('Click Share button and verify the copied URL', async ({ context, baseURL }) => {
    const errors = [];
    let copiedUrl;

    // Click on Share Button
    await safeExpect('Click Share button',
      async () => {
        const shareButton = await projectsPage.shareButton();
        await shareButton.click();
      },
      errors
    );

    // Verify Copied URL Message
    await safeExpect('Verify URL copied message',
      async () => {
        const success = await fieldHandler.successMessagediv();
        const successMessage = await success.innerText();
        await expect(success).toBeVisible();
        await expect(successMessage).toBe('Link has been copied to your clipboard');
        copiedUrl = await page.evaluate(async () => {
          return await navigator.clipboard.readText();
        });
      },
      errors
    );

    // Open Copied URL and Verify Project Title
    await safeExpect('Open copied URL and verify project title',
      async () => {
        const newPage = await context.newPage();
        await newPage.goto(copiedUrl);
        const newProjectPage = new ProjectsPage(newPage, baseURL);
        await expect(newPage.url()).toBe(copiedUrl);
        await expect(await newProjectPage.listingprojectTitle()).toBeVisible();
        await expect(await newProjectPage.listingprojectTitle()).toHaveText(project.uiProjectName);
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  test('Unpublish the project', async () => {
    const errors = [];

    // Click on Unpublish Button
    await safeExpect('Click Unpublish button',
      async () => {
        const triggerButton = await projectsPage.unpublishTrigger();
        await triggerButton.click();
        const unpublishButton = await projectsPage.unPublishButton();
        await unpublishButton.waitFor({ state: 'visible' });
        await unpublishButton.click();
        await projectsPage.confirmButton();
      },
      errors
    )

    // Verify Success Message after Unpublishing
    await safeExpect('Check success message after unpublishing',
      async () => {
        const success = await fieldHandler.successMessagediv();
        const successMessage = await success.innerText();
        await expect(success).toBeVisible();
        await expect(successMessage).toBe('Your project has been unpublished');
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

  test('Verify Share button is not visible after unpublishing', async () => {
    const errors = [];

    await safeExpect('Share button should not be visible',
      async () => {
        const shareButton = await projectsPage.shareButton();
        await expect(shareButton).not.toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });



});

