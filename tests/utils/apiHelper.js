const axios = require('axios');

// Helper function to make API requests
async function makeApiRequest(method, url, data = {}, headers = {}) {
    try {
        const response = await axios({
            method: method,
            url: url,
            data: data,
            headers: headers,
        });
        return response.data;
    } catch (error) {
        return error.response;
    }
}

//Helper function to Authenticate and get token
async function login(username, password) {
    const url = 'https://devapi.centigrade.earth/auth/token';
    const data = {
        username: username,
        password: password,
    };
    const response = await makeApiRequest('POST', url, data);
    
    if (response.status === 200) {
        return response.token; 
    } else {
        throw new Error(`Login failed: ${response.error}`);
    }
}

//Helper function to Set Authorization Header
function setAuthHeader(token) {
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
}

//Helper function to make GET request
async function getRequest(url, headers = {}) {
    return await makeApiRequest('GET', url, {}, headers);
}

//Helper function to make POST request
async function postRequest(url, data, headers = {}) {
    return await makeApiRequest('POST', url, data, headers);
}

//Helper function to make PUT request
async function putRequest(url, data, headers = {}) {
    return await makeApiRequest('PUT', url, data, headers);
}

//Helper function to make Delete request
async function deleteRequest(url, headers = {}) {
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
