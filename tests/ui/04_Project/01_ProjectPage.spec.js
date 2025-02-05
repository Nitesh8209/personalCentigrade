const { test, expect } = require('@playwright/test');
const { ValidTestData } = require('../../data/SignUpData');
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { classificationCategoryOptions, classificationMethodOptions, methodologyOptions, project, projectScaleOptions } from "../../data/projectData";
import { getData } from "../../utils/apiHelper";
import { safeExpect } from "../../utils/authHelper";


test.describe('Project Page', () => {
  const { newEmail } = getData('UI');

  test.beforeEach(async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to the login page and Login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
    await page.waitForURL('**/projects');
  })

  test('Verify project page displays correctly', async ({ page, baseURL }) => {
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

  test('Verify create new project modal and content on project page', async ({ page, baseURL }) => {
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

    // Verify the Project scale in create new project modal
    await safeExpect('Project scale in create new project modal',
      async () => {
        await expect(await projectsPage.pojectScaleLabel()).toBeVisible();
        await expect(await projectsPage.pojectScaleLabel()).toHaveText('Project scale');
        await expect(await projectsPage.pojectScaletrigger()).toBeVisible();
      },
      errors
    );

    // Verify the Classification category in create new project modal
    await safeExpect('Classification category in create new project modal',
      async () => {
        await expect(await projectsPage.classificationCategoryLabel()).toBeVisible();
        await expect(await projectsPage.classificationCategoryLabel()).toHaveText('Classification category');
        await expect(await projectsPage.classificationCategorytrigger()).toBeVisible();
      },
      errors
    );

    // Verify the Classification method in create new project modal
    await safeExpect('Classification method in create new project modal',
      async () => {
        await expect(await projectsPage.classificationMethodLabel()).toBeVisible();
        await expect(await projectsPage.classificationMethodLabel()).toHaveText('Classification method');
        await expect(await projectsPage.classificationMethodtrigger()).toBeVisible();
      },
      errors
    );

    // Verify the Buttons in create new project modal
    await safeExpect('Buttons in create new project modal',
      async () => {
        await expect(await projectsPage.cancelButton()).toBeVisible();
        await expect(await projectsPage.createButton()).toBeVisible();
      },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  });

  test('Verify methodology dropdown functionality in create new project modal', async ({ page, baseURL }) => {

    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    const methodologytrigger = await projectsPage.methodologytrigger();
    const methodologymenu = await projectsPage.methodologymenu();
    const methodologymenutext = await projectsPage.methodologymenutext();

    await safeExpect('Methodology Menu Text content',
      async () => {
        await methodologytrigger.click();
        await expect(methodologymenu).toBeVisible();
        await expect(await methodologymenutext.first()).toBeVisible()
        const menuTextContents = await methodologymenutext.allTextContents();
        for (let index = 0; index < methodologyOptions.length; index++) {
          const item = methodologyOptions[index];
          await expect(await methodologymenutext.nth(index)).toBeVisible();
          await expect(await methodologymenutext.nth(index)).toHaveText(item);
        }
        await expect(menuTextContents).toHaveLength(methodologyOptions.length)
        await expect(menuTextContents).toEqual(expect.arrayContaining(methodologyOptions));
        await methodologytrigger.click();
        await expect(methodologymenu).not.toBeVisible();
      },
      errors
    );

    await safeExpect('Select different Metholodogies',
      async () => {
        for (let i = 0; i < methodologyOptions.length; i++) {
          const methodologydropdown = await projectsPage.methodologyDropdown();
          const Visiblelistbox = await methodologydropdown.isVisible();

          if (!Visiblelistbox) {
            await methodologytrigger.click();
          }
          const item = methodologyOptions[i];
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

  test('Verify Project scale dropdown functionality in create new project modal', async ({ page, baseURL }) => {

    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    const pojectScaletrigger = await projectsPage.pojectScaletrigger();
    const pojectScalemenu = await projectsPage.pojectScalemenu();
    const pojectScalemenutext = await projectsPage.pojectScalemenutext();

    await safeExpect('Project scale Menu Text content',
      async () => {
        await pojectScaletrigger.click();
        await expect(pojectScalemenu).toBeVisible();
        await expect(await pojectScalemenutext.first()).toBeVisible()
        const menuTextContents = await pojectScalemenutext.allTextContents();
        for (let index = 0; index < projectScaleOptions.length; index++) {
          const item = projectScaleOptions[index];
          await expect(await pojectScalemenutext.nth(index)).toBeVisible();
          await expect(await pojectScalemenutext.nth(index)).toHaveText(item);
        }
        await expect(menuTextContents).toHaveLength(projectScaleOptions.length)
        await expect(menuTextContents).toEqual(expect.arrayContaining(projectScaleOptions));
        await pojectScaletrigger.click();
        await expect(pojectScalemenu).not.toBeVisible();
      },
      errors
    );

    await safeExpect('Select different Project Scale Options',
      async () => {
        for (let i = 0; i < projectScaleOptions.length; i++) {
          const classificationCategoryDropdown = await projectsPage.classificationCategoryDropdown();
          const Visiblelistbox = await classificationCategoryDropdown.isVisible();

          if (!Visiblelistbox) {
            await pojectScaletrigger.click();
          }

          const item = projectScaleOptions[i];
          await expect(await projectsPage.projectScaleselectOption(item)).toBeVisible();
          const selectOption = await projectsPage.projectScaleselectOption(item);
          await selectOption.click();
          await expect(pojectScalemenu).not.toBeVisible();
          await expect(await projectsPage.selectedpojectScale()).toHaveText(item);
        }
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Verify Classification category dropdown functionality in create new project modal', async ({ page, baseURL }) => {

    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    const classificationCategorytrigger = await projectsPage.classificationCategorytrigger();
    const classificationCategorymenu = await projectsPage.classificationCategorymenu();
    const classificationCategorymenutext = await projectsPage.classificationCategorymenutext();
    const classificationCategoryDropdown = await projectsPage.classificationCategoryDropdown();

    await safeExpect('Classification category Text content',
      async () => {
        const Visiblelistbox = await classificationCategoryDropdown.isVisible();

        if (!Visiblelistbox) {
          await classificationCategorytrigger.click();
        }

        await expect(classificationCategorymenu).toBeVisible();
        await expect(await classificationCategorymenutext.first()).toBeVisible()
        const menuTextContents = await classificationCategorymenutext.allTextContents();
        for (let index = 0; index < classificationCategoryOptions.length; index++) {
          const item = classificationCategoryOptions[index];
          await expect(await classificationCategorymenutext.nth(index)).toBeVisible();
          await expect(await classificationCategorymenutext.nth(index)).toHaveText(item);
        }
        await expect(menuTextContents).toHaveLength(classificationCategoryOptions.length)
        await expect(menuTextContents).toEqual(expect.arrayContaining(classificationCategoryOptions));
        await classificationCategorytrigger.click();
        await expect(classificationCategorymenu).not.toBeVisible();
      },
      errors
    );

    await safeExpect('Select different Classification category options',
      async () => {
        for (let i = 0; i < classificationCategoryOptions.length; i++) {
          const Visiblelistbox = await classificationCategoryDropdown.isVisible();

          if (!Visiblelistbox) {
            await classificationCategorytrigger.click();
          }

          const item = classificationCategoryOptions[i];
          await expect(await projectsPage.classificationCategoryselectOption(item)).toBeVisible();
          const selectOption = await projectsPage.classificationCategoryselectOption(item);
          await selectOption.click();
          await expect(await projectsPage.selectedclassificationCategory()).toHaveText(item);
          await expect(await projectsPage.removeCategory()).toBeVisible();

          const removeCategory = await projectsPage.removeCategory();
          await removeCategory.click();
          await expect(await projectsPage.selectedclassificationCategory()).toHaveText('');
        }
      },
      errors
    )

    await safeExpect('Select Multiple Classification category options',
      async () => {
        const Visiblelistbox = await classificationCategoryDropdown.isVisible();

        if (!Visiblelistbox) {
          await classificationCategorytrigger.click();
        }

        for (let i = 0; i < classificationCategoryOptions.length; i++) {
          const item = classificationCategoryOptions[i];
          await expect(await projectsPage.classificationCategoryselectOption(item)).toBeVisible();
          const selectOption = await projectsPage.classificationCategoryselectOption(item);
          await selectOption.click();
          await expect(await projectsPage.selectedclassificationCategory()).toContainText(item);
        }
        await expect(await projectsPage.noOption()).toBeVisible();
        const noOption = await projectsPage.noOption();
        await expect(noOption).toHaveText('No options');
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Verify classification Method dropdown functionality in create new project modal', async ({ page, baseURL }) => {

    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

    // Click on the create project button
    const createProjectButton = await projectsPage.createProjectButton();
    await createProjectButton.click();

    const classificationMethodtrigger = await projectsPage.classificationMethodtrigger();
    const classificationMethodemenu = await projectsPage.classificationMethodemenu();
    const classificationMethodmenutext = await projectsPage.classificationMethodmenutext();
    const classificationMethodDropdown = await projectsPage.classificationMethodDropdown();

    await safeExpect('classification Method Menu Text content',
      async () => {
        await classificationMethodtrigger.click();
        await expect(classificationMethodemenu).toBeVisible();
        await expect(await classificationMethodmenutext.first()).toBeVisible()
        const menuTextContents = await classificationMethodmenutext.allTextContents();
        for (let index = 0; index < classificationMethodOptions.length; index++) {
          const item = classificationMethodOptions[index];
          await expect(await classificationMethodmenutext.nth(index)).toBeVisible();
          await expect(await classificationMethodmenutext.nth(index)).toHaveText(item);
        }
        await expect(menuTextContents).toHaveLength(classificationMethodOptions.length)
        await expect(menuTextContents).toEqual(expect.arrayContaining(classificationMethodOptions));
        await classificationMethodtrigger.click();
        await expect(classificationMethodemenu).not.toBeVisible();
      },
      errors
    );

    await safeExpect('Select different Project Scale Options',
      async () => {
        for (let i = 0; i < classificationMethodOptions.length; i++) {
          const Visiblelistbox = await classificationMethodDropdown.isVisible();

          if (!Visiblelistbox) {
            await classificationMethodtrigger.click();
          }

          const item = classificationMethodOptions[i];
          await expect(await projectsPage.classificationMethodselectOption(item)).toBeVisible();
          const selectOption = await projectsPage.classificationMethodselectOption(item);
          await selectOption.click();
          await expect(classificationMethodemenu).not.toBeVisible();
          await expect(await projectsPage.selectedclassificationMethod()).toHaveText(item);
        }
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Cancel Button functionality in Create New Project Modal', async ({ page, baseURL }) => {

    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

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

        await pojectScaletrigger.click();
        const selectprojectScaleOptions = await projectsPage.projectScaleselectOption(projectScaleOptions[0]);
        await selectprojectScaleOptions.click();
        await expect(await projectsPage.selectedpojectScale()).toHaveText(projectScaleOptions[0]);

        await classificationCategorytrigger.click();
        const selectclassificationCategoryOptions = await projectsPage.classificationCategoryselectOption(classificationCategoryOptions[0]);
        await selectclassificationCategoryOptions.click();
        await expect(await projectsPage.selectedclassificationCategory()).toHaveText(classificationCategoryOptions[0]);
        await classificationCategorytrigger.click();

        await classificationMethodtrigger.click();
        const selectclassificationMethodOptions = await projectsPage.classificationMethodselectOption(classificationMethodOptions[0]);
        await selectclassificationMethodOptions.click();
        await expect(await projectsPage.selectedclassificationMethod()).toHaveText(classificationMethodOptions[0]);
      },
      errors
    );

    await safeExpect('click on cancel and verify the fields in create new project modal',
      async () => {
        const cancel = await projectsPage.cancelButton();
        await cancel.click();

        await createProjectButton.click();
        await expect(await projectsPage.selectedMethodology()).toHaveText('');
        await expect(await projectsPage.selectedpojectScale()).toHaveText('');
        await expect(await projectsPage.selectedclassificationCategory()).toHaveText('');
        await expect(await projectsPage.selectedclassificationMethod()).toHaveText('');
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Create Button in create new project modal, Saves Project and Navigates to Overview', async ({ page, baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

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
        await projectName.fill(project.uiProjectName);
        await expect(projectName).toHaveValue(project.uiProjectName);

        await methodologytrigger.click();
        const selectmethodologyOptions = await projectsPage.methodologyselectOption(methodologyOptions[11]);
        await selectmethodologyOptions.click();
        await expect(await projectsPage.selectedMethodology()).toHaveText(methodologyOptions[11]);

        await pojectScaletrigger.click();
        const selectprojectScaleOptions = await projectsPage.projectScaleselectOption(projectScaleOptions[0]);
        await selectprojectScaleOptions.click();
        await expect(await projectsPage.selectedpojectScale()).toHaveText(projectScaleOptions[0]);

        await classificationCategorytrigger.click();
        const selectclassificationCategoryOptions = await projectsPage.classificationCategoryselectOption(classificationCategoryOptions[0]);
        await selectclassificationCategoryOptions.click();
        await expect(await projectsPage.selectedclassificationCategory()).toHaveText(classificationCategoryOptions[0]);
        await classificationCategorytrigger.click();

        await classificationMethodtrigger.click();
        const selectclassificationMethodOptions = await projectsPage.classificationMethodselectOption(classificationMethodOptions[0]);
        await selectclassificationMethodOptions.click();
        await expect(await projectsPage.selectedclassificationMethod()).toHaveText(classificationMethodOptions[0]);
      },
      errors
    );

    await safeExpect('click on save and verify the project is display',
      async () => {
        const create = await projectsPage.createButton();
        await create.click();
        await page.waitForURL('**/projects/**/overview');
        await expect(await projectsPage.modal()).not.toBeVisible();
        await expect(await projectsPage.overviewProject()).toBeVisible();
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

  test('Verify Project Page After Creating a New Project', async ({ page, baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);

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