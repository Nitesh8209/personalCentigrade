import { test, expect } from "@playwright/test";
import {
  getData,
  getRequest,
  postRequest,
  putRequest,
} from "../../utils/apiHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { dataTableData, updateDataTable } from "../../data/projectData";

// Test suite for Data Table API endpoints
test.describe(`API test case for Data Table`, { tag: "@API" }, async () => {
  const { projectAccessToken } = getData("Api");
  let headers;

  // Setup before running all tests
  test.beforeAll(async () => {
    // Initialize headers with authentication and organization details
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${projectAccessToken}`,
    };
  });

  // Test cases for adding new data tables
  dataTableData.forEach(({ id, name, data }) => {
    const dataTableUrl = `${API_ENDPOINTS.dataTable}/${id}`;

    // Verify table is empty before adding data
    test(`Get Table before Add table ${name}`, async () => {
      const response = await getRequest(dataTableUrl, headers);
      const responseBody = await response.json();

      expect(responseBody).toEqual([]);
    });

    // Create new data table
    test(`Create Data Table ${name}`, async () => {
      const response = await postRequest(
        dataTableUrl,
        JSON.stringify(data),
        headers
      );
      const responseBody = await response.json();

      // Validate each cell in the response
      data.cells.forEach((cell, index) => {
        expect(responseBody[index].id).toEqual(expect.any(Number));
        expect(responseBody[index].grapheneProjectId).toEqual(
          expect.any(Number)
        );
        expect(responseBody[index].tableId).toBe(id);
        expect(responseBody[index].columnId).toBe(cell.columnId);
        expect(responseBody[index].rowIndex).toBe(cell.rowIndex);
        expect(responseBody[index].value).toBe(cell.value);
        expect(responseBody[index].isMutable).toBe(cell.isMutable);
      });
    });

    // Verify data table contents after creation
    test(`Verify Data Table ${name} After Creation`, async () => {
      const response = await getRequest(dataTableUrl, headers);
      const responseBody = await response.json();

      // Validate each cell in the response
      data.cells.forEach((cell, index) => {
        expect(responseBody[index].id).toEqual(expect.any(Number));
        expect(responseBody[index].grapheneProjectId).toEqual(
          expect.any(Number)
        );
        expect(responseBody[index].tableId).toBe(id);
        expect(responseBody[index].columnId).toBe(cell.columnId);
        expect(responseBody[index].rowIndex).toBe(cell.rowIndex);
        expect(responseBody[index].value).toBe(cell.value);
        expect(responseBody[index].isMutable).toBe(cell.isMutable);
      });
    });
  });

  // Test cases for updating existing data tables
  updateDataTable.forEach(({ id, name, data }) => {
    const dataTableUrl = `${API_ENDPOINTS.dataTable}/${id}`;

    // Update existing data table
    test(`Update Data Table ${name}`, async () => {
      const response = await putRequest(
        dataTableUrl,
        JSON.stringify(data),
        headers
      );
      const responseBody = await response.json();

      // Validate each updated cell in the response
      data.cells.forEach((cell, index) => {
        expect(responseBody[index].id).toEqual(expect.any(Number));
        expect(responseBody[index].grapheneProjectId).toEqual(
          expect.any(Number)
        );
        expect(responseBody[index].tableId).toBe(id);
        expect(responseBody[index].columnId).toBe(cell.columnId);
        expect(responseBody[index].rowIndex).toBe(cell.rowIndex);
        expect(responseBody[index].value).toBe(cell.value);
        expect(responseBody[index].isMutable).toBe(cell.isMutable);
      });
    });

    // Verify data table contents after update
    test(`Verify Data Table ${name} After Update`, async () => {
      const response = await getRequest(dataTableUrl, headers);
      const responseBody = await response.json();

      // Validate each cell in the response
      data.cells.forEach((cell, index) => {
        expect(responseBody[index].id).toEqual(expect.any(Number));
        expect(responseBody[index].grapheneProjectId).toEqual(
          expect.any(Number)
        );
        expect(responseBody[index].tableId).toBe(id);
        expect(responseBody[index].columnId).toBe(cell.columnId);
        expect(responseBody[index].rowIndex).toBe(cell.rowIndex);
        expect(responseBody[index].value).toBe(cell.value);
        expect(responseBody[index].isMutable).toBe(cell.isMutable);
      });
    });
  });
});
