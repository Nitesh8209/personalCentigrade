import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../../../pages/loginPage';
import { ProjectsPage } from '../../../pages/projectsPage';
import { FieldHandler } from '../../utils/fieldValidation';
import { getData } from '../../utils/apiHelper';
import * as fs from 'fs';
import { safeExpect } from "../../utils/authHelper";
import { methodologyOptions, project } from '../../data/projectData';
import { ValidTestData } from '../../data/SignUpData';
import { Credentials, projectPublishCredentials } from '../../data/testData';

// Load form data from JSON file
const formDataPath = path.join(__dirname, '..', '..', 'data', 'form-data.json');
const formData = JSON.parse(fs.readFileSync(formDataPath, 'utf-8'));
const filePath = require('path').resolve(__dirname, '../../assets/file2.png');

test.describe('project creation', { tag: ['@UI', '@SMOKE'] }, () => {

   test.beforeEach(async ({ page, baseURL }) => {
        const loginPage = new LoginPage(page, baseURL);
        await loginPage.navigate();
        await loginPage.login(projectPublishCredentials.email, projectPublishCredentials.password);
         
      await page.waitForURL('**/projects');
      const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');
      await page.context().storageState({ path: authStoragePath });
      });

 test('Create Button in create new project modal, Saves Project and Navigates to Overview', async ({page, baseURL }) => {
    const errors = [];
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // await loginPage.navigate();

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    const methodologytrigger = await projectsPage.methodologytrigger();
    const projectName = await projectsPage.projectName()
    await safeExpect('Fill all fileds',
      async () => {
        await expect(projectName).toBeVisible();
        await projectName.fill(project.uiProjectName);
        await expect(projectName).toHaveValue(project.uiProjectName);

        await methodologytrigger.click();

        const selectedMethodology = process.env.METHODOLOGY || methodologyOptions[11];

        const selectmethodologyOptions = await projectsPage.methodologyselectOption(selectedMethodology);
        await selectmethodologyOptions.click();
        await expect(await projectsPage.selectedMethodology()).toHaveText(selectedMethodology);

      },
      errors
    );

    await safeExpect('click on save and verify the project is display',
      async () => {
        const create = await projectsPage.createButton();
        await create.click();
        await page.waitForURL('**/projects/**/overview');
        await page.waitForLoadState('networkidle');

        if((await (await projectsPage.modal()).isVisible())){
          const closeButton = await projectsPage.modalClose();
          await closeButton.click();
        }
        await expect(await projectsPage.overviewProject()).toBeVisible({ timeout: 20000});
        await expect(await projectsPage.overviewHeader()).toBeVisible();
        await expect(await projectsPage.overviewtitle()).toBeVisible();
        await expect(await projectsPage.overviewtitle()).toHaveText(project.uiProjectName);
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })
})

test.describe('Fill All Required Fields and Save', { tag: ['@UI', '@SMOKE'] }, () => {
  const { newEmail } = getData('UI');
  let page;
  let fieldHandler;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');
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


test.describe('Publish the Project after completed the Tier 0 topic', { tag: ['@UI', '@SMOKE'] }, () => {
  let projectsPage;
  let fieldHandler;
  let page;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');

  test.use({
    storageState: authStoragePath,
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
        await expect(successMessage).toBe('Your project has been submitted for review');
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

});

test.describe('Approve project by superuser',{ tag: ['@UI', '@SMOKE'] } ,() =>{
  let projectsPage;
  let fieldHandler;
  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    projectsPage = new ProjectsPage(page, baseURL);
    fieldHandler = new FieldHandler(page);

    // Navigate and setup initial state
    await loginPage.navigate();
    await loginPage.login(Credentials.username, Credentials.password);
    await page.waitForLoadState('networkidle');
    await projectsPage.selectOrg(projectPublishCredentials.organizationName);

    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);
  });

 

  test('Verify Approve project button is visible and Approve', async () => {
    
    const errors = [];

    await safeExpect('Verify Approve project Button should be visible and enabled and click',
      async () => {
        const approveButton = await projectsPage.approveProject();
        await expect(approveButton).toBeVisible();
        await expect(approveButton).toBeEnabled();
        await approveButton.click();
      },
      errors
    );

    await safeExpect('Approve project modal should be visible and Click on the Approve Button', async () => {
      const approveModal = await projectsPage.approveModal();
      await expect(approveModal).toBeVisible();

      const approveButton = await projectsPage.approveButton();
      await expect(approveButton).toBeVisible();
      await approveButton.click();
    },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

})

test.describe('Project after approve Project', { tag: ['@UI', '@SMOKE'] }, ()=>{
  let projectsPage;
  let fieldHandler;
  let page;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');

  test.use({
    storageState: authStoragePath,
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
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);
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
        await triggerButton.click();
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
        const modal = await projectsPage.modal();
        await expect(modal).toBeVisible();
        const link = await projectsPage.copyLink();
        await expect(link).toBeVisible();
        await link.click();
        const success = await fieldHandler.successMessagediv();
        const successMessage = await success.innerText();
        await expect(success).toBeVisible();
        await expect(successMessage).toBe('Link has been copied to your clipboard');
        const closeToast = await fieldHandler.closeToast();
        await closeToast.click();
        
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

})



