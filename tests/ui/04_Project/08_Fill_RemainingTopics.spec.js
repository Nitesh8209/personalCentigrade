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

test.describe('After Topic 1 - Fill Remaining Required Fields and Save', () => {
  const { newEmail } = getData('UI');
  let page;
  let fieldHandler;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);
    fieldHandler = new FieldHandler(page);

    // Navigate to the application and log in
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validate project title
    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);
  });


  // Iterate over each step group in the topic
  for (let i = 1; i < formData.topics.length; i++) {
    const topic = formData.topics[i];
    test.describe(`Topic: ${topic.label}`, () => {
      test.beforeAll(async () => {
        const topicElement = await fieldHandler.findLabel(topic.label);
        if (!topicElement || !(await topicElement.isVisible())) {
          test.skip(true, `Skipping all tests for topic '${topic.label}' as it's not visible`);
        } else {
          await topicElement.click();
        }
      });

      for (const stepGroup of topic.step_groups) {
        if (!stepGroup?.steps) continue;
        for (const step of stepGroup.steps) {

          // Iterate over each step in the step group
          test.describe(`Step: ${step.label}`, () => {
            test.beforeEach(async () => {
              const stepElement = await fieldHandler.findStep(step.label);

              // Check step visibility before proceeding
              await fieldHandler.checkStepVisibility(stepElement, step, test);
              // await fieldHandler.checkValidateField(step, test);

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
                          await fieldHandler.fillField(inputLocator, filePath, {
                            type: field.type,
                            component: field.component,
                            label: field.label,
                            options: field.options,
                            columns: field.columns
                          });
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
    }
    )

  }

})
