import { test, expect } from '@playwright/test';
import { deleteRequest, getData, getRequest, postRequest, putRequest, saveData } from '../../utils/apiHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { dataRoomData } from '../../data/projectData';
import { projectValidationCredentials } from '../../data/testData';
const fs = require('fs');

// Load the file to be used for upload tests
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

// Test suite for Data Room API endpoints
test.describe('API Test cases for Data Room' ,{tag: '@API'}, () => {

  // Declare variables for authentication and IDs
  const { projectAccessToken} = getData('Api');
  let headers;
  let dataRoomId;
  let dataRoomMemberId;
  let projectFileId;

  // Setup before running all tests
  test.beforeAll(async () => {
    // Initialize headers with authentication and organization details
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`,
      'x-centigrade-organization-id': 409,
    };
  });

  // Test retrieving Data Room list before creation (should be empty)
  test('Get Data Room Before Creting Data Room', async () => {
    const dataRoomUrl = `${API_ENDPOINTS.dataRooms}`

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseBody).toEqual([]);
  })

  // Test creating a new Data Room
  test('Crete Data Room', async () => {
    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}`;
    const data = {
      name: dataRoomData.name
    }

    const response = await postRequest(dataRoomUrl,JSON.stringify(data), headers);
    const responseBody = await response.json();
    
    dataRoomId = responseBody.id;
    await saveData({ dataRoomId: dataRoomId }, 'Api');

    // expect(response.status).toBe(200);
    expect(responseBody.id).toEqual(expect.any(Number));
    expect(responseBody.name).toBe(dataRoomData.name);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles).toEqual([]);
    
  })

  // Test retrieving Data Room list after creation
  test('Get Data Room after Creting Data Room', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRooms}`;

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody[0].id).toBe(dataRoomId);
    expect(responseBody[0].dataRoom).toBe(dataRoomData.name);
    expect(responseBody[0].numFiles).toBe(0);
    expect(responseBody[0].numMembers).toBe(0);
  })

  // Test retrieving a specific Data Room by ID after creation
  test('Get Data Room by id after Creting Data Room', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.name);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles).toEqual([]);
  })

  // Test updating Data Room name
  test('Update Data Room', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const data = {
      name: dataRoomData.updateName
    }
    const response = await putRequest(dataRoomUrl, JSON.stringify(data) ,headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles).toEqual([]);
  })

  // Test retrieving Data Room by ID after update
  test('Get Data Room by id after Update Data Room', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles).toEqual([]);
  })

  // Test uploading a file to the Data Room
  test('Add Data Room file', async ({request}) => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    // Upload file to the server
    const postfileUrl = `${API_ENDPOINTS.fileUpload}`;
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
        'Authorization': `Bearer ${projectAccessToken}`,
      }
    };
    const fileResponse = await request.post(postfileUrl, fileData);
    const fileRessponseBody = await fileResponse.json();
    expect(fileResponse.status()).toBe(200);
    const fileId = fileRessponseBody.projectFileId;

    // Retrieve uploaded file details
    const getFileUrl = `${API_ENDPOINTS.fileUpload}`;
    const getfileResponse = await getRequest(getFileUrl, headers);
    const getfileRessponseBody = await getfileResponse.json();
    const projectField = getfileRessponseBody[0];
    const projectfiledId = getfileRessponseBody[0].id;

    // Associate file with Data Room
    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}/file`;
    const data = {
      projectFileIds:[projectfiledId]
    }

    const response = await postRequest(dataRoomUrl,JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles[0].dataRoomId).toBe(dataRoomId);
    expect(responseBody.dataRoomFiles[0].projectFile).toEqual(projectField);

  })

  // Test retrieving Data Room by ID after file upload
  test('Get Data Room by id after Upload File', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles[0].dataRoomId).toBe(dataRoomId);
    expect(responseBody.dataRoomFiles[0].projectFile).not.toEqual([]);

     projectFileId = responseBody.dataRoomFiles[0].projectFile.id;
    await saveData({ projectFileId: projectFileId }, 'Api');
  })
  
  // Test adding a member with an invalid email
  test('Add Data Room member with an invalid email', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}/member`;
    const data = {
      email: "Invalid@gmail.com",
      message: "Test"
    }

    const response = await postRequest(dataRoomUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(response.status).toBe(404);
    expect(responseBody.statusCode).toBe(404);
    expect(responseBody.errorType).toBe('MODEL_NOT_FOUND');
    expect(responseBody.errorMessage).toBe("member not found");
    expect(responseBody.context).toEqual({});
  })

  // Test adding a member with a valid email
  test('Add Data Room member with a valid email', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}/member`;
    const data = {
      email: projectValidationCredentials.email,
      message: "Test"
    }

    const response = await postRequest(dataRoomUrl, JSON.stringify(data), headers);
    const responseBody = await response.json();

    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.dataRoomMembers[0].id).toEqual(expect.any(Number));
    expect(responseBody.dataRoomMembers[0].status).toBe("INVITED");
    expect(responseBody.dataRoomMembers[0].dataRoomId).toBe(dataRoomId);
    expect(responseBody.dataRoomMembers[0].member.email).toBe(projectValidationCredentials.email);
  })

  // Test retrieving Data Room by ID after adding a member
  test('Get Data Room by id after Add Member', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers[0].id).toEqual(expect.any(Number));
    expect(responseBody.dataRoomMembers[0].status).toBe("INVITED");
    expect(responseBody.dataRoomMembers[0].dataRoomId).toBe(dataRoomId);
    expect(responseBody.dataRoomMembers[0].member.email).toBe(projectValidationCredentials.email);
    expect(responseBody.dataRoomFiles[0].dataRoomId).toBe(dataRoomId);
    expect(responseBody.dataRoomFiles[0].projectFile).not.toEqual([]);

    dataRoomMemberId = responseBody.dataRoomMembers[0].member.id;
    await saveData({ dataRoomMemberId: dataRoomMemberId }, 'Api');
  })

  // Test deleting a member from the Data Room
  test('delete Member from Data Room', async () => {
    if(!dataRoomId && !dataRoomMemberId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
      dataRoomMemberId = data.dataRoomMemberId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}/member/${dataRoomMemberId}`;

    const response = await deleteRequest(dataRoomUrl, headers);
    expect(response.status).toBe(204);
  })

  // Test retrieving Data Room by ID after deleting a member
  test('Get Data Room by id after delete member', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles[0].dataRoomId).toBe(dataRoomId);
    expect(responseBody.dataRoomFiles[0].projectFile).not.toEqual([]);
  })

  // Test deleting a file from the Data Room
  test('delete file from Data Room', async () => {
    if(!dataRoomId && !projectFileId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
      projectFileId = data.projectFileId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}/file/${projectFileId}`;

    const response = await deleteRequest(dataRoomUrl, headers);
    expect(response.status).toBe(204);
  })

  // Test retrieving Data Room by ID after deleting a file
  test('Get Data Room by id after delete file', async () => {
    if(!dataRoomId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(dataRoomId);
    expect(responseBody.name).toBe(dataRoomData.updateName);
    expect(responseBody.grapheneProjectId).toBe(null);
    expect(responseBody.dataRoomMembers).toEqual([]);
    expect(responseBody.dataRoomFiles).toEqual([]);
  })

  // Test deleting the entire Data Room
  test('delete Data Room', async () => {
    if(!dataRoomId && !projectFileId){
      const data = await getData('Api');
      dataRoomId = data.dataRoomId;
      projectFileId = data.projectFileId;
    }

    const dataRoomUrl = `${API_ENDPOINTS.dataRoom}/${dataRoomId}`;

    const response = await deleteRequest(dataRoomUrl, headers);
    expect(response.status).toBe(204);
  })

  // Test retrieving Data Room list after deletion (should be empty)
  test('Get Data Room after delete Data Room', async () => {
    const dataRoomUrl = `${API_ENDPOINTS.dataRooms}`

    const response = await getRequest(dataRoomUrl, headers);
    const responseBody = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseBody).toEqual([]);
  })
  
})