import test, { expect } from "@playwright/test";
import { DataRoom } from "../../../pages/dataRoomFormPage";
import { project } from "../../data/projectData";
import { safeExpect } from "../../utils/authHelper";
import { FieldHandler } from "../../utils/fieldValidation";
import { ProjectsPage } from "../../../pages/projectsPage";
import { LoginPage } from "../../../pages/loginPage";
import path from "path";
import { DataRoomTestdata } from "../../data/testData";

test.describe("test for data Room ",  { tag: "@UI" }, () => {
  const authStoragePath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "project-auth-admin.json"
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

    await projectsPage.viewProjectByName(project.uiProjectName);
    await page.waitForURL(`**/overview`);

    // Validate project title
    const projectTitle = await projectsPage.projectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);

    const dataRoomNavigate = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoomNavigate).toBeVisible();
    await dataRoomNavigate.click();
  });


  test("verify empty table of data Room", async () => {
    const dataRoomPage = new DataRoom(page);
    const fieldValidate = new FieldHandler(page);
    const errors = [];

    await safeExpect(
      "Verify Breadcrumps",
      async () => {
        await fieldValidate.validateBreadcrumb(0, "/projects", "Projects");
        await fieldValidate.validateBreadcrumb(
          1,
          expect.stringContaining("/projects/"),
          project.uiProjectName
        );
        await fieldValidate.validateBreadcrumb(
          2,
          expect.stringContaining("/data-rooms"),
          "Data rooms"
        );
      },
      errors
    );

    await safeExpect(
      "Verify Heading",
      async () => {
        await expect(await dataRoomPage.heading()).toBeVisible();
        await expect(await dataRoomPage.heading()).toHaveText("Data rooms");
        await expect(await dataRoomPage.headingDiscription()).toBeVisible();
        await expect(await dataRoomPage.headingDiscription()).toHaveText(
          "Securely share private project files"
        );
      },
      errors
    );

    await safeExpect(
      "Verify Table Heading",
      async () => {
        await expect(await dataRoomPage.dataRoomTable()).toBeVisible();
        await expect(await dataRoomPage.tableHeader()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderName()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderName()).toHaveText("Name");
        await expect(await dataRoomPage.tableHeaderFiles()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderFiles()).toHaveText("Files");
        await expect(await dataRoomPage.tableHeaderPeople()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderPeople()).toHaveText(
          "People with access"
        );
      },
      errors
    );

    await safeExpect(
      "Verify Button and No content",
      async () => {
        await expect(await dataRoomPage.createButton()).toBeVisible();
        await expect(await dataRoomPage.tableNoResult()).toBeVisible();
        await expect(await dataRoomPage.tableNoResult()).toHaveText(
          "You have not created any data rooms yet"
        );
        await expect(await dataRoomPage.createDataRoomButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

  test("create data room modal open by create button", async() => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    const createButton = await dataRoomPage.createButton();
    await createButton.click();

    await safeExpect(
      "Verify modal and Heading",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText("Create data room");
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Verify modal content",
      async () => {
        await expect(await dataRoomPage.modalContent()).toBeVisible();
        await expect(await dataRoomPage.dataRoomnameLabel()).toBeVisible();
        await expect(await dataRoomPage.dataRoomnameLabel()).toHaveText("Data room name");
        await expect(await dataRoomPage.dataRoomnameInput()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Verify cancel and create button",
      async () => {
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalCreateButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test("create data room modal open by create data room button", async() => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];
    const modal = await dataRoomPage.modal();
    
    if((await modal.isVisible())){
      const cancelButton = await dataRoomPage.modalCancelButton();
      await cancelButton.click();
    }

    const createDataRoomButton = await dataRoomPage.createDataRoomButton();
    await createDataRoomButton.click();

    await safeExpect(
      "Verify modal and Heading",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText("Create data room");
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Verify modal content",
      async () => {
        await expect(await dataRoomPage.modalContent()).toBeVisible();
        await expect(await dataRoomPage.dataRoomnameLabel()).toBeVisible();
        await expect(await dataRoomPage.dataRoomnameLabel()).toHaveText("Data room name");
        await expect(await dataRoomPage.dataRoomnameInput()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Verify cancel and create button",
      async () => {
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalCreateButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

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

  test('verify data room page after creating data room', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];
    

    await safeExpect(
      "No content should not be visible",
      async () => {
        await expect(await dataRoomPage.createButton()).toBeVisible();
        await expect(await dataRoomPage.tableNoResult()).not.toBeVisible();
        await expect(await dataRoomPage.createDataRoomButton()).not.toBeVisible();
      },
      errors
    );

    await safeExpect(
      "verify create button visible",
      async () => {
        await expect(await dataRoomPage.createButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Verify body content visible",
      async () => {
        await expect(await dataRoomPage.bodyContent()).toBeVisible();
        await expect(await dataRoomPage.bodyContentName()).toBeVisible();
        await expect(await dataRoomPage.bodyContentName()).toHaveText(DataRoomTestdata.dataRoomName);
        await expect(await dataRoomPage.bodyContentFileCount()).toBeVisible();
        await expect(await dataRoomPage.bodyContentFileCount()).toHaveText('0');
        await expect(await dataRoomPage.bodyContentMemberCount()).toBeVisible();
        await expect(await dataRoomPage.bodyContentMemberCount()).toHaveText('0');
      },
      errors
    );

    await safeExpect(
      "Verify body content Action button",
      async () => {
        const dataRoom = await dataRoomPage.bodyContent();
        await dataRoom.hover();

        await expect(await dataRoomPage.bodyContentAction()).toBeVisible();
        const button = await dataRoomPage.bodyContentActionButton();
        await expect(button).toBeVisible();
        await button.click();
        await expect(await dataRoomPage.editButton()).toBeVisible();
        await expect(await dataRoomPage.deleteButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('verify inside data room page', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];
    
    const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
    await dataRoom.click();

    await safeExpect(
      "verfiy inside data room page heading",
      async () => {
        await expect(await dataRoomPage.heading()).toBeVisible();
        await expect(await dataRoomPage.heading()).toHaveText(DataRoomTestdata.dataRoomName);
      },
      errors
    );

    await safeExpect(
      "verify documents and access tab",
      async () => {
        await expect(await dataRoomPage.tablist()).toBeVisible();
        await expect(await dataRoomPage.documentsTabButton()).toBeVisible();
        await expect(await dataRoomPage.accessTabButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('verify documents data room page', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];
    
    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();
    }
   
    await safeExpect(
      "verfiy documents tab heading",
      async () => {
        await expect(await dataRoomPage.dataroomDocumnets()).toBeVisible();
        await expect(await dataRoomPage.documnetsHeader()).toBeVisible();
        await expect(await dataRoomPage.documnetsHeading()).toBeVisible();
        await expect(await dataRoomPage.documnetsHeading()).toHaveText('Manage documents');
        await expect(await dataRoomPage.AddFilesButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "verify documents table heading",
      async () => {
        await expect(await dataRoomPage.tableHeader()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderName()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderUpload()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "No contents",
      async () => {
        await expect(await dataRoomPage.documentTableNoResult()).toBeVisible();
        await expect(await dataRoomPage.documentTableNoResult()).toHaveText('You have not added any files to this data room');
        await expect(await dataRoomPage.noContentAddFileButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('verify Access data room page', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();
    }

    const accessButton = await dataRoomPage.accessTabButton();
    await accessButton.click();

    await safeExpect(
      "verfiy Access tab heading",
      async () => {
        await expect(await dataRoomPage.dataroomAccess()).toBeVisible();
        await expect(await dataRoomPage.accessHeader()).toBeVisible();
        await expect(await dataRoomPage.accessHeading()).toBeVisible();
        await expect(await dataRoomPage.accessHeading()).toHaveText('Visitors with access');
        await expect(await dataRoomPage.InviteButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "verify Access table heading",
      async () => {
        await expect(await dataRoomPage.tableHeader()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderName()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderOrg()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderStatus()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderDate()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "No contents",
      async () => {
        await expect(await dataRoomPage.noContentAccess()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })
  
  test('verify Upload modal in documents', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();
    }

    const documents = await dataRoomPage.documentsTabButton();
    await documents.click();

    const addFile = await dataRoomPage.AddFilesButton();
    await addFile.click();

    await safeExpect(
      "verfiy Add File Modal header",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText('Add files to data room');
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "verify Add file modal content",
      async () => {
        await expect(await dataRoomPage.modalContent()).toBeVisible();
        await expect(await dataRoomPage.modalContentDiscription()).toBeVisible();
        await expect(await dataRoomPage.modalContentDiscription()).toHaveText('Select existing files from your project to add to the data room. To upload new files, use the “Upload new files” option.');
        await expect(await dataRoomPage.tableHeaderName()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderUpload()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "verify buttons on add files modal",
      async () => {
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalUploadButton()).toBeVisible();
        await expect(await dataRoomPage.modalAddButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Upload files modal in documents', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.modal()).isVisible())){
      if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
        const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
        await dataRoom.click();
      }

    const addFile = await dataRoomPage.AddFilesButton();
    await addFile.click();
    }

    const upload = await dataRoomPage.modalUploadButton();
    await upload.click();
    
    await safeExpect(
      "verfiy Add File Modal header",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText('Upload files');
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "verify Add file modal content",
      async () => {
        await expect(await dataRoomPage.modalContent()).toBeVisible();
        await expect(await dataRoomPage.uploadModaldiscription()).toBeVisible();
        await expect(await dataRoomPage.uploadModaldiscription()).toHaveText('Upload new files you want to share in the data room. Use the "Add files" option if you want to add previously uploaded project files to this data room.');
        await expect(await dataRoomPage.uploadModalFileUpload()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "verify buttons on Upload files modal",
      async () => {
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalDoneButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Upload file in documents', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.modal()).isVisible())){

    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();
    }

    const addFile = await dataRoomPage.AddFilesButton();
    await addFile.click();

    const upload = await dataRoomPage.modalUploadButton();
    await upload.click();
    }

    await safeExpect(
      "verfiy Add File Modal header",
      async () => {
        const inputFileUpload = await dataRoomPage.fileUplaodInput();
        const filePath = require('path').resolve(__dirname, '../../assets/file2.png');
        await inputFileUpload.setInputFiles(filePath);
        const DoneButton = await dataRoomPage.modalDoneButton();
        await DoneButton.click();

        const Add = await dataRoomPage.modalAddButton();
        await Add.click();

        const success = await dataRoomPage.successMessagediv()
        await expect(success).toBeVisible();
        await expect(success).toHaveText('1 file was added');
        const closeButton = await dataRoomPage.closeToast();
        await closeButton.click();
      },
      errors
    );

    await safeExpect(
      "verfiy Documents tab after adding file",
      async () => {
        const fileRow = await dataRoomPage.fileRow();
        await expect(fileRow).toBeVisible();
        await expect(await dataRoomPage.fileName()).toBeVisible();
        await expect(await dataRoomPage.fileName()).toHaveText('file2.png');
        await expect(await dataRoomPage.fileUploadDate()).toBeVisible();
        await fileRow.hover();
        await expect(await dataRoomPage.fileAction()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Delete Uploaded file in documents', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
      const dataRoom = await dataRoomPage.bodyContentNameLink(DataRoomTestdata.dataRoomName);
      await dataRoom.click();
    }
    
    await safeExpect(
      "Delete Uploaded file",
      async () => {
        const fileRow = await dataRoomPage.fileRow();
        const rowId = fileRow.getAttribute('row-id');
        await fileRow.hover();
        const deleteFile = await dataRoomPage.fileDelete();
        await expect(deleteFile).toBeVisible();
        await deleteFile.click();
        await expect(await page.locator(`[row-id='${rowId}']`)).not.toBeVisible();        
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })
  
  test('Invite Access Modal for visitor access', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
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
  
  test('Invite user for visitor access', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.modal()).isVisible())){
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
  
  test('Remove access Invited user modal for visitor access', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
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
  
  test('Delete Invited user for visitor access', async() =>{
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    if(!(await (await dataRoomPage.documentsTabButton()).isVisible())){
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

  test('Edit Data room', async() => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    const dataRoomNavigate = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoomNavigate).toBeVisible();
    await dataRoomNavigate.click();

    const dataRoom = await dataRoomPage.bodyContent();
    await dataRoom.hover();

    const button = await dataRoomPage.bodyContentActionButton();
    await expect(button).toBeVisible();
    await button.click();

    await safeExpect(
      "Edit Data room",
      async () => {
        const editButton = await dataRoomPage.editButton();
        await expect(editButton).toBeVisible();
        await editButton.click();
      },
      errors
    );

    await safeExpect(
      "Edit Data room modal",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();  
        await expect(await dataRoomPage.modalHeading()).toHaveText('Edit data room');
        await expect(await dataRoomPage.modalCloseIcon()).toBeVisible();
        await expect(await dataRoomPage.dataRoomnameLabel()).toBeVisible();
        await expect(await dataRoomPage.dataRoomnameLabel()).toHaveText('Data room name');
        await expect(await dataRoomPage.dataRoomnameInput()).toBeVisible();
        await expect(await dataRoomPage.dataRoomnameInput()).toHaveValue(DataRoomTestdata.dataRoomName);
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalSaveButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "Update Data room modal",
      async () => {
        const input = await dataRoomPage.dataRoomnameInput();
        await input.fill(DataRoomTestdata.updateDataRoomName);
        const save = await dataRoomPage.modalSaveButton();
        await expect(save).toBeVisible();
        await save.click();

        await page.waitForTimeout(10000); 
        await expect(await dataRoomPage.bodyContentName()).toBeVisible();
        await expect(await dataRoomPage.bodyContentName()).toHaveText(DataRoomTestdata.updateDataRoomName);
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  test('Delete Data room', async() => {
    const dataRoomPage = new DataRoom(page);
    const errors = [];

    const dataRoom = await dataRoomPage.bodyContent();
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
        await expect(await dataRoomPage.deleteDataRoomModalfirstPera()).toHaveText(`Are you sure you want to delete the data room \"${DataRoomTestdata.updateDataRoomName}\"? All invited users will lose access to the private files shared in this data room.`);
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
