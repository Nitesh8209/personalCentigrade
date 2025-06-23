import { expect, test } from "@playwright/test";
import { DataRoom } from "../../../pages/dataRoomFormPage";
import { project } from "../../data/projectData";
import { safeExpect } from "../../utils/authHelper";
import { FieldHandler } from "../../utils/fieldValidation";
import { ProjectsPage } from "../../../pages/projectsPage";
import { LoginPage } from "../../../pages/loginPage";
import path from "path";
import { DataRoomTestdata } from "../../data/testData";

test.describe("test for data Room for invite", { tag: ['@UI', '@SMOKE'] }, () => {
  const authStoragePath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "project-Publish-auth.json"
  );
  test.use({ storageState: authStoragePath });

  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    const dataRoomPage = new DataRoom(page);
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to the login page and perform login
    await loginPage.navigate();
    await page.waitForURL("**/projects");

    await projectsPage.viewProject();
    await page.waitForURL(`**/overview`);

    // Validate project title
    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);

    const dataRoomNavigate = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoomNavigate).toBeVisible();
    await dataRoomNavigate.click();
  });

  test('User can add data rooms', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];
    const modal = await dataRoomPage.modal();

    if(!(await modal.isVisible())){
    const createButton = await dataRoomPage.createButton();
    await createButton.click();
    }

    await safeExpect(
      "create Data Room",
      async () => {
        const input = await dataRoomPage.dataRoomnameInput();
        await expect(input).toBeVisible();
        await input.fill(DataRoomTestdata.dataRoomName);
        const create = await dataRoomPage.modalCreateButton();
        await create.click();
      },
      errors
    );

    await safeExpect(
      "successfully created message shown",
      async () => {
        await expect(await dataRoomPage.successMessagediv()).toBeVisible();
        await expect(await dataRoomPage.successMessagediv()).toHaveText('Data room has been created successfully');
        const closeButton = await dataRoomPage.closeToast();
        await closeButton.click();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Invite Access Modal for visitor access', async () => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if (!(await (await dataRoomPage.documentsTabButton()).isVisible())) {
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();
    }

    const accessButton = await dataRoomPage.accessTabButton();
    await accessButton.click();

    const invite = await dataRoomPage.InviteButton();
    await invite.click();

    await safeExpect(
      "Modal Header",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText('Invite to data room');
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Modal content",
      async () => {
        await expect(await dataRoomPage.inviteModalDiscription()).toBeVisible();
        await expect(await dataRoomPage.inviteModalDiscription()).toHaveText('Add buyers to your data room by entering their emails. You can also include a personalized message in the invitation email.');

        await expect(await dataRoomPage.inviteModalEmail()).toBeVisible();
        await expect(await dataRoomPage.inviteModalEmailLabel()).toBeVisible();
        await expect(await dataRoomPage.inviteModalEmailLabel()).toHaveText('Email');
        await expect(await dataRoomPage.inviteModalEmailinput()).toBeVisible();
        await expect(await dataRoomPage.inviteModalMessage()).toBeVisible();
        await expect(await dataRoomPage.inviteModalMessageLabel()).toBeVisible();
        await expect(await dataRoomPage.inviteModalMessageLabel()).toHaveText('Add a message');
        await expect(await dataRoomPage.inviteButtonModal()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Modal buttons",
      async () => {
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.inviteButtonModal()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Invite user for visitor access', async () => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if (!(await (await dataRoomPage.modal()).isVisible())) {
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();

      const accessButton = await dataRoomPage.accessTabButton();
      await accessButton.click();

      const invite = await dataRoomPage.InviteButton();
      await invite.click();
    }

    await safeExpect(
      "invite User",
      async () => {
        const inputEmail = await dataRoomPage.inviteModalEmailinput();
        await inputEmail.fill(DataRoomTestdata.email);

        const inputMessage = await dataRoomPage.inviteModalMessageinput();
        await inputMessage.fill(DataRoomTestdata.message);

        const invite = await dataRoomPage.inviteButtonModal();
        await invite.click();
      },
      errors
    );

    await safeExpect(
      "message reciedved success",
      async () => {
        const message = await dataRoomPage.successMessagediv();
        await expect(message).toBeVisible();
        await expect(message).toHaveText('Your invitation was sent!');
        const closeButton = await dataRoomPage.closeToast();
        await closeButton.click();
      },
      errors
    );

    await safeExpect(
      "visitors with access row",
      async () => {
        await expect(await dataRoomPage.fileRow()).toBeVisible();
        await expect(await dataRoomPage.accessNameEmail()).toBeVisible();
        await expect(await dataRoomPage.accessName()).toBeVisible();
        await expect(await dataRoomPage.accessName()).toHaveText(DataRoomTestdata.name);
        await expect(await dataRoomPage.accessEmail()).toHaveText(DataRoomTestdata.email);

        await expect(await dataRoomPage.accessOrgName()).toBeVisible();
        await expect(await dataRoomPage.accessOrgName()).toHaveText(DataRoomTestdata.projectName);

        await expect(await dataRoomPage.accessStatus()).toBeVisible();
        await expect(await dataRoomPage.accessStatus()).toHaveText('Invited');

        await expect(await dataRoomPage.accessDate()).toBeVisible();
        await expect(await dataRoomPage.accessAction()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Remove access Invited user modal for visitor access', async () => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if (!(await (await dataRoomPage.documentsTabButton()).isVisible())) {
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();
    }

    const accessButton = await dataRoomPage.accessTabButton();
    await accessButton.click();

    await safeExpect(
      "Delete invited User",
      async () => {
        const accessRow = await dataRoomPage.fileRow();
        await accessRow.hover();
        const accessDelete = await dataRoomPage.accessDelete();
        await expect(accessDelete).toBeVisible();
        await accessDelete.click();
      },
      errors
    );

    await safeExpect(
      "Remove access modal",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText('Remove access');
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
        await expect(await dataRoomPage.modalContent()).toBeVisible();

        await expect(await dataRoomPage.removeAccessModalfirstPera()).toBeVisible();
        await expect(await dataRoomPage.removeAccessModalfirstPera()).toHaveText('Are you sure you want to remove Nitesh123 Agarwal from the data room "Automation Test data"?');
        await expect(await dataRoomPage.removeAccessModalSecondPera()).toBeVisible();
        await expect(await dataRoomPage.removeAccessModalSecondPera()).toHaveText('You can choose to re-invite Nitesh123 Agarwal to this project later');
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalRemoveButton()).toBeVisible();

        const cancel = await dataRoomPage.modalCancelButton()
        await cancel.click();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Delete Invited user for visitor access', async () => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if (!(await (await dataRoomPage.documentsTabButton()).isVisible())) {
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();

      const accessButton = await dataRoomPage.accessTabButton();
      await accessButton.click();
    }

    await safeExpect(
      "Delete invited User",
      async () => {
        const accessRow = await dataRoomPage.fileRow();
        await accessRow.hover();
        const accessDelete = await dataRoomPage.accessDelete();
        await expect(accessDelete).toBeVisible();
        await accessDelete.click();
      },
      errors
    );

    await safeExpect(
      "Delete User",
      async () => {
        const remove = await dataRoomPage.modalRemoveButton();
        await expect(remove).toBeVisible();

        await remove.click();
      },
      errors
    );

    await safeExpect(
      "message reciedved success",
      async () => {
        const message = await dataRoomPage.successMessagediv();
        await expect(message).toBeVisible();
        await expect(message).toHaveText('Data room member removed successfully');
        const closeButton = await dataRoomPage.closeToast();
        await closeButton.click();
        await page.waitForTimeout(10000);
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Delete Data room', async () => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    const dataRoom = await dataRoomPage.bodyContent();
    if (!(await dataRoom.isVisible())) {
      const dataRoomNavigate = await dataRoomPage.dataRoomNavigation();
      await expect(dataRoomNavigate).toBeVisible();
      await dataRoomNavigate.click();
    }
    await dataRoom.hover();

    const button = await dataRoomPage.bodyContentActionButton();
    await expect(button).toBeVisible();
    await button.click();

    await safeExpect(
      "Delete Data room",
      async () => {
        const deleteDataRoom = await dataRoomPage.deleteButton();
        await expect(deleteDataRoom).toBeVisible();
        await deleteDataRoom.click();
      },
      errors
    );

    await safeExpect(
      "Delete Data room modal",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText('Delete data room');
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
        await expect(await dataRoomPage.modalContent()).toBeVisible();
        await expect(await dataRoomPage.deleteDataRoomModalfirstPera()).toBeVisible();
        await expect(await dataRoomPage.deleteDataRoomModalfirstPera()).toHaveText(`Are you sure you want to delete the data room \"${DataRoomTestdata.dataRoomName}\"? All invited users will lose access to the private files shared in this data room.`);
        await expect(await dataRoomPage.deleteDataRoomModalSecondPera()).toBeVisible();
        await expect(await dataRoomPage.deleteDataRoomModalSecondPera()).toHaveText('This action cannot be undone.');
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalDeleteButton()).toBeVisible();
      },
      errors
    );

    await safeExpect('Delete Data room', async () => {
      const deleteButton = await dataRoomPage.modalDeleteButton();
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      await expect(await dataRoomPage.successMessagediv()).toBeVisible();
      await expect(await dataRoomPage.successMessagediv()).toHaveText('Data room deleted successfully');
      const closeButton = await dataRoomPage.closeToast();
      await closeButton.click();
    }, errors)

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

});

test.describe('UnPublish Project', { tag: ['@UI', '@SMOKE'] }, () => {
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
