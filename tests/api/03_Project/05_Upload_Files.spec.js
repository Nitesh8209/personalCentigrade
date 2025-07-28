import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { getData } from '../../utils/apiHelper';
import * as fs from 'fs';
import path from 'path';

// Load the file to be used for upload tests
const filePath = './tests/assets/file.png';
const fileBuffer = fs.readFileSync(filePath);

test.describe('Upload Files For all Tiers', { tag: '@API' }, () => {
  // Retrieve required data like tokens, organizationId, and projectId from saved data
  const { projectAccessToken, guid } = getData('Api');

  let headers;
  let FileType;

  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "data",
    "Project-publish-data-non-tier0.json"
  );
  const rawData = fs.readFileSync(filePath, "utf-8");
  const fieldsData = JSON.parse(rawData);
  FileType = fieldsData.fileData;

  test.beforeAll(async () => {
    // Set headers with authorization token and content type
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${projectAccessToken}`,
      'x-centigrade-organization-id': 409
    };
  });

  // tests for file upload with different file types
  test.describe('Upload File', () => {
    const singleFile = FileType[0];

    if (singleFile) {
      const { configFieldId, projectFileType } = singleFile;
      test(`should successfully upload a file of type: ${projectFileType}`, async ({ request }) => {
        const fileUrl = `${API_ENDPOINTS.createProjectguid(guid)}/file`;

        // Prepare file data for upload
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
            'x-centigrade-organization-id': String(409),
          }
        };

        // Perform file upload
        const response = await request.post(fileUrl, fileData);
        const responseBody = await response.json();
 
        // Verify upload success and response structure
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('url', expect.any(String));
        expect(responseBody).toHaveProperty('fileUploadId', expect.any(Number));
        expect(responseBody).toHaveProperty('projectFileId', expect.any(Number));
        expect(responseBody).toHaveProperty('filePath', expect.any(String));
      });
    };
  });

})