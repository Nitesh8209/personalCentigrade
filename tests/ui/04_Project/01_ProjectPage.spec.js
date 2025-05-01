const { test, expect } = require('@playwright/test');
const { ValidTestData } = require('../../data/SignUpData');
import path from "path";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { methodologyOptions, project } from "../../data/projectData";
import { getData, saveData } from "../../utils/apiHelper";
import { safeExpect } from "../../utils/authHelper";
import { projectValidationCredentials } from "../../data/testData";


test.describe('Project Page', { tag: '@UI' }, () => {
  const { newEmail } = getData('UI');

  let page;
  
    test.beforeAll(async ({ browser, baseURL }) => {
      const context = await browser.newContext();
      page = await context.newPage();

      const loginPage = new LoginPage(page, baseURL);
      await loginPage.navigate();
      await loginPage.login(projectValidationCredentials.email, projectValidationCredentials.password);
       
    await page.waitForURL('**/projects');
    const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-auth-admin.json');
    await page.context().storageState({ path: authStoragePath });
    });


  test('Verify project page displays correctly', async ({ baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);


    // Verify the Project Button on the Left sidebar
    await safeExpect('Projects Button should be displayed',
      async () => {
        await expect(await projectsPage.leftSideBar()).toBeVisible();
        await expect(await projectsPage.projectsHomeButton()).toBeVisible();
        await expect(await projectsPage.listingsButton()).toBeVisible();
        await expect(await projectsPage.SettingsButton()).toBeVisible();
        await expect(await projectsPage.avatar()).toBeVisible();
      },
      errors
    );

    // Verify the Project Empty Text content and button
    await safeExpect('Projects Empty State Text content and button',
      async () => {
        await expect(await projectsPage.ProjectEmptyState()).toBeVisible();
        await expect(await projectsPage.ProjectEmptyStateTitle()).toBeVisible();
        await expect(await projectsPage.ProjectEmptyStateTitle()).toHaveText('Get started on Centigrade');
        await expect(await projectsPage.ProjectEmptyStateContent()).toBeVisible();
        await expect(await projectsPage.ProjectEmptyStateContent()).toHaveText("You don't have any projects.Get started by creating your first project");
        await expect(await projectsPage.createProjectButton()).toBeVisible();
        await expect(await projectsPage.createProjectButton()).toHaveText('+ Create Project');
      },
      errors
    );

    // Verify the Project Page Need help button
    await safeExpect('Project Page Need help button',
      async () => {
        await expect(await projectsPage.needHelpButton()).toBeVisible();
        await expect(await projectsPage.needHelpButton()).toHaveText('Need help');
      },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  });

  test('Verify create new project modal and content on project page', async ({ baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    // Verify the Project Page Need help button
    await safeExpect('Project Modal and Heading',
      async () => {
        await expect(await projectsPage.modal()).toBeVisible();
        await expect(await projectsPage.modalHeading()).toBeVisible();
        await expect(await projectsPage.modalHeading()).toHaveText('Create new project');
        await expect(await projectsPage.modalcontent()).toBeVisible();
        await expect(await projectsPage.createProjectForm()).toBeVisible();
      },
      errors
    );

    // Verify the Project Page Need help button
    await safeExpect('Project Name in modal',
      async () => {
        await expect(await projectsPage.projectName()).toBeVisible();
        await expect(await projectsPage.projectNameLabel()).toBeVisible();
        await expect(await projectsPage.projectNameLabel()).toHaveText('Project name');
        await expect(await projectsPage.helperText()).toBeVisible();
        await expect(await projectsPage.helperText()).toHaveText('Name used to refer to the carbon project being developed');
      },
      errors
    );

    // Verify the Methodology in create project modal
    await safeExpect('Project Methodology in create new project modal',
      async () => {
        await expect(await projectsPage.methodologyLabel()).toBeVisible();
        await expect(await projectsPage.methodologyLabel()).toHaveText('Methodology');
        await expect(await projectsPage.methodologytrigger()).toBeVisible();
      },
      errors
    );

    // Verify the Buttons in create new project modal
    await safeExpect('Buttons in create new project modal',
      async () => {
        const cancelButton = await projectsPage.cancelButton();
        await expect(cancelButton).toBeVisible();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();
      },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  });

  test('Verify methodology dropdown functionality in create new project modal', async ({ baseURL }) => {

    const errors = [];
    let expectedDescriptions;
    const projectsPage = new ProjectsPage(page, baseURL);
    await page.reload();

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.getMethodologies)
    );

    const responseBody = await response.json();
     expectedDescriptions = responseBody.map(item => item.description);

    const methodologytrigger = await projectsPage.methodologytrigger();
    const methodologymenu = await projectsPage.methodologymenu();
    const methodologymenutext = await projectsPage.methodologymenutext();

    await safeExpect('Methodology Menu Text content',
      async () => {
        await methodologytrigger.click();
        await expect(methodologymenu).toBeVisible();
        await expect(await methodologymenutext.first()).toBeVisible()
        const menuTextContents = await methodologymenutext.allTextContents();
        for (let index = 0; index < expectedDescriptions.length; index++) {
          const item = expectedDescriptions[index];
          await expect(await methodologymenutext.nth(index)).toBeVisible();
        }
        await expect(menuTextContents).toHaveLength(expectedDescriptions.length)
        await expect(new Set(menuTextContents)).toEqual(new Set(expectedDescriptions));

        await methodologytrigger.click();
        await expect(methodologymenu).not.toBeVisible();
      },
      errors
    );

    await safeExpect('Select different Metholodogies',
      async () => {
        for (let i = 0; i < expectedDescriptions.length; i++) {
          const methodologydropdown = await projectsPage.methodologyDropdown();
          const Visiblelistbox = await methodologydropdown.isVisible();

          if (!Visiblelistbox) {
            await methodologytrigger.click();
          }
          const item = expectedDescriptions[i];
          await expect(await projectsPage.methodologyselectOption(item)).toBeVisible();
          const selectOption = await projectsPage.methodologyselectOption(item);
          await selectOption.click();
          await expect(methodologymenu).not.toBeVisible();
          await expect(await projectsPage.selectedMethodology()).toHaveText(item);
        }
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Cancel Button functionality in Create New Project Modal', async ({ baseURL }) => {

    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);
    await page.reload();

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    const methodologytrigger = await projectsPage.methodologytrigger();
    const pojectScaletrigger = await projectsPage.pojectScaletrigger();
    const classificationCategorytrigger = await projectsPage.classificationCategorytrigger();
    const classificationMethodtrigger = await projectsPage.classificationMethodtrigger();
    const projectName = await projectsPage.projectName()
    await safeExpect('Fill all fileds',
      async () => {
        await expect(projectName).toBeVisible();
        await projectName.fill('Project');
        await expect(projectName).toHaveValue('Project');

        await methodologytrigger.click();
        const selectmethodologyOptions = await projectsPage.methodologyselectOption(methodologyOptions[0]);
        await selectmethodologyOptions.click();
        await expect(await projectsPage.selectedMethodology()).toHaveText(methodologyOptions[0]);

        // await pojectScaletrigger.click();
        // const selectprojectScaleOptions = await projectsPage.projectScaleselectOption(projectScaleOptions[0]);
        // await selectprojectScaleOptions.click();
        // await expect(await projectsPage.selectedpojectScale()).toHaveText(projectScaleOptions[0]);

        // await classificationCategorytrigger.click();
        // const selectclassificationCategoryOptions = await projectsPage.classificationCategoryselectOption(classificationCategoryOptions[0]);
        // await selectclassificationCategoryOptions.click();
        // await expect(await projectsPage.selectedclassificationCategory()).toHaveText(classificationCategoryOptions[0]);
        // await classificationCategorytrigger.click();

        // await classificationMethodtrigger.click();
        // const selectclassificationMethodOptions = await projectsPage.classificationMethodselectOption(classificationMethodOptions[0]);
        // await selectclassificationMethodOptions.click();
        // await expect(await projectsPage.selectedclassificationMethod()).toHaveText(classificationMethodOptions[0]);
      },
      errors
    );

    await safeExpect('click on cancel and verify the fields in create new project modal',
      async () => {
        const cancel = await projectsPage.cancelButton();
        await cancel.click();

        await createProjectButton.click();
        await expect(await projectsPage.selectedMethodology()).toHaveText('');
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Create Button in create new project modal, Saves Project and Navigates to Overview', async ({ baseURL }) => {
    await page.reload();
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

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
        const [ response ] = new Promise.all([
          page.waitForResponse(resp => resp.url().includes('/project')),
          await create.click()
        ])

        const responseBody = await response.json();
        const projectId = responseBody.id;
        await saveData({ ValidateProjectId: projectId}, "UI");
        
        await page.waitForURL('**/projects/**/overview');
        await page.waitForLoadState('networkidle');
        await expect(await projectsPage.modal()).not.toBeVisible();
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

  test('Verify Project Page After Creating a New Project', async ({ baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);
    await page.goto(`${baseURL}/projects`);

    await safeExpect('Project Breadcrump Visibility',
      async () => {
        await expect(await projectsPage.projectBreadcrumb()).toBeVisible();
      }, errors
    );

    await safeExpect('Project Heading Visibility',
      async () => {
        await expect(await projectsPage.projectHeading()).toBeVisible();
        await expect(await projectsPage.projectHeading()).toHaveText('Projects');
      }, errors
    );

    await safeExpect('Create Project Visibility',
      async () => {
        await expect(await projectsPage.createProjectButton()).toBeVisible();
        await expect(await projectsPage.createProjectButton()).toHaveText('+ Create Project');
      }, errors
    );

    await safeExpect('Project card Visibility',
      async () => {
        await expect(await projectsPage.projectlist()).toBeVisible();
        await expect(await projectsPage.projectCard()).toBeVisible();
        await expect(await projectsPage.projectInfo()).toBeVisible();
        await expect(await projectsPage.projectInfo()).toHaveText(project.uiProjectName);
      }, errors
    );

    await safeExpect('View Project Visibility',
      async () => {
        await expect(await projectsPage.viewProjectButton()).toBeVisible();
      }, errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

});