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


test.describe('Field level validation', { tag: '@UI' }, async () => {

  const { newEmail } = getData('UI');

  let page;
  let fieldHandler;

    const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-auth-admin.json');
    test.use({ storageState: authStoragePath });

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);
    fieldHandler = new FieldHandler(page);

    // Navigate and setup initial state
    await loginPage.navigate();
    await loginPage.accecptAll();
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validate project title
    const projectTitle = await projectsPage.overviewtitle();
    await expect(projectTitle).toBeVisible({ timeout: 20000});
    await expect(projectTitle).toHaveText(project.uiProjectName);
  });

  // Iterate over each topic in the form data
  for (const topic of formData.topics) {
    test.describe(`Topic: ${topic.label}`, () => {

      test.beforeAll(async () => {
        // Find and click on the topic label if visible
        const topicElement = await fieldHandler.findLabel(topic.label);
        if (!topicElement || !(await topicElement.isVisible())) {
          test.skip(true, `Skipping all tests for topic '${topic.label}' as it's not visible`);
        } else {
          await topicElement.click();
        }
      });

      // Iterate over each step group in the topic
      for (const stepGroup of topic.step_groups) {
        if (!stepGroup?.steps) continue;

        // Iterate over each step in the step group
        for (const step of stepGroup.steps) {

          test.describe(`Step: ${step.label}`, () => {
            test.beforeAll(async () => {
              // Find and click on the step label if visible
              const stepElement = await fieldHandler.findStep(step.label);

              // Check the step is visible or not 
              await fieldHandler.checkStepVisibility(stepElement, step, test);

              // Click on the step if visible
              await expect(stepElement).toBeVisible();
              await stepElement.click({force: true});
              await expect(await fieldHandler.title()).toBeVisible();
            })

            test(`Validate Fields Are Hidden Until Display Dependencies Are Completed for Step: ${step.label}`, async () => {
              const errors = [];

              // Discard any unsaved changes
              const discard = await fieldHandler.discardButton()
              if (await discard.isVisible()) {
                await discard.click();
              }

              // Iterate over each section in the step
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                // Iterate over each field group in the section
                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  // Iterate over each field in the field group
                  for (const field of fieldGroup.fields) {
                    if (field?.display_dependencies) {

                      // Validate field label
                      await safeExpect(
                        `Field label: ${field.label}`,
                        async () => {
                          const labelElement = await fieldHandler.validateLabel(field);
                          await expect(labelElement).not.toBeVisible();
                        },
                        errors
                      );

                      // Validate field locator
                      await safeExpect(
                        `Field locator: ${field.label}`,
                        async () => {
                          const inputLocator = await fieldHandler.getLocator(field.name, field.label, field.type, field.component);
                          await expect(inputLocator).not.toBeVisible();
                        },
                        errors
                      );

                      // Validate helper text if available
                      if (field.helper_text) {
                        await safeExpect(
                          `Helper text: ${field.label}`,
                          async () => {
                            const labelElement = await fieldHandler.validateLabel(field);
                            const helperElement = await fieldHandler.validateHelperText(labelElement, field.helper_text);
                            await expect(helperElement).not.toBeVisible();
                          },
                          errors
                        );
                      }
                    }
                  }
                }
              }

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              }
            });

            test(`Validate Visibility of Fields for Step: ${step.label}`, async ({ }) => {
              const errors = [];

              // Iterate over each section in the step
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                // Iterate over each field group in the section
                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  // Iterate over each field in the field group
                  for (const field of fieldGroup.fields) {
                    if (field?.display_dependencies) continue;

                    // Validate field label
                    await safeExpect(
                      `Field label: ${field.label}`,
                      async () => {
                        const labelElement = await fieldHandler.validateLabel(field);
                        await expect(labelElement).toBeVisible();
                        await expect(labelElement).toHaveText(field.label);
                      },
                      errors
                    );

                    // Validate field locator
                    await safeExpect(
                      `Field locator: ${field.label}`,
                      async () => {
                        const inputLocator = await fieldHandler.getLocator(field.name, field.label, field.type, field.component);
                        await expect(inputLocator).toBeVisible();
                        await fieldHandler.validateField(inputLocator, field);
                      },
                      errors
                    );

                    // Validate helper text if available
                    if (field.helper_text) {
                      await safeExpect(
                        `Helper text: ${field.label}`,
                        async () => {
                          const labelElement = await fieldHandler.validateLabel(field);
                          const helperElement = await fieldHandler.validateHelperText(labelElement, field.helper_text);
                          await expect(helperElement).toBeVisible();
                          await expect(helperElement).toHaveText(field.helper_text);
                        },
                        errors
                      );
                    }

                  }
                }
              }

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              }
            });


            test(`Validate Dependent Field Visibility After Filling Parent Fields for Step: ${step.label}`, async () => {
              const errors = [];
              let selectedFields = [];

              // Iterate over each section in the step
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                // Iterate over each field group in the section
                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  // Iterate over each field in the field group
                  for (const field of fieldGroup.fields) {
                    if (field?.display_dependencies) {
                          if(field.label == "Other project type") continue;

                      // validate and Fill Dependent Parent Fields
                      await safeExpect(`Validate field ${field.label} and Fill Dependent Parent Fields`,
                        async () => {
                          await fieldHandler.handleDisplayDependencies(step, field, formData, selectedFields, topic);
                        },
                        errors
                      )

                      // Validate field label
                      await safeExpect(
                        `Field label: ${field.label}`,
                        async () => {
                          const labelElement = await fieldHandler.validateLabel(field);
                          await expect(labelElement).toBeVisible();
                        },
                        errors
                      );

                      // Validate field locator
                      await safeExpect(
                        `Field locator: ${field.label}`,
                        async () => {
                          const inputLocator = await fieldHandler.getLocator(field.name, field.label, field.type, field.component);
                          await expect(inputLocator).toBeVisible();
                          await fieldHandler.validateField(inputLocator, {
                            type: field.type,
                            component: field.component,
                            label: field.label,
                            options: field.options,
                            columns: field.columns,
                            name: field.name
                          });
                        },
                        errors
                      );

                      // Validate helper text if available
                      if (field.helper_text) {
                        await safeExpect(
                          `Helper text: ${field.label}`,
                          async () => {
                            const labelElement = await fieldHandler.validateLabel(field);
                            const helperElement = await fieldHandler.validateHelperText(labelElement, field.helper_text);
                            await expect(helperElement).toBeVisible();
                            await expect(helperElement).toHaveText(field.helper_text);
                          },
                          errors
                        );
                      }

                    }

                  }
                }
              }

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              }
            });

            test(`Validate the Tier 0 fields is required for Step: ${step.label}`, async () => {
              const errors = [];

              // Iterate over each section in the step
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                // Iterate over each field group in the section
                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  // Iterate over each field in the field group
                  for (const field of fieldGroup.fields) {
                          if(field.label == "Other project type") continue;

                    if (field.tier == 0) {
                      // Validate field label
                      await safeExpect(
                        `Validate required Field asterisk is visible: ${field.label}`,
                        async () => {
                          await expect(await fieldHandler.validateRequiredField(field)).toBeVisible();
                        },
                        errors
                      );
                    } else {
                      await safeExpect(
                        `Validate Unrequired Field asterisk is not visible: ${field.label}`,
                        async () => {
                          await expect(await fieldHandler.validateRequiredField(field)).not.toBeVisible();
                        },
                        errors
                      );
                    }

                  }

                }
              }


              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              }
            })

          });
        }
      }
    })
  }
})

