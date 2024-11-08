import { expect } from '@playwright/test';
import { apiUrl } from "../data/testData";
const fs = require('fs');

// Helper function to make API requests
export async function makeApiRequest(method, url, data = {}, headers = {}) {
    try {
        const response = await fetch(url, {
            method: method,
            body: method === 'GET' ? undefined : data,
            headers: headers,
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

//Helper function to Authenticate and get token
export async function login(username, password) {
    const url = `${apiUrl}/auth/token`;
    const data = new URLSearchParams({
        username: username,
        password: password,
    });
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await makeApiRequest('POST', url, data, headers);

    if (response.status === 200) {
        return response.access_token;
    } else {
        throw new Error(`Login failed: ${response.error}`);
    }
}

//Helper function to Set Authorization Header
export function setAuthHeader(token) {
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

//Helper function to make GET request
export async function getRequest(url, headers = {}) {
    return await makeApiRequest('GET', url, {}, headers);
}

//Helper function to make POST request
export async function postRequest(url, data, headers = {}) {
    return await makeApiRequest('POST', url, data, headers);
}

//Helper function to make PUT request
export async function putRequest(url, data, headers = {}) {
    return await makeApiRequest('PUT', url, data, headers);
}

//Helper function to make Delete request
export async function deleteRequest(url, headers = {}) {
    return await makeApiRequest('DELETE', url, {}, headers);
}

//Verify standard error handling
function handleApiError(error) {
    if (error.response) {
        console.error(`API Error: ${error.response.status} - ${error.response.data.message}`);
    } else if (error.request) {
        console.error('No response from API:', error.request);
    } else {
        console.error('Error setting up request:', error.message);
    }
}

//Get API response Data
function getApiResponseData(response) {
    if (response && response.data) {
        return response.data;
    }
    return {};
}

//Check response status
function checkResponseStatus(response, expectedStatus) {
    if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus} but received ${response.status}`);
    }
}

const dataFilePath = './tests/data/Creadential.json';

// Function to save new data to the JSON file by merging it with existing data
export async function saveData(newData, section) {
    let data = {};
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(rawData);
    data[section] = { ...data[section], ...newData };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Function to retrieve data from the JSON file
export function getData(section) {
    let data = {};
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(rawData);
    return data[section] || {};
}

export const validateErrorResponse = (responseBody, expectedStatusCode, expectedMessage) => {
    expect(responseBody).toHaveProperty('statusCode', expectedStatusCode);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', expectedMessage);
    expect(responseBody).toHaveProperty('context');
    expect(responseBody.context).toHaveProperty('exception', `${expectedStatusCode}: ${expectedMessage}`);
    const expectedStructure = {
        "statusCode": expectedStatusCode,
        "errorType": "HTTP_ERROR",
        "errorMessage": expectedMessage,
        "context": {
            "exception": `${expectedStatusCode}: ${expectedMessage}`
        },
        "timestamp": expect.any(String),
        "requestId": expect.any(String)
    };
    expect(responseBody).toMatchObject(expectedStructure);
};
