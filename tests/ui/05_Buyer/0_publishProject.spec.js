import { expect, test } from "@playwright/test";
import { API_ENDPOINTS } from "../../../api/apiEndpoints";
import path from "path";
import { getData, postRequest, putRequest, saveData } from "../../utils/apiHelper";
import { project } from "../../data/projectData";
import { apiProjectCreadentials, Credentials, projectPublishCredentials } from "../../data/testData";
import { LoginPage } from '../../../pages/loginPage';
const fs = require("fs");

test.describe("fill all fields For validate listings buyer page", { tag: ['@UI', '@SMOKE'] }, async () => {
  let headers;
  let projectAccessToken;
  let projectId;
  let modularProjectId;
  let ProjectData;
  let BuyerprojectGuid;

  test.beforeAll(async () => {

    const authdata = new URLSearchParams({
      username: apiProjectCreadentials.email,
      password: apiProjectCreadentials.password,
    });
    const authHeader = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    // Set headers with authorization token and content type
    const authResponse = await postRequest(
      API_ENDPOINTS.authTOken,
      authdata,
      authHeader
    );
    expect(authResponse.status).toBe(200);
    const authResponseBody = await authResponse.json();
    projectAccessToken = authResponseBody.access_token;
    await saveData({ projectAccessToken: projectAccessToken }, "UI");

    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${projectAccessToken}`,
      'x-centigrade-organization-id': 409
    };

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "Project-data-new.json"
    );
    const rawData = fs.readFileSync(filePath, "utf-8");
    ProjectData = JSON.parse(rawData);
  });

  test("create Project", async ({ baseURL }) => {
    const projectData = {
      name: project.buyerProject,
      organizationId: apiProjectCreadentials.organizationId,
      domain: `${baseURL}/`,
    };

    const response = await postRequest(
      API_ENDPOINTS.createProject,
      JSON.stringify(projectData),
      headers
    );
    const responseBody = await response.json();
    expect(response.status).toBe(201);
    projectId = responseBody.id;
    BuyerprojectGuid = responseBody.guid;
    await saveData({ BuyerprojectId: projectId }, "UI");
    await saveData({ BuyerprojectGuid: BuyerprojectGuid}, 'UI');
  });

  // Test case to create a modular benefit project
  test("Create Modular-Benefit-Project", async () => {
    if(!BuyerprojectGuid){
        const data = getData('UI');
        BuyerprojectGuid = data.BuyerprojectGuid;
    }
    const data = {
      projectGuid: BuyerprojectGuid,
      classificationCategory: '["Carbon avoidance","Carbon reduction","Carbon removal","Undefined"]',
      classificationMethod:
        "Natural - The activity claim uses natural methods (e.g. IFM)",
      projectScale: "Micro (fewer than 1k tCO2e)",
      projectType: "ifm",
    };
    const modularUrl = API_ENDPOINTS.modularbenefitprojectguid(BuyerprojectGuid);
    const response = await postRequest(
      modularUrl,
      JSON.stringify(data),
      headers
    );

    // Assertions to verify the response
    expect(response.status).toBe(201);
    const responseBody = await response.json();

    // Save the mbp ID for later tests
    modularProjectId = responseBody.id;
    await saveData({ modularProjectId: modularProjectId }, "UI");
  });

  test("Create Modular-Benefit-Project with Config for Methodology", async () => {
    if (!modularProjectId || !BuyerprojectGuid) {
      const data = getData("UI");
      modularProjectId = data.modularProjectId;
      BuyerprojectGuid = data.BuyerprojectGuid
    }
    const config_id = 13;
    const mbpConfigUrl = `${API_ENDPOINTS.modularbenefitprojectguid(BuyerprojectGuid)}/${modularProjectId}/config/${config_id}`;
    const mbpConfigData = {};
    const mbpresponse = await postRequest(mbpConfigUrl, mbpConfigData, headers);

    // Validate the response
    expect(mbpresponse.status).toBe(200);
  });

  test("Post Request project-field-values for all Fields", async () => {
    if (!BuyerprojectGuid) {
      const data = getData("UI");
      BuyerprojectGuid = data.BuyerprojectGuid
    }

    const projectfieldvalueUrl = `${API_ENDPOINTS.createProjectguid(BuyerprojectGuid)}/project-field-values`;

    // Send a POST request with project approach data
    const response = await postRequest(
      projectfieldvalueUrl,
      JSON.stringify(ProjectData.fields),
      headers
    );

    // Verify the response status and structure
    // expect(response.status).toBe(201);
  });

  test(`Upload File`, async ({ request }) => {
    if (!BuyerprojectGuid) {
      const data = getData("UI");
      BuyerprojectGuid = data.BuyerprojectGuid
    }
    // Load the file to be used for upload tests
    const filePath = './tests/assets/file.png';
    const fileBuffer = fs.readFileSync(filePath);

    if (!projectId) {
      const data = getData("UI");
      projectId = data.BuyerprojectId
    }
    const fileUrl = `${API_ENDPOINTS.createProjectguid(BuyerprojectGuid)}/file`;

    for (const { configFieldId } of ProjectData.fileData) {

      const fileData = {
        multipart: {
          configFieldId: configFieldId,
          file: {
            name: 'file.png',
            mimeType: 'application/octet-stream',
            buffer: fileBuffer,
          },
        },
        headers: {
          'Authorization': `Bearer ${projectAccessToken}`,
          'x-centigrade-organization-id': '409',
        }
      };

      // Perform file upload
      const response = await request.post(fileUrl, fileData);

      expect(response.status()).toBe(200);
    };
  });

});

test.describe('publish project after for validate listings buyer page', { tag: ['@UI', '@SMOKE'] }, () => {
  let headers;
  let projectId;
  let projectGuid;

  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Login via UI and save storage state
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.navigate();
    await loginPage.login(projectPublishCredentials.email, projectPublishCredentials.password);

    await page.waitForURL('**/projects');
    const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-buyer-auth.json');
    await context.storageState({ path: authStoragePath });

    await context.close();

    const { projectAccessToken, BuyerprojectId ,BuyerprojectGuid} = getData("UI");
    projectId = BuyerprojectId;
    projectGuid = BuyerprojectGuid;

    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${projectAccessToken}`,
      'x-centigrade-organization-id': 409
    };
  })

  test("Publish project", async () => {
    const publishProjectUrl = `${API_ENDPOINTS.createProjectguid(projectGuid)}/publish`;
    const data = { notes: "Project first published" };
    const response = await postRequest(
      publishProjectUrl,
      JSON.stringify(data),
      headers
    );

    expect(response.status).toBe(201);
  });

  test("should be Update the Review State of project by superUser", async () => {
    const authHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const credData = new URLSearchParams({
      username: Credentials.username,
      password: Credentials.password,
    });
    const credResponse = await postRequest(API_ENDPOINTS.authTOken, credData, authHeaders);
    const credResponseBody = await credResponse.json();
    expect(credResponse.status).toBe(200);
    const accessToken = credResponseBody.access_token;

    const reviewProjectUrl = `${API_ENDPOINTS.createProjectguid(projectGuid)}`;
    const data = { reviewState: "REVIEWED" };
    const reviewHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      'x-centigrade-organization-id': 409
    };

    const response = await putRequest(
      reviewProjectUrl,
      JSON.stringify(data),
      reviewHeaders
    );
    expect(response.status).toBe(200);
  });

  test("Publish project after REVIEWED", async () => {
    const publishProjectUrl = `${API_ENDPOINTS.createProjectguid(projectGuid)}/publish`;
    const data = { notes: "Project first published" };

    const response = await postRequest(
      publishProjectUrl,
      JSON.stringify(data),
      headers
    );
    expect(response.status).toBe(201);
  });
})
