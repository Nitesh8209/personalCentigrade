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

test.describe('After Topic 1 - Fill Remaining Required Fields and Save', { tag: '@UI' }, () => {
  const { newEmail } = getData('UI');
  let page;
  let fieldHandler;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');
  test.use({ storageState: authStoragePath });

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

    // Validat project title
    const projectTitle = await projectsPage.overviewtitle();
    await expect(projectTitle).toBeVisible({ timeout: 20000 });
    await expect(projectTitle).toHaveText(project.uiProjectName);
  });


  test('Verify Update project modal', async ({ baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

    await safeExpect('Click on the Last Update Link',
      async () => {
        const viewChanges = await projectsPage.viewChangesLink();
        await expect(viewChanges).toBeVisible();
        await viewChanges.click();
      },
      errors
    );

    await safeExpect('Verify Project Update modal',
      async () => {
        await expect(await projectsPage.projectUpdateModal()).toBeVisible();
        await expect(await projectsPage.projectUpdateTitle()).toBeVisible();
        await expect(await projectsPage.projectUpdateCloseButton()).toBeVisible();
        await expect(await projectsPage.historyView()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Verify the Current draft card before updating any filed since last publish', async ({ baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

    if (!(await (await projectsPage.projectUpdateModal()).isVisible())) {
      await safeExpect('Click on the Last Update Link',
        async () => {
          const viewChanges = await projectsPage.viewChangesLink();
          await expect(viewChanges).toBeVisible();
          await viewChanges.click();
        },
        errors
      );
    }

    await safeExpect('verfiy current draft card is disabled',
      async () => {
        const currentDraftCard = await projectsPage.currentDraftCard();
        await expect(currentDraftCard).toBeVisible();
        await expect(currentDraftCard).toHaveClass(/disabled/);
        await currentDraftCard.click();
      },
      errors
    );

    await safeExpect('Verify current draft card heading',
      async () => {
        await expect(await projectsPage.currentDraftCard()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeader()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeaderText()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeaderText()).toHaveText('Current draft');
        await expect(await projectsPage.currentDraftCardHeaderbadge()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeaderbadge()).toHaveText('Not published');
      },
      errors
    );

    // Verify Summary of Updates field
    await safeExpect('verfiy current draft card body',
      async () => {
        await expect(await projectsPage.currentDraftCardbody()).toBeVisible();
        await expect(await projectsPage.currentDraftCardbodyVersioNotes()).toBeEnabled();
        await expect(await projectsPage.currentDraftCardbodyVersionNotesText()).toBeEnabled();
        await expect(await projectsPage.currentDraftCardbodyVersionNotesText()).toHaveText('Summary of changes');
        await expect(await projectsPage.currentDraftCardbodyVersionNotesPera()).toBeEnabled();
        await expect(await projectsPage.currentDraftCardbodyVersionNotesPera()).toHaveText('Add a summary...');
        await expect(await projectsPage.currentDraftCardbodyChanges()).toBeEnabled();
        await expect(await projectsPage.currentDraftCardbodyChanges()).toHaveText('No changes since last publish');
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

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

          if ((await (await page.getByRole('button', { name: 'Accept All' })).isVisible())) {
            const acceptAll = await page.getByRole('button', { name: 'Accept All' });
            await acceptAll.click();
          }
        }
      });

      for (const stepGroup of topic.step_groups) {
        if (!stepGroup?.steps) continue;
        for (const step of stepGroup.steps) {

          // Iterate over each step in the step group
          test.describe(`Step: ${step.label}`, () => {
            test.beforeEach(async () => {
              const stepElement = await fieldHandler.findStep(step.name);

              // Check step visibility before proceeding
              await fieldHandler.checkStepVisibility(stepElement, step, test);
              // await fieldHandler.checkValidateField(step, test);

              // Ensure step is visible and click on it
              await expect(stepElement).toBeVisible();
              await stepElement.click();
              const stepLabel = await page.locator('h1', { hasText: step.label, exact: true });
              await expect(stepLabel).toBeVisible();
            })

            test(`Complete and Save All Fields for Step: ${step.label}`, async () => {
              const errors = [];
              let flag = false;

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
                          await fieldHandler.fillField(inputLocator, filePath, field);
                          flag = true;
                        },
                        errors
                      );
                    }

                  }

                }
              }

              if (flag) {
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
              }

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



test.describe('Publish the Project after completed the Tier 1, Tier 2, Tier 3 topic', { tag: '@UI' }, () => {
  let projectsPage;
  let fieldHandler;
  let page;

  // Test configuration and setup
  const { newEmail } = getData('UI');

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');
  test.use({ storageState: authStoragePath });

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
    await loginPage.accecptAll();
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validat project title
    const projectTitle = await projectsPage.overviewtitle();
    await expect(projectTitle).toBeVisible({ timeout: 20000 });
    await expect(projectTitle).toHaveText(project.uiProjectName);
  });

  test('Verify Publish button is visible and enabled after filling all other fields ', async () => {
    const errors = [];

    // Verify Publish Button Visibility and Enablement
    await safeExpect('Publish Button should be visible and enabled',
      async () => {
        const publishButton = await projectsPage.publishButton();
        await expect(publishButton).toBeVisible();
        await expect(publishButton).toBeEnabled({ timeout: 20000 });
      },
      errors
    )

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  test('Verify Project Update modal', async () => {
    const errors = [];

    await safeExpect('Click on the Last Update Link',
      async () => {
        const viewChanges = await projectsPage.viewChangesLink();
        await expect(viewChanges).toBeVisible();
        await viewChanges.click();
      },
      errors
    );

    await safeExpect('Verify Project Update modal',
      async () => {
        await expect(await projectsPage.projectUpdateModal()).toBeVisible();
        await expect(await projectsPage.projectUpdateTitle()).toBeVisible();
        await expect(await projectsPage.projectUpdateCloseButton()).toBeVisible();
        await expect(await projectsPage.historyView()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Click on the Close button of Project Update modal', async () => {
    const errors = [];

    if (!(await (await projectsPage.projectUpdateModal()).isVisible())) {
      await safeExpect('Click on the Last Update Link',
        async () => {
          const viewChanges = await projectsPage.viewChangesLink();
          await expect(viewChanges).toBeVisible();
          await viewChanges.click();
        },
        errors
      );
    }

    await safeExpect('Click on the Close button of Project Update modal',
      async () => {
        const closeButton = await projectsPage.projectUpdateCloseButton();
        await expect(closeButton).toBeVisible();
        await closeButton.click();
        await expect(await projectsPage.projectUpdateModal()).not.toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

  test('Verify the Current draft card', async () => {
    const errors = [];

    if (!(await (await projectsPage.projectUpdateModal()).isVisible())) {
      await safeExpect('Click on the Last Update Link',
        async () => {
          const viewChanges = await projectsPage.viewChangesLink();
          await expect(viewChanges).toBeVisible();
          await viewChanges.click();
        },
        errors
      );
    }

    await safeExpect('Verify current draft card heading',
      async () => {
        await expect(await projectsPage.currentDraftCard()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeader()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeaderText()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeaderText()).toHaveText('Current draft');
        await expect(await projectsPage.currentDraftCardHeaderbadge()).toBeVisible();
        await expect(await projectsPage.currentDraftCardHeaderbadge()).toHaveText('Not published');
      },
      errors
    );

    // Verify Summary of Updates field
    await safeExpect('verfiy current draft card body',
      async () => {
        await expect(await projectsPage.currentDraftCardbody()).toBeVisible();
        await expect(await projectsPage.currentDraftCardbodyVersioNotes()).toBeEnabled();
        await expect(await projectsPage.currentDraftCardbodyVersionNotesText()).toBeEnabled();
        await expect(await projectsPage.currentDraftCardbodyVersionNotesText()).toHaveText('Summary of changes');
        await expect(await projectsPage.currentDraftCardbodyVersionNotesPera()).toBeEnabled();
        await expect(await projectsPage.currentDraftCardbodyVersionNotesPera()).toHaveText('Add a summary...');
        await expect(await projectsPage.currentDraftCardbodyChanges()).toBeEnabled();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('verify the Summary of Updates field by cick on the current drat card', async () => {
    const errors = [];

    if (!(await (await projectsPage.projectUpdateModal()).isVisible())) {
      await safeExpect('Click on the Last Update Link',
        async () => {
          const viewChanges = await projectsPage.viewChangesLink();
          await expect(viewChanges).toBeVisible();
          await viewChanges.click();
        },
        errors
      );
    }

    await safeExpect('Click on the current draft card',
      async () => {
        const currentDraftCard = await projectsPage.currentDraftCard();
        await expect(currentDraftCard).toBeVisible();
        await currentDraftCard.click();
      },
      errors
    );

    // Verify Summary of Updates field
    await safeExpect('Verify Summary of Updates field',
      async () => {
        await expect(await projectsPage.drwerBackButton()).toBeVisible();
        await expect(await projectsPage.projectUpdateTitle()).toBeVisible();
        await expect(await projectsPage.projectUpdateCloseButton()).toBeVisible();
        await expect(await projectsPage.summaryOfUpdatesTextarea()).toBeVisible();
        await expect(await projectsPage.summaryOfUpdates()).toBeVisible();
        await expect(await projectsPage.summaryOfUpdatesLabel()).toBeVisible();
        await expect(await projectsPage.summaryOfUpdatesHelperText()).toBeVisible();
        await expect(await projectsPage.summaryOfUpdatesHelperText()).toHaveText('Once published, your comments will be visible to the public');
        await expect(await projectsPage.changelog()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  test('Unsaved changes modal', async () => {
    const errors = [];

    if (!((await (await projectsPage.projectUpdateModal()).isVisible()) || (await (await projectsPage.currentDraftModal()).isVisible()))) {
      await safeExpect('Click on the Last Update Link',
        async () => {
          const viewChanges = await projectsPage.viewChangesLink();
          await expect(viewChanges).toBeVisible();
          await viewChanges.click();
        },
        errors
      );

      await safeExpect('Click on the current draft card',
        async () => {
          const currentDraftCard = await projectsPage.currentDraftCard();
          await expect(currentDraftCard).toBeVisible();
          await currentDraftCard.click();
        },
        errors
      );
    }

    // Click on the Back button
    await safeExpect('Click on the Back button',
      async () => {
        const inputSummary = await projectsPage.summaryOfUpdates()
        await expect(inputSummary).toBeVisible();
        await inputSummary.fill('Test');
        const backButton = await projectsPage.drwerBackButton();
        await expect(backButton).toBeVisible();
        await backButton.click();
      },
      errors
    );

    // Verify Unsaved changes modal
    await safeExpect('Verify unsaved changes modal',
      async () => {
        await expect(await projectsPage.unsavedChangesModal()).toBeVisible();
        await expect(await projectsPage.unsavedChangesHeader()).toBeVisible();
        await expect(await projectsPage.unsavedChangesHeader()).toHaveText('Unsaved changes');
        await expect(await projectsPage.unsavedChnagesCloseIcon()).toBeVisible();
        await expect(await projectsPage.unsavedChnagesDiscription()).toBeVisible();
        await expect(await projectsPage.unsavedChnagesDiscription()).toHaveText("Are you sure you want to discard the changes you've made?You cannot undo this action.");
        await expect(await projectsPage.cancelButton()).toBeVisible();
        await expect(await projectsPage.discardButton()).toBeVisible();
      },
      errors
    );

    await safeExpect('Click on the Cancel button',
      async () => {
        // cancel button on the unsaved changes modal
        const cancelButton = await projectsPage.cancelButton();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();
      }
      , errors
    );

    await safeExpect('Click on the Discard button',
      async () => {
        // cancel button on the current draft modal
        const cancelButton = await projectsPage.cancelButton();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click({ force: true });
        const discardButton = await projectsPage.discardButton();
        await expect(discardButton).toBeVisible();
        await discardButton.click();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Verify the Summary of Updates field by click on the Publish button', async () => {
    const errors = [];

    if (!((await projectsPage.projectUpdateModal()).isVisible())) {
      await safeExpect('close modal',
        async () => {
          const closeButton = await projectsPage.projectUpdateCloseButton();
          await expect(closeButton).toBeVisible();
          await closeButton.click();
        },
        errors
      );
    }

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

    // Verify Summary of Updates field
    await safeExpect('Verify Summary of Updates field',
      async () => {
        const summaryOfUpdates = await projectsPage.summaryOfUpdates();
        await expect(summaryOfUpdates).toBeVisible();
        await expect(summaryOfUpdates).toBeEnabled();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  test('Publish the project after Filled another remaining fields', async () => {
    const errors = [];

    if (!(await (await projectsPage.draftPublishButton()).isVisible())) {
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
    }

    // Click on Publish Button
    await safeExpect('Click on Publish button after fill summary of Updates',
      async () => {
        const summaryOfUpdates = await projectsPage.summaryOfUpdates();
        await expect(summaryOfUpdates).toBeVisible();
        await summaryOfUpdates.fill('Test');
        const draftPublishButton = await projectsPage.draftPublishButton();
        await expect(draftPublishButton).toBeVisible();
        await expect(draftPublishButton).toBeEnabled();
        await draftPublishButton.click();
      },
      errors
    );

    // Verify Success Message after Publishing
    await safeExpect('Check success message after publishing',
      async () => {
        const success = await fieldHandler.successMessagediv();
        const successMessage = await success.innerText();
        await expect(success).toBeVisible();
        await expect(successMessage).toBe('Your updates have been published!');
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


});


test.describe('Verify the all Fileds are saved', { tag: '@UI' }, () => {

  let page;
  let fieldHandler;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');
  test.use({ storageState: authStoragePath });

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

    // Validat project title
    const projectTitle = await projectsPage.overviewtitle();
    await expect(projectTitle).toBeVisible({ timeout: 20000});
    await expect(projectTitle).toHaveText(project.uiProjectName);
  });

  test.afterAll(async () => {
    // Close the page after all tests are done
    await page.close();
  });


  // Iterate over each step group in the topic
  for (let i = 0; i < formData.topics.length; i++) {
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
              const stepElement = await fieldHandler.findStep(step.name);

              // Check step visibility before proceeding
              await fieldHandler.checkStepVisibility(stepElement, step, test);
              // await fieldHandler.checkValidateField(step, test);

              // Ensure step is visible and click on it
              await expect(stepElement).toBeVisible();
              await stepElement.click();
              const stepLabel = await page.locator('h1', { hasText: step.label, exact: true });
              await expect(stepLabel).toBeVisible();
            })

            test(`Validate All Fields are saved for Step: ${step.label}`, async () => {
              const errors = [];

              for (const section of step.sections) {
                if (!section?.field_groups) continue;
                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  // Iterate through fields within each group
                  for (const field of fieldGroup.fields) {

                    // Skip specific fields based on conditions
                    if (['Project name', 'Methodology'].includes(field.label)) continue;
                    // if (field.name == 'geographicLocation-projectFile-storage') continue;
                    if (
                      field.name === 'creditIssuerOther-nameValue-nameValue' ||
                      field.name === 'geographicLocation-projectFile-storage' ||
                      field.name === 'projectOther-nameValue-nameValue'
                    ) {
                      continue;
                    }
                    await safeExpect('Validate the Field after save', async () => {
                      const inputLocator = await fieldHandler.getLocator(
                        field.name, field.label, field.type, field.component
                      );
                      if (inputLocator) {
                        const projectdataFilePath = './tests/data/Project-data.json';
                        const data = await fieldHandler.getData('ProjectData', projectdataFilePath);

                        const value = data[field.name];
                        if (value) {
                          await expect(inputLocator).toBeVisible();
                          await fieldHandler.validateFieldAfterSave(inputLocator, field, value);
                        }

                      }
                    }, errors)
                  }

                }

              }

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
