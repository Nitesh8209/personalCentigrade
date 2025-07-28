import { test, expect } from "@playwright/test";
import { safeExpect } from "../../utils/authHelper";
import path from "path";
import { LoginPage } from '../../../pages/loginPage';
import { ProjectsPage } from '../../../pages/projectsPage';
import { project } from "../../data/projectData";
import { FieldHandler } from "../../utils/fieldValidation";
import { EntitiesInvolvedPage } from "../../../pages/entitiesInvolvedPage";

test.describe("Entities involved in a project", () => {

  let page;
  let fieldHandler;
  let entitiesInvolved;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-auth-admin.json');
  test.use({ storageState: authStoragePath });

  test.beforeAll(async ({ browser, baseURL }) => {

    // Initialize browser context and page objects
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);
    fieldHandler = new FieldHandler(page);
    entitiesInvolved = new EntitiesInvolvedPage(page)

    // Perform login and navigate to the project
    await loginPage.navigate();
    await loginPage.accecptAll();
    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validat project title
    const projectTitle = await projectsPage.overviewtitle();
    await expect(projectTitle).toBeVisible({ timeout: 20000});
    await expect(projectTitle).toHaveText(project.uiProjectName);

    if ((await (await page.getByRole('button', { name: 'Got it' })).isVisible())) {
      const gotItButton = await page.getByRole('button', { name: 'Got it' });
      await gotItButton.click();
    }
    const Tier0 = await page.locator('.menu-item-label').getByText('Tier 0 - Provenance');
    await expect(Tier0).toBeVisible();
    await Tier0.click();

    const navigateEntitiesInvolved = await entitiesInvolved.navigation();
    await expect(navigateEntitiesInvolved).toBeVisible();
    await navigateEntitiesInvolved.click();
  });

  test("should display the breadcrumbs in the Entities section", async () => {
    const errors = [];

    await safeExpect(`Breadcrumbs should be visible`, async () => {
      await expect(await fieldHandler.breadcrumbs()).toHaveCount(3);
      const separators = await fieldHandler.separators()
      const allSeparators = await separators.all();
      await expect(separators).toHaveCount(2);
      for (const separator of allSeparators) {
        await expect(separator).toBeVisible();
      }
    }, errors);

    await safeExpect(`All Projects Breadcurmp should be visible`, async () => {
      await fieldHandler.validateBreadcrumb(0, '/projects', "Projects");
    }, errors);

    await safeExpect(`Project Breadcurmp should be visible`, async () => {
      await fieldHandler.validateBreadcrumb(1, '', project.uiProjectName);
    }, errors);

    await safeExpect(`Overview Breadcurmp should be visible`, async () => {
      await fieldHandler.validateBreadcrumb(2, '', "Entities involved");
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\  n${errors.join('\n')}`);
    }

  });

  test("Entities involved Header", async () => {
    const errors = [];
    await safeExpect(`Entities involved Header should be visible`, async () => {
      await expect(await entitiesInvolved.entityHeader()).toBeVisible();
      await expect(await entitiesInvolved.entityHeaderTitle()).toBeVisible();
      await expect(await entitiesInvolved.entityHeaderTitle()).toHaveText('Entities involved');
    }, errors);

    await safeExpect(`Entities involved Description should be visible`, async () => {
      await expect(await entitiesInvolved.entityHeaderDescription()).toBeVisible();
      await expect(await entitiesInvolved.entityHeaderDescription()).toHaveText('The people and organizations involved with the project');
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  test("should display the Add Entities section", async () => {
    const errors = [];
    await safeExpect(`Add Entities section should be visible`, async () => {
      await expect(await entitiesInvolved.addEntities()).toBeVisible();
      await expect(await entitiesInvolved.addEntitiesParagraph()).toBeVisible();
      await expect(await entitiesInvolved.addEntitiesParagraph()).toHaveText('Entities could include GIS Advisory; Feasibility Study; Technical document service; Administrative Service; Biodiversity Advisory; Political Advocacy; MRV Data provider;');
      await expect(await entitiesInvolved.addEntitiesButton()).toBeVisible();
      await expect(await entitiesInvolved.addEntitiesButton()).toHaveText('+ Add entity');
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

  test("should display the Entities List", async () => {
    const errors = [];
    await safeExpect(`Entities List should be visible`, async () => {
      await expect(await entitiesInvolved.entityList()).toBeVisible();
      await expect(await entitiesInvolved.projectRoleHeader()).toBeVisible();
      await expect(await entitiesInvolved.projectRoleHeader()).toHaveText('Project role');
      await expect(await entitiesInvolved.organizationHeader()).toBeVisible();
      await expect(await entitiesInvolved.organizationHeader()).toHaveText('Organization');
      await expect(await entitiesInvolved.noRow()).toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

  test("Add Entity modal", async () => {
    const errors = [];
    const addEntities = await entitiesInvolved.addEntitiesButton();
    await addEntities.click();

    await safeExpect(`Add Entity modal should be visible`, async () => {
      await expect(await entitiesInvolved.addEntityModal()).toBeVisible();
      await expect(await entitiesInvolved.addEntityModalTitle()).toBeVisible();
      await expect(await entitiesInvolved.addEntityModalTitle()).toHaveText('Add Entity');
    }, errors);

    await safeExpect(`Add Entity modal Role select field should be visible`, async () => {
      await expect(await entitiesInvolved.addEntityRole()).toBeVisible();
      await expect(await entitiesInvolved.addEntityRoleSelect()).toBeVisible();
      await expect(await entitiesInvolved.addEntityRole()).toHaveText('Role');
    }, errors);

    await safeExpect(`Add Entity modal organization name field should be visible`, async () => {
      await expect(await entitiesInvolved.addEntityOrganizationLabel()).toBeVisible();
      await expect(await entitiesInvolved.addEntityOrganizationLabel()).toHaveText('Organization name');
      await expect(await entitiesInvolved.addEntityOrganizationInput()).toBeVisible();
    }, errors);

    await safeExpect(`Add Entity modal button should be visible`, async () => {
      await expect(await entitiesInvolved.saveButton()).toBeVisible();
      await expect(await entitiesInvolved.cancelButton()).toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test("Add entity Role type select field", async () => {
    const errors = [];

    if (!(await (await entitiesInvolved.addEntityModal()).isVisible())) {
      const addEntities = await entitiesInvolved.addEntitiesButton();
      await addEntities.click();
    }

    const expectedRoles = [
      'Auditor',
      'Consultant',
      'Insurance Agency',
      'Investor',
      'Landowner',
      'Legal Compliance Team',
      'Monitoring Reporting Data Team',
      'Project Developer Or Implementation Team',
      'Project Owner Or Origination Team',
      'Project Proponent',
      'Rating Agency',
      'Registry',
      'Science Technical Team',
      'Sponsor',
      'Validation Or Verification Body',
      'Other'
    ];

    for (const role of expectedRoles) {
      const options = await entitiesInvolved.selectRole();
      const option = options.getByText(role);
      await safeExpect(`Role option '${role}' should be visible`, async () => {
        const addEntityRoleSelect = await entitiesInvolved.addEntityRoleSelect();
        await addEntityRoleSelect.click();
        await expect(option).toBeVisible();
        await option.click();
        await expect(await entitiesInvolved.addEntityRoleSelect()).toHaveText(role);
      }, errors);
    }



    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test("organization name should be visible in the autocomplete dropdown", async () => {
    const errors = [];

    if (!(await (await entitiesInvolved.addEntityModal()).isVisible())) {
      const addEntities = await entitiesInvolved.addEntitiesButton();
      await addEntities.click();
    }

    await safeExpect(`Organization name input should be visible`, async () => {
      const addEntityOrganizationInput = await entitiesInvolved.addEntityOrganizationInput();
      await expect(addEntityOrganizationInput).toBeVisible();
      await addEntityOrganizationInput.click();
      await addEntityOrganizationInput.fill('automationProject2');
      await expect(await entitiesInvolved.selectOrganizationInput()).toBeVisible();
      const organizationOption = await entitiesInvolved.selectOrganizationInput();
      await expect(organizationOption).toBeVisible();
      await organizationOption.click();
    }, errors);

    await safeExpect('cancel the modal', async () => {
      const cancelButton = await entitiesInvolved.cancelButton();
      await expect(cancelButton).toBeVisible();
      await cancelButton.click();
      await expect(await entitiesInvolved.addEntityModal()).not.toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test("should save the entity", async () => {
    const errors = [];
    if (!(await (await entitiesInvolved.addEntityModal()).isVisible())) {
      const addEntities = await entitiesInvolved.addEntitiesButton();
      await addEntities.click();
    }

    await safeExpect('Role should be selected', async () => {
      const addEntityRoleSelect = await entitiesInvolved.addEntityRoleSelect();
      await expect(addEntityRoleSelect).toBeVisible();
      await addEntityRoleSelect.click();
      const roleOptions = await entitiesInvolved.selectRole();
      const roleOption = roleOptions.getByText('Auditor');
      await expect(roleOption).toBeVisible();
      await roleOption.click();
    }, errors);

    await safeExpect('Organization name should be selected', async () => {
      const addEntityOrganizationInput = await entitiesInvolved.addEntityOrganizationInput();
      await expect(addEntityOrganizationInput).toBeVisible();
      await addEntityOrganizationInput.click();
      await addEntityOrganizationInput.fill('automationProject2');
      const organizationOption = await entitiesInvolved.selectOrganizationInput();
      await expect(organizationOption).toBeVisible();
      await organizationOption.click();
    }, errors);

    // Click the Save button
    await safeExpect(`Save button should be visible`, async () => {
      const saveButton = await entitiesInvolved.saveButton();
      await expect(saveButton).toBeVisible();
      await saveButton.click();
    }, errors);

    await safeExpect('should not be visible the entity', async () => {
      const successMessagediv = await entitiesInvolved.successMessagediv();
      await expect(successMessagediv).toBeVisible();
      await expect(successMessagediv).toHaveText('Entity has been added successfully')
    },errors) 

    // Validate that the entity is added to the list
    await safeExpect(`New entity should be added to the list`, async () => {
      const entityList = await entitiesInvolved.rowGroup();
      await expect(entityList).toBeVisible();
      await expect(await entitiesInvolved.rowProjectRole('Auditor')).toBeVisible();
      await expect(await entitiesInvolved.rowOrganization('automationProject2')).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.editButton()).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.deleteButton()).toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  test("should visible edit entity modal", async () => {
    const errors = [];

    // Validate that the entity is added to the list
    await safeExpect(`click on the edit button`, async () => {
      const entityList = await entitiesInvolved.rowGroup();
      await expect(entityList).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.editButton()).toBeVisible();
      const editButton = await entitiesInvolved.editButton();
      await editButton.click();
    }, errors);

    await safeExpect(`Edit Entity modal`, async () => {
      await expect(await entitiesInvolved.modal()).toBeVisible();
      await expect(await entitiesInvolved.modalHeading()).toBeVisible();
      await expect(await entitiesInvolved.modalHeading()).toHaveText('Edit Entity');
      await expect(await entitiesInvolved.addEntityRole()).toBeVisible();
      await expect(await entitiesInvolved.addEntityRoleSelect()).toBeVisible();
      await expect(await entitiesInvolved.addEntityRole()).toHaveText('Role');
      await expect(await entitiesInvolved.addEntityOrganizationLabel()).toBeVisible();
      await expect(await entitiesInvolved.addEntityOrganizationLabel()).toHaveText('Organization name');
      await expect(await entitiesInvolved.addEntityRoleSelect()).toHaveText('Auditor');
      await expect(await entitiesInvolved.addEntityOrganizationInput()).toBeVisible();
      await expect(await entitiesInvolved.addEntityOrganizationInput()).toHaveValue('automationProject2');
      await expect(await entitiesInvolved.cancelButton()).toBeVisible();
      const cancelButotn = await entitiesInvolved.cancelButton();
      await cancelButotn.click();
    }, errors)

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  test("Updatet the Entity", async () => {
    const errors = [];

    await safeExpect(`click on the edit button`, async () => {
      const entityList = await entitiesInvolved.rowGroup();
      await expect(entityList).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.editButton()).toBeVisible();
      const editButton = await entitiesInvolved.editButton();
      await editButton.click();
    }, errors);

    await safeExpect('Update the Role', async () => {
      const addEntityRoleSelect = await entitiesInvolved.addEntityRoleSelect();
      await expect(addEntityRoleSelect).toBeVisible();
      await addEntityRoleSelect.click();
      const roleOptions = await entitiesInvolved.selectRole();
      const roleOption = roleOptions.getByText('Consultant');
      await expect(roleOption).toBeVisible();
      await roleOption.click();
    }, errors);

    await safeExpect('Update the Organization name', async () => {
      const addEntityOrganizationInput = await entitiesInvolved.addEntityOrganizationInput();
      await expect(addEntityOrganizationInput).toBeVisible();
      await addEntityOrganizationInput.click();
      await addEntityOrganizationInput.fill('automationProject1');
      const organizationOption = await entitiesInvolved.selectOrganizationInput();
      await expect(organizationOption).toBeVisible();
      await organizationOption.click();
    }, errors);

    // // Click the Save button
    await safeExpect(`Save button should be visible`, async () => {
      const saveButton = await entitiesInvolved.saveButton();
      await expect(saveButton).toBeVisible();
      await saveButton.click();
    }, errors);

    await safeExpect('should not be visible the entity', async () => {
      const successMessagediv = await entitiesInvolved.successMessagediv();
      await expect(successMessagediv).toBeVisible();
      await expect(successMessagediv).toHaveText('Entity has been added successfully')
    },errors) 

    // Validate that the entity is added to the list
    await safeExpect(`New entity should be added to the list`, async () => {
      const entityList = await entitiesInvolved.rowGroup();
      await expect(entityList).toBeVisible();
      await expect(await entitiesInvolved.rowProjectRole('Consultant')).toBeVisible();
      await expect(await entitiesInvolved.rowOrganization('automationProject1')).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.editButton()).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.deleteButton()).toBeVisible();
    }, errors);


    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Delete entity Modal', async () => {
    const errors = [];

    await safeExpect(`click on the edit button`, async () => {
      const entityList = await entitiesInvolved.rowGroup();
      await expect(entityList).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.deleteButton()).toBeVisible();
      const deleteButton = await entitiesInvolved.deleteButton();
      await deleteButton.click();
    }, errors);

    await safeExpect(`delete entity Heading`, async () => {
      await expect(await entitiesInvolved.modal()).toBeVisible();
      await expect(await entitiesInvolved.modalHeading()).toBeVisible();
      await expect(await entitiesInvolved.modalHeading()).toHaveText('Delete entity');
    }, errors);

    await safeExpect(`delete entity Content`, async () => {
      await expect(await entitiesInvolved.modalContent()).toBeVisible();
      await expect(await entitiesInvolved.modalContent()).toHaveText('Are you sure you want to remove "automationProject1" from the project? You cannot undo this action.');
    }, errors);

    await safeExpect(`cancel and delete Button`, async () => {
      await expect(await entitiesInvolved.cancelButton()).toBeVisible();
      await expect(await entitiesInvolved.modalDeleteButton()).toBeVisible();
      const cancelButotn = await entitiesInvolved.cancelButton();
      await cancelButotn.click();
      await expect(await entitiesInvolved.modal()).not.toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Delete entity', async () => {
    const errors = [];

    await safeExpect(`click on the edit button`, async () => {
      const entityList = await entitiesInvolved.rowGroup();
      await expect(entityList).toBeVisible();
      await entityList.hover();
      await expect(await entitiesInvolved.deleteButton()).toBeVisible();
      const deleteButton = await entitiesInvolved.deleteButton();
      await deleteButton.click();
    }, errors);

    await safeExpect(`cancel and delete Button`, async () => {
      await expect(await entitiesInvolved.modalDeleteButton()).toBeVisible();
      const modalDeleteButton = await entitiesInvolved.modalDeleteButton();
      await modalDeleteButton.click();
    }, errors);

    await safeExpect('should not be visible the entity', async () => {
      const entityList = await entitiesInvolved.rowGroup();
      await expect(entityList).not.toBeVisible();
    },errors)

    await safeExpect('should not be visible the entity', async () => {
      const successMessagediv = await entitiesInvolved.successMessagediv();
      await expect(successMessagediv).toBeVisible();
      await expect(successMessagediv).toHaveText('Entity has been deleted successfully')
    },errors) 


    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

});