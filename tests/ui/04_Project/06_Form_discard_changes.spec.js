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

const formDataPath = path.join(__dirname, '..', '..', 'data', 'form-data.json');
const formData = JSON.parse(fs.readFileSync(formDataPath, 'utf-8'));

test.describe('Button Level Validations', () => {
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
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validat project title
    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);
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
            test.beforeEach(async () => {
              // Find and click on the step label if visible
              const stepElement = await fieldHandler.findStep(step.label);

              // Check the step is visible or not 
              await fieldHandler.checkStepVisibility(stepElement, step, test);

              // if step visible click on the step
              await expect(stepElement).toBeVisible();
              await stepElement.click();
              await expect(await fieldHandler.title()).toBeVisible();
            })

            test(`Validate Cancel and save Button for step: ${step.label}`, async ({ }) => {
              const errors = [];

              // switch the step on that time if unsaved modal open then click on the discard button
              const discard = await fieldHandler.discardButton()
              if (await discard.isVisible()) {
                await discard.click();
              }

              const cancelButton = await fieldHandler.cancelButton();
              const saveButton = await fieldHandler.saveButton();

              // Verify Cancel button states before any changes
              await safeExpect('Cancel button visibility', async () => {
                await expect(cancelButton).toBeVisible();
                await expect(cancelButton).toHaveText('Cancel');
                await expect(cancelButton).toBeDisabled();
              },
                errors
              );

              // Verify Save button states before any changes
              await safeExpect('Save button visibility', async () => {
                await expect(saveButton).toBeVisible();
                await expect(saveButton).toHaveText('Save');
                await expect(saveButton).toBeDisabled();
              },
                errors
              );

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              }

            });


            test(`Validate Cancel and Save button Button after any changes for step: ${step.label}`, async ({ }) => {

              // check the fields are valid or not in the step
              await fieldHandler.checkValidateField(step, test);

              const errors = [];

              // Fill All fields
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  for (const field of fieldGroup.fields) {
                    // Only handle fields with display_dependencies
                    if (field?.display_dependencies) continue;

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
                          options: field.options
                        });
                      },
                      errors
                    );
                  }
                }
              }

              const cancelButton = await fieldHandler.cancelButton();
              const saveButton = await fieldHandler.saveButton();

              // Verify Cancel button states before any changes
              await safeExpect('Cancel button visibility', async () => {
                await expect(cancelButton).toBeVisible();
                await expect(cancelButton).toHaveText('Cancel');
                await expect(cancelButton).toBeEnabled();
              },
                errors
              );

              // Verify Save button states after changes
              await safeExpect('Save button visibility', async () => {
                await expect(saveButton).toBeVisible();
                await expect(saveButton).toHaveText('Save');
                await expect(saveButton).toBeEnabled();
              },
                errors
              );

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error('Buttons Validation Errors:\n' + errors.join('\n'));
              };

            });


            test(`Validate Unsaved Change modal after any changes for step: ${step.label}`, async ({ }) => {

              // check the fields are valid or not in the step
              await fieldHandler.checkValidateField(step, test);

              const errors = [];
              const cancelButton = await fieldHandler.cancelButton();

              // If cancel button is not visible then Again fill the form
              if (!await cancelButton.isEnabled()) {
                for (const section of step.sections) {
                  if (!section?.field_groups) continue;

                  for (const fieldGroup of section.field_groups) {
                    if (!fieldGroup?.fields) continue;

                    for (const field of fieldGroup.fields) {
                      // Only handle fields with display_dependencies
                      if (!!field?.display_dependencies) continue;

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
                            options: field.options
                          });
                        },
                        errors
                      );
                    }
                  }
                }
              }

              await safeExpect('Unsaved changes modal content', async () => {
                await expect(cancelButton).toBeVisible();
                await cancelButton.click();
                await expect(await fieldHandler.unsavedChangeModal()).toBeVisible();
                await expect(await fieldHandler.unsavedChangeHeading()).toBeVisible();
                await expect(await fieldHandler.unsavedChangeHeading()).toHaveText('Unsaved changes');
                await expect(await fieldHandler.unsavedChangeDiscription()).toBeVisible();
                await expect(await fieldHandler.unsavedChangeDiscription()).toHaveText("Are you sure you want to discard the changes you've made?");
                await expect(await fieldHandler.unsavedChangeText()).toBeVisible();
                await expect(await fieldHandler.unsavedChangeText()).toHaveText('You cannot undo this action.');
              }, errors);

              // Verify button states after modal appears
              await safeExpect('Modal button states', async () => {
                await expect(await fieldHandler.unsavedCancelButton()).toBeVisible();
                await expect(await fieldHandler.unsavedCancelButton()).toBeEnabled();
                await expect(await fieldHandler.discardButton()).toBeVisible();
                await expect(await fieldHandler.discardButton()).toBeEnabled();
                const unsavedCancelButton = await fieldHandler.unsavedCancelButton();
                await unsavedCancelButton.click();
              }, errors);


              // validate all fields after click on cancel button in unsaved modal
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  for (const field of fieldGroup.fields) {
                    // Only handle fields with display_dependencies
                    if (field?.display_dependencies) continue;

                    // Validate field locator
                    await safeExpect(
                      `Field locator: ${field.label}`,
                      async () => {
                        const inputLocator = await fieldHandler.getLocator(field.name, field.label, field.type, field.component);
                        await expect(inputLocator).toBeVisible();
                        await fieldHandler.validateFieldAfterCancel(inputLocator, {
                          type: field.type,
                          component: field.component,
                          label: field.label,
                          options: field.options
                        });
                      },
                      errors
                    );
                  }
                }
              }


              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error('Validation errors in Ui:\n' + errors.join('\n'));
              }
            });


            test(`Validate discard Button after any changes for step: ${step.label}`, async ({ }) => {
              // check the fields are valid or not in the step
              await fieldHandler.checkValidateField(step, test);

              const errors = [];

              // If cancel button is not visible then again fill the Form 
              const cancelButton = await fieldHandler.cancelButton();
              if (!await cancelButton.isEnabled()) {
                for (const section of step.sections) {
                  if (!section?.field_groups) continue;

                  for (const fieldGroup of section.field_groups) {
                    if (!fieldGroup?.fields) continue;

                    for (const field of fieldGroup.fields) {
                      // Only handle fields with display_dependencies
                      if (field?.display_dependencies) continue;

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
                            options: field.options
                          });
                        },
                        errors
                      );
                    }
                  }
                }
              }
              
              await safeExpect('Unsaved changes modal content', async () => {
                await expect(cancelButton).toBeVisible();
                await cancelButton.click();
                const discardButton = await fieldHandler.discardButton();
                await discardButton.click();
              }, errors);

              await safeExpect('Cancel and Save button visibility', async () => {
                const saveButton = await fieldHandler.saveButton();
                await expect(cancelButton).toBeDisabled();
                await expect(saveButton).toBeDisabled();
              }, errors);

              // Validate all Fields after click on the discard button in unsaved change modal
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  for (const field of fieldGroup.fields) {
                    // Only handle fields with display_dependencies
                    if (!!field?.display_dependencies) continue;

                    // Validate field locator
                    await safeExpect(
                      `Field locator: ${field.label}`,
                      async () => {
                        const inputLocator = await fieldHandler.getLocator(field.name, field.label, field.type, field.component);
                        await expect(inputLocator).toBeVisible();
                        await fieldHandler.validateFieldAfterDiscard(inputLocator, {
                          type: field.type,
                          component: field.component,
                          label: field.label,
                          options: field.options
                        });
                      },
                      errors
                    );
                  }
                }
              }

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error('Fields validate after discard Error:\n' + errors.join('\n'));
              }
            });

          });

        }
      }
    });

  }
})