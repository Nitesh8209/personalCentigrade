import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';
import { LoginPage } from '../../../pages/loginPage';
import { ProjectsPage } from '../../../pages/projectsPage';
import { getData } from '../../utils/apiHelper';
import { safeExpect } from '../../utils/authHelper';
import { FieldHandler } from '../../utils/fieldValidation';
import { ValidTestData } from '../../data/SignUpData';
import { project } from '../../data/projectData';

// Load form data from JSON file
const formDataPath = path.join(__dirname, '..', '..', 'data', 'form-data.json');
const formData = JSON.parse(fs.readFileSync(formDataPath, 'utf-8'));

// Test Suite for Topic and Step Visibility
test.describe('Verify Topic and Step Visibility in Project Workflow', () => {

  // Load project ID 
  const { newEmail } = getData('UI');

  let page;
  let fieldHandler;

  // Setup: Navigate to the project overview page before each test
  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize browser context and page objects
    const context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);
    fieldHandler = new FieldHandler(page);

    // Perform login and navigate to the project
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validate project title
    const projectTitle = await projectsPage.porjectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);
  });


  // Validate visibility of each topic
  formData.topics.forEach((topic) => {
    test(`Ensure topic '${topic.label}' is visible and enabled`, async () => {
      const errors = [];

      // Locate the topic label element
      const topicLabel = await fieldHandler.findLabel(topic.label);

      // Validate topic visibility and accessibility
      await safeExpect(`Topic '${topic.label}' visibility`, async () => {
        await expect(topicLabel).toBeVisible();
        await expect(topicLabel).toBeEnabled();
      }, errors);

      // If there are any errors, fail the test with all collected errors
      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }
    });
  });


  // Validate steps within each topic
  formData.topics.forEach(async (topic) => {
    test(`Verify steps inside topic '${topic.label}'`, async ({ }, testInfo) => {
      const topicLabel = await fieldHandler.findLabel(topic.label);

      // Skip the Test if the Topic is not visible
      if (!await topicLabel.isVisible()) {
        testInfo.annotations.push({
          type: "skip Reason",
          description: `Topic '${topic.label}' is not visible - skipping validation`
        })
        test.skip();
      }

      const errors = [];
      await topicLabel.click();

      // Iterate through step groups and validate step visibility
      for (const stepGroup of topic.step_groups) {
        if (!stepGroup?.steps) continue;
        for (const step of stepGroup.steps) {
          if (!step?.label) continue;

          // Skip this step if all its fields are null or empty
          const hasValidFields = step.sections?.some(section =>
            section?.field_groups?.some(fieldGroup =>
              fieldGroup?.fields &&
              fieldGroup.fields.length > 0 &&
              fieldGroup.fields.some(field => field !== null)
            )
          );
          if (!hasValidFields) continue;

          // Verify step visibility and text
          await safeExpect(`Step '${step.label}' should be visible, enabled, and correctly labeled`, async () => {
            const stepElement = await fieldHandler.findStep(step.label);
            await expect(stepElement).toBeVisible();
            await expect(stepElement).toHaveText(step.label);
            await expect(stepElement).toBeEnabled();
          }, errors);

        }
      }

      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join('\n')}`);
      }

    });
  });

});

