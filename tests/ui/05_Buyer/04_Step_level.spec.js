import { test, expect } from "@playwright/test";
import { ListingPage } from "../../../pages/listingsPage";
import path from "path";
import fs from "fs";
import { safeExpect } from "../../utils/authHelper";
import { ProjectListings } from "../../../pages/projectListingPage";
import { LoginPage } from "../../../pages/loginPage";
import { ValidTestData } from "../../data/SignUpData";
import { getData } from "../../utils/apiHelper";
import { hasValidStepFields, navigateToStep, setupPage, validateFieldGroupVisibility, validateSectionLabelVisibility } from "../../utils/listingsProjectHelper";
import { authStates, project } from "../../data/projectData";

const viewDatapath = path.join(__dirname, '..', '..', 'data', 'view-data.json');
export const viewData = JSON.parse(fs.readFileSync(viewDatapath, 'utf-8'));


test.describe("Step Level Validation", { tag: '@UI' }, () => {

  // Iterate over different authentication states
  for (const authState of authStates) {
    test.describe(`${authState.name} Users`, () => {

      const credentials = authState.isAuthenticated ? {
        email: getData('UI').newEmail,
        password: ValidTestData.newPassword
      } : null;

      if(authState.isAuthenticated){
            const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');
            test.use({ storageState: authStoragePath });
      }
  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

     // Navigate to project details
     const listingPage = new ListingPage(page);

     const loginPage = authState.isAuthenticated ? new LoginPage(page, baseURL) : null;

     await setupPage(page, loginPage, credentials, listingPage, baseURL);
     
     if(loginPage){
     await loginPage.accecptAll();
     }

    });

      // Iterate over each topic in the view data
      for (const topic of viewData.topics) {
        test.describe(`Topic: ${topic.label}`, () => {

          // Before each test in this topic: Click on the topic to expand it
          test.beforeAll(async () => {
            const projectListings = new ProjectListings(page);
            const topicLabel = await projectListings.topicName(topic.label);
            await topicLabel.click();
          });

          // Filter and iterate over step groups with valid labels
          for (const stepGroup of (topic.step_groups || []).filter(sg => sg.label)) {
           
            test.describe(`Step Group: ${stepGroup.label}`, () => {
             
              test.beforeAll(async () => {
                const projectListings = new ProjectListings(page);
                const stepGroupElement = await projectListings.stepGroup(stepGroup.label)
                await stepGroupElement.click();
              });
            // Test to validate steps within the step group
            test(`Validate steps in ${stepGroup.label}`, async () => {
              const projectListings = new ProjectListings(page);

              const errors = [];
              const firstStepName = topic.step_groups[0].steps[0].name;

              for (const step of stepGroup.steps) {
                
                // Not Visbile this step if all its fields are null or empty
                const hasValidStepFieldsElement = await hasValidStepFields(step);
                if (!hasValidStepFieldsElement) {
                  await safeExpect(`Step ${step.label} should not be visible if all fields are null`, async () => {
                    await expect(await projectListings.stepLabel(step.label)).not.toBeVisible();
                    await expect(await projectListings.contentStepLabel(step.label)).not.toBeVisible();
                  }, errors);
                  continue;
                }

                // Validate step visibility and state (enabled/disabled based on auth)
                await safeExpect(`Step ${step.label} visibility and state`, async () => {
                  const stepElement = await projectListings.stepLabel(step.label);
                  await expect(stepElement).toBeVisible();
                  await expect(stepElement).toBeEnabled();
                  if (!(authState.isAuthenticated) && topic.name !== 'projectStory') {
                    await expect(stepElement).toHaveClass(/disabled/);
                  }
                }, errors);

                // Validate navigation to the step
                await safeExpect(`Step ${step.label} navigation`, async () => {
                  const stepElement = await projectListings.stepLabel(step.label);
                  await stepElement.click();
                  const expectedUrlPart = (authState.isAuthenticated || topic.name === 'projectStory')
                    ? step.name
                    : firstStepName;
                  await expect(page.url()).toContain(expectedUrlPart);
                }, errors);

                // If authenticated, validate that step content is visible
                if (authState.isAuthenticated) {
                  await safeExpect(`Step ${step.label} content visibility`, async () => {
                    const contentElement = await projectListings.contentStepLabel(step.label);
                    await expect(contentElement).toBeVisible();
                    await expect(contentElement).toHaveText(step.label);
                  }, errors);
                }
              }

              if (errors.length > 0) {
                throw new Error(`Validation errors:\n${errors.join('\n')}`);
              }
            })

            // Test to validate sections and field groups within the step group
            test(`Validate sections and field groups in ${stepGroup.label}`, async () => {
              const errors = [];
              const projectListings = new ProjectListings(page);


              // Iterate over each step in the step group
              for (const step of stepGroup?.steps) {
                const hasValidFields = await hasValidStepFields(step);
                if (!hasValidFields || !step.sections) continue;

                await navigateToStep(step, projectListings, errors);

                if (authState.isAuthenticated || topic.name === 'projectStory') {
                  for (const section of step?.sections) {

                    const hasValidSection = section.field_groups?.some(fieldgroup =>
                      fieldgroup?.fields?.some(field => field !== null)
                    );

                    if (!hasValidSection) {
                      // Validate that sections with no valid fields are not visible
                      await safeExpect(`Section ${section.name} should not be visible`, async () => {
                        await expect(await projectListings.sectionLabel(section.name)).not.toBeVisible();
                        await expect(await projectListings.contentSectionLabel(section.id)).not.toBeVisible();
                      }, errors);
                      continue;
                    }

                    // Validate section label visibility if it exists
                    if (section.label) {
                      await validateSectionLabelVisibility(section, projectListings, errors);
                    }

                    // Validate field group visibility
                    for (const fieldGroup of section.field_groups || []) {
                      if (fieldGroup.fields && fieldGroup.label) {
                        await validateFieldGroupVisibility(fieldGroup, projectListings, errors);
                      }
                    }
                  }
                } else {
                  // For unauthenticated users, validate the first step's sections and field groups
                  const stepGroup = topic.step_groups[0];
                  const step = stepGroup.steps[0];
                  if(step.sections[0].label){
                    await safeExpect(`Section '${step.label}' visibility`, async () => {
                      await expect(await projectListings.sectionLabel(step.sections[0].name)).toBeVisible();
                      await expect(await projectListings.sectionLabel(step.sections[0].name)).toHaveText(step.sections[0].label);
                    }, errors);
                  }
                  
                  for (const section of step.sections) {
                    if (!section?.field_groups || section.field_groups.length === 0) continue;

                    for (const fieldGroup of section.field_groups) {
                      if (fieldGroup.label && fieldGroup.fields) {
                        await safeExpect(`Field Group '${fieldGroup.label}' visibility`, async () => {
                          await expect(await projectListings.fieldGroupLabel(fieldGroup.label)).toBeVisible();
                          await expect(await projectListings.fieldGroupLabel(fieldGroup.label)).toHaveText(fieldGroup.label);
                        }, errors);
                      }
                    }

                  }
                }
              }

              if (errors.length > 0) {
                throw new Error(`Validation errors:\n${errors.join('\n')}`);
              }

            });

            if(!(authState.isAuthenticated)){
              const firstStepName = topic.step_groups[0].steps[0].label;

              test(`Validate Title of Step Group ${stepGroup.label}`, async () => {
              const errors = [];

              const projectListings = new ProjectListings(page);
              const stepGroupElement = await projectListings.stepGroup(stepGroup.label);
              await safeExpect(`Step Group ${stepGroup.label} title visibility`, async () => {
                await expect(await page.title()).toContain(`${project.buyerProject} - ${firstStepName} | Centigrade`);
              }, errors);

              if (errors.length > 0) {
                throw new Error(`Validation errors:\n${errors.join('\n')}`);
              }
            });
            }

          });
          }

        })
      }
    })
  }
})

