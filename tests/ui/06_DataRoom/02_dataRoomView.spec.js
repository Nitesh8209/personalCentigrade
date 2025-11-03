import { test, expect } from "@playwright/test";
import { ListingPage } from "../../../pages/listingsPage";
import { LoginPage } from "../../../pages/loginPage";
import { deleteRequest, getData, getRequest, postRequest, saveData } from "../../utils/apiHelper";
import { safeExpect } from "../../utils/authHelper";
import path from "path";
import { dataRoomViewPage } from "../../../pages/dataRoomViewPage";
import { DataRoomTestdata, projectPublishCredentials, projectValidationCredentials } from "../../data/testData";
import API_ENDPOINTS from "../../../api/apiEndpoints";
const fs = require('fs');

let dataRoomId;
let accessToken;
let dataRoomMemberId;

// Load the file to be used for upload tests
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

// Test suite for unauthenticated user access to the data room
test.describe("Data Room Access for Unauthenticated User", { tag: ['@UI', '@SMOKE'] }, () => {
  let page;
  let listingPage;
  let dataRoomPage;

  // Setup before all tests: Initialize browser context and navigate to project details
  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    listingPage = new ListingPage(page);
    dataRoomPage = new dataRoomViewPage(page);
    const data = getData("UI");
    const BuyerprojectGuid = data.BuyerprojectGuid

    // await page.goto(`${baseURL}/listings`);
    // const projectTitle = await listingPage.projectItemCardContentMainTitle();
    // await expect(projectTitle).toBeVisible();
    // await projectTitle.click();
    // await page.waitForURL("**/overview");
    await page.goto(`${baseURL}/listings/projects/${BuyerprojectGuid}/overview`);

  });

   // Teardown after all tests: Close the page
  test.afterAll(async () => {
    await page.close();
  });

  // Test case to verify data room is disabled for unauthenticated users
  test("should disable data room for unauthenticated user", async () => {
    const errors = [];

    await safeExpect(
      `should display navigation and disable data room`,
      async () => {
        const documents = await listingPage.DocumentsTab();
        await expect(documents).toBeVisible();
        await documents.click();
        await page.waitForURL("**/supportingDocuments");

        await expect(await dataRoomPage.dataRoomNavigation()).toBeVisible(); 
      },
      errors
    );

    await safeExpect(
      `should not navigate to data room on click`,
      async () => {
        const dataRoom = await dataRoomPage.dataRoomNavigation();
        await expect(dataRoom).toBeVisible();
        await dataRoom.click();
        await expect(await page.url()).toContain(`/documents`);
        await expect(await dataRoomPage.dataRoomNavigation()).not.toHaveClass(
          /active/
        ); 
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  });
});

// Test suite for authenticated user access to the data room
test.describe("Data room for authenticated user", { tag: ['@UI', '@SMOKE'] }, () => {
  const authStoragePath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "project-buyer-auth.json"
  );
  test.use({ storageState: authStoragePath });

  let page;
  let loginPage;
  let listingPage;
  let dataRoomPage;
  let BuyerprojectGuid;

  // Setup before all tests: Log in and navigate to project details
  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page, baseURL);
    listingPage = new ListingPage(page);
    dataRoomPage = new dataRoomViewPage(page);

    const data = getData("UI");
    BuyerprojectGuid = data.BuyerprojectGuid
    await page.goto(`${baseURL}/listings/projects/${BuyerprojectGuid}/overview`);

  });

  // Teardown after all tests: Close the page
  test.afterAll(async () => {
    await page.close();
  });

  // Test case to verify navigation to the data room view page
  test("should navigate to data room view page", async () => {
    const errors = [];

    await safeExpect(
      `should navigate to supporting documents`,
      async () => {
        const documents = await listingPage.DocumentsTab();
        await expect(documents).toBeVisible({ timeout: 20000});
        await documents.click();
        await page.waitForURL("**/supportingDocuments");
      },
      errors
    );

    await safeExpect(
      `should navigate to data room`,
      async () => {
        const dataRoom = await dataRoomPage.dataRoomNavigation();
        await expect(dataRoom).toBeVisible();
        await dataRoom.click();
        await page.waitForURL("**/dataRoom");
        await expect(await page.url()).toContain(`/dataRoom`);
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  });

   // Test case to verify data room page UI elements
  test("should display data room page UI correctly", async () => {
    const errors = [];

    const documents = await listingPage.DocumentsTab();
    await expect(documents).toBeVisible();
    await documents.click();

    const dataRoom = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoom).toBeVisible();
    await dataRoom.click();

    await safeExpect(
      `should display heading and main content`,
      async () => {
        await expect(await dataRoomPage.mainContent()).toBeVisible();
        await expect(await dataRoomPage.stepTitle()).toBeVisible();
        await expect(await dataRoomPage.stepTitle()).toHaveText("Data Rooms");
        await expect(await dataRoomPage.requestInfoButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      `should display table elements`,
      async () => {
        await expect(await dataRoomPage.table()).toBeVisible();
        await expect(await dataRoomPage.tableHeader()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderFiles()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderDate()).toBeVisible();
        await expect(await dataRoomPage.noResult()).toBeVisible();
        await expect(await dataRoomPage.TableRequestInfoButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "should display no access message",
      async () => {
        const noResult = await dataRoomPage.noResult();
        await expect(noResult).toBeVisible();
        await expect(noResult).toHaveText("You don't have access to any data rooms for this project");
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  });


   // Test case to verify request info modal UI
  test("should display request info modal correctly", async () => {
    const errors = [];

    const documents = await listingPage.DocumentsTab();
    await expect(documents).toBeVisible();
    await documents.click();

    const dataRoom = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoom).toBeVisible();
    await dataRoom.click();

    const requestInfoButton = await dataRoomPage.requestInfoButton();
    await expect(requestInfoButton).toBeVisible();
    await requestInfoButton.click();


    await safeExpect(
      "should display modal content",
      async () => {
        await expect(await dataRoomPage.modal()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toBeVisible();
        await expect(await dataRoomPage.modalHeading()).toHaveText("Request information");
        await expect(await dataRoomPage.messageLabel()).toBeVisible();
        await expect(await dataRoomPage.messageInput()).toBeVisible();
        await expect(await dataRoomPage.messageInput()).toContainText(
          "Hi, I'd love to connect and learn more about your project's impact and potential opportunities. Thanks, Nitesh123 Agarwal"
        );
      },
      errors
    );

    await safeExpect(
      "should display modal buttons",
      async () => {
        await expect(await dataRoomPage.modalCancelButton()).toBeVisible();
        await expect(await dataRoomPage.modalSendButton()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  });

   // Test case to verify sending request info from modal
    test("send Request info modal", async () => {
      const errors = [];

      if(!(await (await dataRoomPage.modal()).isVisible())){
        const documents = await listingPage.DocumentsTab();
        await expect(documents).toBeVisible();
        await documents.click();
    
        const dataRoom = await dataRoomPage.dataRoomNavigation();
        await expect(dataRoom).toBeVisible();
        await dataRoom.click();
    
        const requestInfoButton = await dataRoomPage.requestInfoButton();
        await expect(requestInfoButton).toBeVisible();
        await requestInfoButton.click();  
      }

      await safeExpect(
        "should send request and show success message",
        async () => {
          await expect(await dataRoomPage.modal()).toBeVisible();
          const send = await dataRoomPage.modalSendButton();
          await expect(send).toBeVisible();
          await send.click();

          await expect(await dataRoomPage.successMessageHeader()).toBeVisible();
          await expect(await dataRoomPage.successMessageHeader()).toHaveText('Your message was sent');
          await expect(await dataRoomPage.successMessagediv()).toBeVisible();
          await expect(await dataRoomPage.successMessagediv()).toHaveText('Someone from this project should reach out to you shortly');
        },
        errors
      );
  
      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join("\n")}`);
      }
    });


    // Test case to verify creating and displaying a data room
    test("should create and display data room", async () => {
      const errors = [];
  
    const authdata = new URLSearchParams({
      username: projectPublishCredentials.email,
      password: projectPublishCredentials.password,
    });
    const authHeader = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const authResponse = await postRequest(API_ENDPOINTS.authTOken, authdata, authHeader);
    expect(authResponse.status).toBe(200);
    const authResponseBody = await authResponse.json();
    accessToken = authResponseBody.access_token;
    await saveData({ dataRoomAccessToken: accessToken }, 'UI');

    const dataRoomUrl = `${API_ENDPOINTS.dataRoomGuid(BuyerprojectGuid)}`;
    const data = {
      name: DataRoomTestdata.dataRoomName
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-centigrade-organization-id': 409,
    };

    const response = await postRequest(dataRoomUrl,JSON.stringify(data), headers);
    const responseBody = await response.json();
    dataRoomId = responseBody.id;
    await saveData({ dataRoomId: dataRoomId }, 'UI');

    await page.reload();
    const documents = await listingPage.DocumentsTab();
    await expect(documents).toBeVisible();
    await documents.click();

    const dataRoom = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoom).toBeVisible();
    await dataRoom.click();
      // await page.waitForTimeout(10000);
  
      await safeExpect(
        "should display data room content",
        async () => {
          await expect(await dataRoomPage.mainContent()).toBeVisible();
          await expect(await dataRoomPage.stepTitle()).toBeVisible();
          await expect(await dataRoomPage.stepTitle()).toHaveText(DataRoomTestdata.dataRoomName);
        },
        errors
      );

      await safeExpect(
        "should display table headers",
        async () => {
          await expect(await dataRoomPage.table()).toBeVisible();
          await expect(await dataRoomPage.tableHeader()).toBeVisible();
          await expect(await dataRoomPage.tableHeaderName()).toBeVisible();
          await expect(await dataRoomPage.tableHeaderType()).toBeVisible();
          await expect(await dataRoomPage.tableHeaderDate()).toBeVisible();
        },
        errors
      );
  
      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join("\n")}`);
      }
    });

    // Test case to verify adding a file to the data room
    test('should add file to data room', async ({request}) => {
      if(!dataRoomId && !accessToken){
        const data = await getData('UI');
        dataRoomId = data.dataRoomId;
        accessToken = data.dataRoomAccessToken;
      }

    // Upload file to the server
    const postfileUrl = `${API_ENDPOINTS.fileUploadUI}`;
    const fileData = {
      multipart: {
        file: {
          name: 'file.png',
          mimeType: 'application/octet-stream',
          buffer: fileBuffer,
        },
        isHidden: true,
        isPublic: true
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    };
    const fileResponse = await request.post(postfileUrl, fileData);
    await expect(fileResponse.status()).toBe(200);

    // Retrieve uploaded file details
    const getFileUrl = `${API_ENDPOINTS.fileUploadUI}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-centigrade-organization-id': 409,
    };
    const getfileResponse = await getRequest(getFileUrl, headers);
    const getfileRessponseBody = await getfileResponse.json();
    const projectfiledId = getfileRessponseBody[0].id;

    // Associate file with Data Room
    const dataRoomUrl = `${API_ENDPOINTS.dataRoomUI}/${dataRoomId}/file`;
    const data = {
      projectFileIds:[projectfiledId]
    }

    const response = await postRequest(dataRoomUrl,JSON.stringify(data), headers);
    await expect(response.status).toBe(201);
    });

    // Test case to verify uploaded file is displayed in the data room
    test("should display uploaded file in data room", async () => {
      const errors = [];
  
      await page.reload();
      const documents = await listingPage.DocumentsTab();
      await expect(documents).toBeVisible();
      await documents.click();
  
      const dataRoom = await dataRoomPage.dataRoomNavigation();
      await expect(dataRoom).toBeVisible();
      await dataRoom.click();
      // await page.waitForTimeout(10000);
  
      await safeExpect(
        "should display file details",
        async () => {
          await expect(await dataRoomPage.fileRow()).toBeVisible();
          await expect(await dataRoomPage.fileName()).toBeVisible();
          await expect(await dataRoomPage.fileName()).toHaveText('file.png');
          await expect(await dataRoomPage.fileType()).toBeVisible();
          await expect(await dataRoomPage.fileType()).toHaveText('PNG');
          await expect(await dataRoomPage.fileDate()).toBeVisible();
        },
        errors
      );

      await safeExpect(
        "should display table headers",
        async () => {
          await expect(await dataRoomPage.table()).toBeVisible();
          await expect(await dataRoomPage.tableHeader()).toBeVisible();
          await expect(await dataRoomPage.tableHeaderName()).toBeVisible();
          await expect(await dataRoomPage.tableHeaderType()).toBeVisible();
          await expect(await dataRoomPage.tableHeaderDate()).toBeVisible();
        },
        errors
      );
  
      if (errors.length > 0) {
        throw new Error(`Validation errors found:\n${errors.join("\n")}`);
      }
    });

});

// Test suite for data room access control for users without access
test.describe("data room file for without access user", { tag: ['@UI', '@SMOKE'] }, () => {

  let page;
  let loginPage;
  let listingPage;
  let dataRoomPage;
  let BuyerprojectGuid;

  // Setup before all tests: Log in with restricted user and navigate to project details
  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page, baseURL);
    listingPage = new ListingPage(page);
    dataRoomPage = new dataRoomViewPage(page);

    const data = getData("UI");
    BuyerprojectGuid = data.BuyerprojectGuid;

    // Navigate to the login page and perform login
    await loginPage.navigate();
    await loginPage.login(projectValidationCredentials.email, projectValidationCredentials.password);
    await page.waitForURL("**/projects");
    await page.goto(`${baseURL}/listings/projects/${BuyerprojectGuid}/overview`);
  })

  // Teardown after all tests: Close the page
  test.afterAll(async () => {
    await page.close();
  });

 // Test case to verify data room access is denied for unauthorized users
  test("should deny data room access to unauthorized user", async ({ baseURL }) => { 
    const errors = [];

    const documents = await listingPage.DocumentsTab();
    await expect(documents).toBeVisible({timeout: 20000});
    await documents.click();

    const dataRoom = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoom).toBeVisible();
    await dataRoom.click();

    await safeExpect(
      "should display no access message",
      async () => {
        const noResult = await dataRoomPage.noResult();
        await expect(noResult).toBeVisible();
        await expect(noResult).toHaveText("You don't have access to any data rooms for this project");
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  })

  // Test case to verify adding a member to the data room
  test("should add member to data room", async() => {

    if(!dataRoomId && !accessToken){
          const data = await getData('UI');
          dataRoomId = data.dataRoomId;
          accessToken = data.dataRoomAccessToken;
        }
    
        const dataRoomUrl = `${API_ENDPOINTS.dataRoomUI}/${dataRoomId}/member`;
        const data = {
          email: projectValidationCredentials.email,
          message: "Test"
        }
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-centigrade-organization-id': 409,
        };
    
        const response = await postRequest(dataRoomUrl, JSON.stringify(data), headers);
        await expect(response.status).toBe(201);
        const responseBody = await response.json();
        dataRoomMemberId = await responseBody.dataRoomMembers[0].member.id;
        await saveData({ dataRoomMemberId: dataRoomMemberId }, 'UI');
  })

  // Test case to verify data room access after granting permissions
  test('should grant data room access to authorized user', async ({ baseURL }) => { 
    const errors = [];

    await page.reload();
    const documents = await listingPage.DocumentsTab();
    await expect(documents).toBeVisible({timeout: 20000});
    await documents.click();

    const dataRoom = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoom).toBeVisible();
    await dataRoom.click();

    await safeExpect(
      "should display data room content and file",
      async () => {
        await expect(await dataRoomPage.stepTitle()).toBeVisible();
        await expect(await dataRoomPage.stepTitle()).toHaveText(DataRoomTestdata.dataRoomName); 
        await expect(await dataRoomPage.fileRow()).toBeVisible();
        await expect(await dataRoomPage.fileName()).toBeVisible();
        await expect(await dataRoomPage.fileName()).toHaveText('file.png');
        await expect(await dataRoomPage.fileType()).toBeVisible();
        await expect(await dataRoomPage.fileType()).toHaveText('PNG');
        await expect(await dataRoomPage.fileDate()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "should display table headers",
      async () => {
        await expect(await dataRoomPage.table()).toBeVisible();
        await expect(await dataRoomPage.tableHeader()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderName()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderType()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderDate()).toBeVisible();
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  })

  // Test case to verify removing a member from the data room
  test('should remove member from data room', async() => {
   if(!dataRoomId && !dataRoomMemberId){
      const data = await getData('UI');
      dataRoomId = data.dataRoomId;
      dataRoomMemberId = data.dataRoomMemberId;
      accessToken = data.dataRoomAccessToken;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoomUI}/${dataRoomId}/member/${dataRoomMemberId}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-centigrade-organization-id': 409,
    };

    const response = await deleteRequest(dataRoomUrl, headers);
    expect(response.status).toBe(204);
  });

  // Test case to verify data room access is denied after member removal
  test('should deny data room access after member removal', async ({ baseURL }) => { 
    const errors = [];

    await page.reload();
    const documents = await listingPage.DocumentsTab();
    await expect(documents).toBeVisible({timeout: 20000});
    await documents.click();

    const dataRoom = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoom).toBeVisible();
    await dataRoom.click();

    await safeExpect(
      "should display no access message",
      async () => {
        const noResult = await dataRoomPage.noResult();
        await expect(noResult).toBeVisible();
        await expect(noResult).toHaveText("You don't have access to any data rooms for this project");
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  })

   // Test case to verify deletion of the data room
  test('delete the data room', async () => {
    if(!dataRoomId && !accessToken){
      const data = await getData('UI');
      dataRoomId = data.dataRoomId;
      accessToken = data.dataRoomAccessToken;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoomUI}/${dataRoomId}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-centigrade-organization-id': 409,
    };

    const response = await deleteRequest(dataRoomUrl, headers);
    expect(response.status).toBe(204);
  });

})

// Test suite for verifying data room behavior after deletion
test.describe("After Delete Data Room", { tag: ['@UI', '@SMOKE'] }, () => {
  const authStoragePath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "project-buyer-auth.json"
  );
  test.use({ storageState: authStoragePath });

  let page;
  let loginPage;
  let listingPage;
  let dataRoomPage;

  // Setup before all tests: Log in and navigate to project details
  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page, baseURL);
    listingPage = new ListingPage(page);
    dataRoomPage = new dataRoomViewPage(page);

    // Navigate to the login page and perform login
    await loginPage.navigate();
    await page.waitForURL("**/projects");
    const ListingsButton = await listingPage.listings();
    await expect(ListingsButton).toBeVisible();
    await ListingsButton.click();
    await page.waitForURL("**/listings/projects");

    // Click on first project to navigate to project details
    const projectTitle = await listingPage.projectItemCardContentMainTitle();
    await expect(projectTitle).toBeVisible();
    await projectTitle.click();
    await page.waitForURL("**/overview");
  });

  // Teardown after all tests: Close the page
  test.afterAll(async () => {
    await page.close();
  });

  // Test case for verifying Navigation Header after authentication
  test("should not display data room on the data room page", async () => {
    const errors = [];

    const documents = await listingPage.DocumentsTab();
    await expect(documents).toBeVisible();
    await documents.click();

    const dataRoom = await dataRoomPage.dataRoomNavigation();
    await expect(dataRoom).toBeVisible();
    await dataRoom.click();

    await safeExpect(
      `should display heading and main content`,
      async () => {
        await expect(await dataRoomPage.mainContent()).toBeVisible();
        await expect(await dataRoomPage.stepTitle()).toBeVisible();
        await expect(await dataRoomPage.stepTitle()).toHaveText("Data Rooms");
        await expect(await dataRoomPage.requestInfoButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      `should display table elements`,
      async () => {
        await expect(await dataRoomPage.table()).toBeVisible();
        await expect(await dataRoomPage.tableHeader()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderFiles()).toBeVisible();
        await expect(await dataRoomPage.tableHeaderDate()).toBeVisible();
        await expect(await dataRoomPage.noResult()).toBeVisible();
        await expect(await dataRoomPage.TableRequestInfoButton()).toBeVisible();
      },
      errors
    );

    await safeExpect(
      "should display no access message",
      async () => {
        const noResult = await dataRoomPage.noResult();
        await expect(noResult).toBeVisible();
        await expect(noResult).toHaveText("You don't have access to any data rooms for this project");
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join("\n")}`);
    }
  });

});

