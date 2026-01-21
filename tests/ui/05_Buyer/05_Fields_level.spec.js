import { test, expect } from "@playwright/test";
import { ListingPage } from "../../../pages/listingsPage";
import { LoginPage } from "../../../pages/loginPage";
import { ProjectListings } from "../../../pages/projectListingPage";
import { ValidTestData } from "../../data/SignUpData";
import { getData } from "../../utils/apiHelper";
import { safeExpect } from "../../utils/authHelper";
import { hasValidStepFields, validateFieldsDisplayOrder, hasValidStepGroupFields, checkDisplayDependencyField, isFieldGroupVisible } from "../../utils/listingsProjectHelper";
import path from "path";
import fs from 'fs';
import { project } from "../../data/projectData";

const viewDatapath = path.join(__dirname, '..', '..', 'data', 'view-data.json');
export const viewData = JSON.parse(fs.readFileSync(viewDatapath, 'utf-8'));

test.describe("Fields Level Validation - after Login", { tag: ['@projectViewUi', '@UI'] }, () => {

  const { BuyerprojectGuid } = getData('UI');

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-buyer-auth.json');
  test.use({ storageState: authStoragePath });

  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page, baseURL);
    const listingPage = new ListingPage(page);
        await page.goto(`${baseURL}/listings/projects/${BuyerprojectGuid}/overview`);

    // await setupPage(page, loginPage, credentials, listingPage, baseURL);
    await loginPage.acceptAll();
  });

  // Loop through each topic and validate visibility
  for (const topic of viewData.topics) {
    test.describe(`topic ${topic.label}`, () => {

      // Setup for each topic test: navigate to topic
      test.beforeAll(async () => {
        const projectHeader = new ProjectListings(page);
        const topicLabel = await projectHeader.topicName(topic.label);
        await topicLabel.click();
      });

      // Case 1: Single step group scenario
      if (topic.step_groups && topic.step_groups.length === 1) {
        const stepGroup = topic.step_groups[0];
        test.describe(`Single Step Group: ${stepGroup.label}`, () => {

          // Test breadcrumb visibility for single step group page
          // test(`Validate breadcrumbs on single page for ${stepGroup.label}`, async () => {
          //   const errors = [];
          //   const fieldHandler = new FieldHandler(page);

          //     // Validate breadcrumbs using helper function
          //     await validateBreadcrumbs(fieldHandler, errors, {
          //       expectedCount: 3,
          //       separatorCount: 2,
          //       breadcrumbs: [
          //         { index: 0, href: '/listings', text: "Projects" },
          //         { index: 1, href: '', text: project.buyerProject },
          //         { index: 2, href: '', text: topic.label }
          //       ]
          //     });


          //   if (errors.length > 0) {
          //     throw new Error(`Validation errors found:\n${errors.join('\n')}`);
          //   }
          // });

          test(`Validate Title of Step Group ${stepGroup.label}`, async () => {
              const errors = [];

              const projectListings = new ProjectListings(page);
              const stepGroupElement = await projectListings.stepGroup(stepGroup.label);
              await safeExpect(`Step Group ${stepGroup.label} title visibility`, async () => {
                await expect(await page.title()).toContain(`${project.buyerProject} - ${topic.label} | Centigrade`);
              }, errors);

              if (errors.length > 0) {
                throw new Error(`Validation errors:\n${errors.join('\n')}`);
              }
            });
            
        });
      }
      // Case 2: Multiple step groups scenario
      else if (topic.step_groups && topic.step_groups.length > 1) {

        // Handle multiple step groups - each step is on a different page
        for (const [index, stepGroup] of topic.step_groups.entries()) {
          test.describe(`Step Group: ${stepGroup.label}`, () => {
            test.beforeAll(async () => {
              const projectListings = new ProjectListings(page);
              const hasValidStepGroupFieldsElement = await hasValidStepGroupFields(stepGroup);
              if (!hasValidStepGroupFieldsElement) {
                test.skip(true, 'No Fields Available in this Step Group');
              }

              const stepGroupElement = await projectListings.stepGroup(stepGroup.label);
              const state = await stepGroupElement.getAttribute('data-state');
              if (index !== 0 && state === 'closed') {
                await stepGroupElement.click();
              }
            });

            // Iterate through each step in the step group
            for (const step of stepGroup.steps) {
              // Test breadcrumb validation for each step 
              // test(`Validate Breadcrump on step ${step.label} on separate page`, async () => {
              //   const hasValidStepFieldsElement = await hasValidStepFields(step);
              //   if (!hasValidStepFieldsElement) {
              //     test.skip(true, 'No Fields Availabel in this');
              //   }

              //   const errors = [];
              //   const projectListings = new ProjectListings(page);
              //   const fieldHandler = new FieldHandler(page);

              //   // Navigate to the specific step
              //   const stepElement = await projectListings.stepLabel(step.label);
              //   await stepElement.click();

              //   // Define breadcrumb data for validation
              //   const breadcrumbData = {
              //     expectedCount: 5,
              //     separatorCount: 4,
              //     breadcrumbs: [
              //       { index: 0, href: '/listings', text: "Projects" },
              //       { index: 1, href: '', text: project.buyerProject },
              //       { index: 2, href: '', text: await convertToTitleCase(topic.name) },
              //       { index: 3, href: '', text: await convertToTitleCase(stepGroup.name) },
              //       { index: 4, href: '', text: await convertToTitleCase(step.name) }
              //     ]
              //   };

              //   // Verify URL contains step name
              //   await safeExpect(`URL should contain step name: ${step.name}`, async () => {
              //     await expect(page.url()).toContain(step.name);
              //   }, errors);

              //   // Validate breadcrumbs
              //   await validateBreadcrumbs(fieldHandler, errors, breadcrumbData);

              //   if (errors.length > 0) {
              //     throw new Error(`Validation errors found:\n${errors.join('\n')}`);
              //   }
              // });

              // Test field label validation for each step
              test(`validate the filed label and value in the content on step ${step.label}`, async () => {
                const hasValidStepFieldsElement = await hasValidStepFields(step);
                if (!hasValidStepFieldsElement) {
                  test.skip(true, 'No Fields Availabel in this');
                }

                const errors = [];
                const projectListings = new ProjectListings(page);

                // Navigate to the specific step and wait for network idle
                const stepElement = await projectListings.stepLabel(step.label);
                await stepElement.click();
                // await page.waitForLoadState("networkidle");

                // Iterate through sections in the step
                for (const section of step?.sections || []) {
                  if (section?.field_groups == null) continue;
                  const hasValidSection = section.field_groups.some(fieldGroup => fieldGroup.fields);
                  if (!hasValidSection) continue;

                  // Iterate through field groups in the section
                  for (const fieldGroup of section?.field_groups || []) {
                    const isVisible = await isFieldGroupVisible(fieldGroup);
                    if (!isVisible) continue;

                    // Validate field group label visibility and expand if closed
                    if (fieldGroup.label) {
                      await safeExpect('verify the label', async () => {
                        const fieldGroupElement = await projectListings.contentFieldGroupLabel(fieldGroup.label);
                        await expect(fieldGroupElement).toBeVisible();
                        if (await fieldGroupElement.getAttribute('data-state') === 'closed') {
                          await fieldGroupElement.click();
                        }
                      }, errors);
                    }

                    // Iterate through fields in the field group
                    for (const field of fieldGroup?.fields || []) {
                      if (field == null) continue;

                      // Handle fields without display dependencies
                      if (!field.display_dependencies) {
                        if (field.label) {
                          await safeExpect(`verify the label and value ${field.label}`, async () => {
                            const locator = await projectListings.contentFieldLocator(field);
                            if(locator){
                              await expect(locator).toBeVisible();
                              await projectListings.contentField(field, locator);     
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
                              const locator = await projectListings.contentFieldLocator(field);
                              if(locator){
                              await expect(locator).toBeVisible();
                              await projectListings.contentField(field, locator);
                              }
                            }, errors);
                          }
                        }
                      }
                    }

                      // Validate display order of fields within the field group
                    await validateFieldsDisplayOrder(fieldGroup, projectListings, errors);
                    
                  }
                }

                if (errors.length > 0) {
                  throw new Error(`Validation errors found:\n${errors.join('\n')}`);
                }
              })

              
              test(`Validate Title of Step ${step.label}`, async () => {
              const errors = [];
              const hasValidStepFieldsElement = await hasValidStepFields(step);
                if (!hasValidStepFieldsElement) {
                  test.skip(true, 'No Fields Available in this');
                }

              const projectListings = new ProjectListings(page);

              // Navigate to the specific step and wait for network idle
                const stepElement = await projectListings.stepLabel(step.label);
                await stepElement.click();
              await safeExpect(`Step Group ${step.label} title visibility`, async () => {
                await expect(stepElement).toHaveClass(/active/);
                await expect(await page.title()).toContain(`${project.buyerProject} - ${step.label} | Centigrade`);
              }, errors);

              if (errors.length > 0) {
                throw new Error(`Validation errors:\n${errors.join('\n')}`);
              }
            });

            }
          });
        }
      }
      // Case 3: No step groups scenario
      else {
        test(`Topic ${topic.label} has no step groups`, async () => {
          test.skip(true, 'No step groups available');
        });
      }


    });

  }
});


