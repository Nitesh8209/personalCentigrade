import { test, expect } from "@playwright/test";
import { Frameworks } from "../../../pages/frameworksPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import path from "path";
import { project, methodologyOptions } from "../../data/projectData";
import { saveData } from "../../utils/apiHelper";
import { safeExpect } from "../../utils/authHelper";
import { FRAMEWORK_MENU_ITEMS, FRAMEWORKS } from "../../data/testData";
import { openAddRemoveFrameworksModal, openCreateProjectModal, openProjectOverview } from "../../utils/projectHelpers";

test.describe('Additional frameworks Test cases', () => {
  let page;
  let frameworksPage;
  let projectsPage;

  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-auth-admin.json');
  test.use({ storageState: authStoragePath });

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize browser and login
    const context = await browser.newContext();
    page = await context.newPage();
    frameworksPage = new Frameworks(page);
    projectsPage = new ProjectsPage(page, baseURL);

    await page.goto(baseURL);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Verify that Additional frameworks should be visble in the create proejct modal", async ({ baseURL }) => {
    await openCreateProjectModal(projectsPage)

    await expect(frameworksPage.frameworks).toBeVisible();
    await expect(frameworksPage.frameworkLabel).toBeVisible();
    await expect(frameworksPage.frameworkLabel).toHaveText('Additional frameworks');
    await expect(frameworksPage.frameworkInput).toBeVisible();
    await expect(frameworksPage.frameworkHelperText).toBeVisible();
    await expect(frameworksPage.frameworkHelperText).toHaveText('You can choose to add or remove these frameworks at a later time');
  });

  test('dropdown of framework', async () => {
    if(!(await frameworksPage.dialog.isVisible())){
      await openCreateProjectModal(projectsPage);
    }

    await frameworksPage.frameworkInput.click();

    await expect(frameworksPage.frameworksListbox).toBeVisible({ timeout: 10_000 });

    // Wait until options are rendered
    await expect
      .poll(async () => await frameworksPage.frameworkOptions.count())
      .toBeGreaterThan(0);

    // Validate each framework option
    for (const framework of FRAMEWORKS) {
      await expect(
        frameworksPage.frameworkOptionByName(framework)
      ).toBeVisible();
    }
  })

  test('Verify user can add framework when creating projects', { tag: '@SMOKE' }, async ({ baseURL }) => {
    const errors = [];

    if(!(await frameworksPage.dialog.isVisible())){
      await openCreateProjectModal(projectsPage);
    }

    const methodologytrigger = await projectsPage.methodologytrigger();
    const projectName = await projectsPage.projectName()
    await safeExpect('Fill all fileds',
      async () => {
        await expect(projectName).toBeVisible();
        await projectName.fill(project.frameworkProjectName);
        await expect(projectName).toHaveValue(project.frameworkProjectName);

        await methodologytrigger.click();

        const selectedMethodology = process.env.METHODOLOGY || methodologyOptions[11];

        const selectmethodologyOptions = await projectsPage.methodologyselectOption(selectedMethodology);
        await selectmethodologyOptions.click();
        await expect(await projectsPage.selectedMethodology()).toHaveText(selectedMethodology);

        await frameworksPage.selectMultipleFramwork(FRAMEWORKS);

        await expect(await projectsPage.radioGroup).toBeVisible();
        await projectsPage.enableAutoFillRadio.click();
        await expect(await projectsPage.enableAutoFillInput).toBeChecked();
      },
      errors
    );

    await safeExpect('click on save and verify the project is display',
      async () => {
        const create = await projectsPage.createButton();
        const [response] = await Promise.all([
          page.waitForResponse(resp => resp.url().includes('/project')),
          await create.click()
        ])

        const responseBody = await response.json();
        const projectId = responseBody.id;
        await saveData({ ValidateProjectId: projectId }, "UI");

        await page.waitForURL('**/projects/**/overview');
        await page.waitForLoadState('networkidle');
        if ((await (await projectsPage.modal()).isVisible())) {
          const closeButton = await projectsPage.modalClose();
          await closeButton.click();
        }
        await expect(await projectsPage.overviewProject()).toBeVisible({ timeout: 20000 });
        await expect(await projectsPage.overviewHeader()).toBeVisible();
        await expect(await projectsPage.overviewtitle()).toBeVisible();
        await expect(await projectsPage.overviewtitle()).toHaveText(project.frameworkProjectName);
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })


  test('Verify user can see all framwork on the overview page', async () => {
    const overview = await projectsPage.overviewProject();
    if (!(await overview.isVisible())) {
      await openProjectOverview(projectsPage, project.frameworkProjectName);
    }

    await expect(frameworksPage.frameworkSelect).toBeVisible();
    await expect(frameworksPage.frameworkSelectLabel).toBeVisible();
    await expect(frameworksPage.frameworkSelectLabel).toHaveText('Select framework');
    await expect(frameworksPage.frameworkSelectButton).toBeVisible();

    await frameworksPage.frameworkSelectButton.click();

    await expect(frameworksPage.frameworkSelectMenu).toBeVisible();

    for (const item of FRAMEWORK_MENU_ITEMS) {
      await expect(frameworksPage.menuItemByName(item)).toBeVisible();
    }
  })

  test('Verify Add or remove frameworks to your project Modal', async () => {
    const overview = await projectsPage.overviewProject();
    if (!(await overview.isVisible())) {
      await openProjectOverview(projectsPage, project.frameworkProjectName);
    }

    if (!(await frameworksPage.dialog.isVisible())) {
      await openAddRemoveFrameworksModal(frameworksPage);
    }

    await expect(frameworksPage.dialogHeader).toBeVisible();
    await expect(frameworksPage.dialogHeader).toHaveText('Add or remove frameworks to your project');
    await expect(frameworksPage.dialogContent).toBeVisible();
    await expect(frameworksPage.dialogContentPera).toBeVisible();
    await expect(frameworksPage.dialogContentPera).toHaveText('Select the frameworks to add or remove those fields to your project');

    for (const frameworkName of FRAMEWORKS) {
      const checkbox = frameworksPage.frameworkCheckboxByName(frameworkName);
      const label = frameworksPage.frameworkLabelByName(frameworkName);

      await expect(label).toHaveText(frameworkName);
      await expect(checkbox).toBeVisible();
      await expect(checkbox).toBeChecked();

      await label.click();
      await expect(checkbox).not.toBeChecked();

      await label.click();
      await expect(checkbox).toBeChecked();
    }

    await expect(frameworksPage.saveButton).toBeVisible();
    await expect(frameworksPage.cancelButton).toBeVisible();

    await frameworksPage.cancelButton.click();
    await expect(frameworksPage.dialog).not.toBeVisible();
  })

  test('Verfiy that remove Framework modal content', async () => {
    const overview = await projectsPage.overviewProject();
    if (!(await overview.isVisible())) {
      await openProjectOverview(projectsPage, project.frameworkProjectName);
    }

    const frameworkToRemove = 'Carbon credit data framework';

    await openAddRemoveFrameworksModal(frameworksPage);

    // ---- Ensure framework is initially selected ----
    const frameworkCheckbox =
      frameworksPage.frameworkCheckboxByName(frameworkToRemove);
    const frameworkLabel =
      frameworksPage.frameworkLabelByName(frameworkToRemove);
    await expect(frameworkCheckbox).toBeChecked();
    await frameworkLabel.click();
    await expect(frameworkCheckbox).not.toBeChecked();

    // ---- Save changes ----
    await frameworksPage.saveButton.click();

    // Removal Modal
    await expect(frameworksPage.dialog).toBeVisible();
    await expect(frameworksPage.dialogHeader).toBeVisible();
    await expect(frameworksPage.dialogHeader).toHaveText('Remove frameworks');
    await expect(frameworksPage.dialogContent).toBeVisible();
    await expect(frameworksPage.confirmRemovalHeading).toBeVisible();
    await expect(frameworksPage.confirmRemovalHeading).toHaveText('Are you sure you want to remove the following frameworks?');
    await expect(frameworksPage.confirmRemovalBadgeList).toBeVisible();
    await expect(frameworksPage.confirmRemovalBadgeList).toHaveText(frameworkToRemove);
    await expect(frameworksPage.confirmRemovalFristPera).toBeVisible();
    await expect(frameworksPage.confirmRemovalSecondPera).toBeVisible();

    await expect(frameworksPage.backButton).toBeVisible();
    await expect(frameworksPage.confirmButton).toBeVisible();

    await frameworksPage.backButton.click();

    await expect(frameworkCheckbox).not.toBeChecked();
    await expect(frameworksPage.dialogHeader).toBeVisible();
    await expect(frameworksPage.dialogHeader).toHaveText('Add or remove frameworks to your project');

    await frameworksPage.saveButton.click();

    await expect(frameworksPage.dialog).toBeVisible();
    await expect(frameworksPage.dialogHeader).toBeVisible();
    await expect(frameworksPage.dialogHeader).toHaveText('Remove frameworks');

    await frameworksPage.backButton.click();
    await frameworksPage.cancelButton.click();
    await expect(frameworksPage.dialog).not.toBeVisible();
  })

  test('Verify user can remove framework', async () => {
    const overview = await projectsPage.overviewProject();
    if (!(await overview.isVisible())) {
      await openProjectOverview(projectsPage, project.frameworkProjectName);
    }
    
    const frameworkToRemove = 'Carbon credit data framework';
    const frameworkMenu = 'RMI ccdf';

    await openAddRemoveFrameworksModal(frameworksPage);
    
    // ---- Ensure framework is initially selected ----
    const frameworkCheckbox = frameworksPage.frameworkCheckboxByName(frameworkToRemove);
    const frameworkLabel = frameworksPage.frameworkLabelByName(frameworkToRemove);
    await expect(frameworkCheckbox).toBeChecked();

    // ---- Remove framework ----
    await frameworkLabel.click();
    await expect(frameworkCheckbox).not.toBeChecked();

    // ---- Save changes ----
    await frameworksPage.saveButton.click();

    await expect(frameworksPage.dialog).toBeVisible();
    await expect(frameworksPage.dialogHeader).toBeVisible();
    await expect(frameworksPage.dialogHeader).toHaveText('Remove frameworks');

    await frameworksPage.confirmButton.click();

    // ---- Reopen modal ----
    await frameworksPage.frameworkSelectButton.click();

    await expect(frameworksPage.menuItemByName(frameworkMenu)).not.toBeVisible();
    await frameworksPage.menuItemByName('Add or remove frameworks').click();

    // ---- Verify framework is still removed ----
    await expect(frameworksPage.frameworkCheckboxByName(frameworkToRemove)).not.toBeChecked();

  });

  test('Verify user can add framework', async () => {
    const overview = await projectsPage.overviewProject();
    if (!(await overview.isVisible())) {
      await openProjectOverview(projectsPage, project.frameworkProjectName);
    }

    const frameworkToAdd = 'Carbon credit data framework';
    const frameworkMenu = 'RMI ccdf';

    if (!(await frameworksPage.dialog.isVisible())) {
      await openAddRemoveFrameworksModal(frameworksPage);
    }

    const frameworkCheckbox = frameworksPage.frameworkCheckboxByName(frameworkToAdd);
    const frameworkLabel = frameworksPage.frameworkLabelByName(frameworkToAdd);

    await expect(frameworkCheckbox).not.toBeChecked();

    // ---- Add framework ----
    await frameworkLabel.click();
    await expect(frameworkCheckbox).toBeChecked();

    // ---- Save changes ----
    await frameworksPage.saveButton.click();

    // ---- Reopen framework dropdown ----
    await frameworksPage.frameworkSelectButton.click();
    await expect(frameworksPage.frameworkSelectMenu).toBeVisible();

    // ---- Verify framework appears in the menu again ----
    await expect(
      frameworksPage.menuItemByName(frameworkMenu)
    ).toBeVisible();

    // ---- Reopen Add/Remove modal ----
    await frameworksPage.menuItemByName('Add or remove frameworks').click();

    // ---- Verify framework remains selected ----
    await expect(
      frameworksPage.frameworkCheckboxByName(frameworkToAdd)
    ).toBeChecked();
  });


})