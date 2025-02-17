import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../../../pages/loginPage';
import { ProjectsPage } from '../../../pages/projectsPage';
import { FieldHandler } from '../../utils/fieldValidation';
import { getData } from '../../utils/apiHelper';
import * as fs from 'fs';
import { safeExpect } from "../../utils/authHelper";
import { ValidTestData } from '../../data/SignUpData';
import { project } from '../../data/projectData';

// Load form data from JSON file
const formDataPath = path.join(__dirname, '..', '..', 'data', 'form-data.json');
const formData = JSON.parse(fs.readFileSync(formDataPath, 'utf-8'));


test.describe('Step-Level UI Validations', () => {
  const { newEmail } = getData('UI');

  let page;
  let fieldHandler;

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

            test.beforeAll(async () => {
              const stepElement = await fieldHandler.findStep(step.label);

              // Check the step visibility and click
              await fieldHandler.checkStepVisibility(stepElement, step, test);
              await expect(stepElement).toBeVisible();
              await stepElement.click();
            })

            test(`Breadcrumb validation for Step: ${step.label}`, async ({ }, testInfo) => {
              const errors = [];

              // Validate breadcrumb navigation
              await safeExpect('Breadcrumb count verification', async () => {
                await expect(await fieldHandler.breadCrumps()).toHaveCount(3);
                await expect(await fieldHandler.separators()).toHaveCount(2);
              },
                errors
              );

              // Validate breadcrumb for 'Projects'
              await safeExpect('Projects breadcrumb visibility', async () => {
                await fieldHandler.validateBreadcrumb(0, '/projects', "Projects");
              },
                errors
              );

              // Validate breadcrumb for project name
              await safeExpect('Project Name BreadCrump visibility', async () => {
                await fieldHandler.validateBreadcrumb(1, expect.stringContaining('/projects/'), project.uiProjectName);
              },
                errors
              );

              // Validate breadcrumb for current step
              await safeExpect('Step Name BreadCrump visibility', async () => {
                await fieldHandler.validateBreadcrumb(2, null, step.label);
              },
                errors
              );

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              }
            });


            test(`Title and Description validation for Step: ${step.label}`, async () => {
              const errors = [];

              // Validate step title
              await safeExpect('Title visibility', async () => {
                await expect(await fieldHandler.title()).toBeVisible();
                await expect(await fieldHandler.title()).toHaveText(step.label);
              },
                errors
              );

              // Validate step description (if present)
              if (step?.description) {
                await safeExpect('Description visibility', async () => {
                  await expect(await fieldHandler.description()).toBeVisible();
                  await expect(await fieldHandler.description()).toHaveText(step.description);
                },
                  errors
                );
              }

              // If there are any errors, fail the test with all collected errors
              if (errors.length > 0) {
                throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              }

            });

            test(`Section and Field Group validation for Step: ${step.label}`, async () => {
              const errors = [];

              // Iterate over each section in the step
              for (const section of step.sections) {
                if (!section?.field_groups) continue;

                // Iterate over each field group in the section
                for (const fieldGroup of section.field_groups) {
                  if (!fieldGroup?.fields) continue;

                  // skip this step if all Fields display_dependencies has some value
                  const hasVisibleFieldGroups = await fieldGroup.fields?.some(field => field.display_dependencies == null) || false;
                  if (!hasVisibleFieldGroups) continue;

                  // Validate section labels
                  if (section?.label) {
                    await safeExpect('Sections visibility', async () => {
                      await expect(await fieldHandler.section(section.label)).toBeVisible();
                      await expect(await fieldHandler.section(section.label)).toHaveText(section.label);
                    },
                      errors
                    );
                  }

                  // Validate field group labels
                  if (fieldGroup?.label) {
                    if (fieldGroup.fields == null) continue;
                    await safeExpect('FieldGroup visibility', async () => {
                      await expect(await fieldHandler.fieldGroupLabel(fieldGroup.label)).toBeVisible();
                      await expect(await fieldHandler.fieldGroupLabel(fieldGroup.label)).toHaveText(fieldGroup.label);
                    },
                      errors
                    );
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
    })
  }

})