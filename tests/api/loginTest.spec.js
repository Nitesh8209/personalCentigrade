import { test, expect } from '@playwright/test';
import { Credentials, apiUrl } from '../data/testData';
import { postRequest } from '../utils/apiHelper'

test.describe('Login Api Tests', () => {
    let url;
    let headers;

    test.beforeAll(async () => {
        url = `${apiUrl}/auth/token`;
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
    });

    test('Successful login with valid credentials', async () => {
        const data = new URLSearchParams({
            username: Credentials.username,
            password: Credentials.password,
        });
        const response = await postRequest(url, data, headers);
        const responseBody = await response.json();
        expect(response.status).toBe(200);
        expect(responseBody).toHaveProperty('access_token');
        expect(responseBody).toHaveProperty('token_type');
        expect(responseBody).toHaveProperty('refresh_token');
    });

    test('Login with Invalid username', async () => {
        const data = new URLSearchParams({
            username: Credentials.invalidUsername,
            password: Credentials.password,
        });
        const response = await postRequest(url, data, headers);
        const responseBody = await response.json();
        expect(response.status).toBe(401);
        expect(responseBody).toHaveProperty('statusCode', 401);
        expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
        expect(responseBody).toHaveProperty('errorMessage', 'Invalid username or password');
        expect(responseBody).toHaveProperty('context');
        expect(responseBody.context).toHaveProperty('exception', '401: Invalid username or password');

        const expectedStructure = {
            "statusCode": 401,
            "errorType": "HTTP_ERROR",
            "errorMessage": "Invalid username or password",
            "context": {
                "exception": "401: Invalid username or password"
            },
            "timestamp": expect.any(String),
            "requestId": expect.any(String)
        }
        expect(responseBody).toMatchObject(expectedStructure);
    });

    test('Login with Invalid password', async () => {
        const data = new URLSearchParams({
            username: Credentials.username,
            password: Credentials.invalidPassword,
        });
        const response = await postRequest(url, data, headers);
        const responseBody = await response.json();
        expect(response.status).toBe(401);
        expect(responseBody).toHaveProperty('statusCode', 401);
        expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
        expect(responseBody).toHaveProperty('errorMessage', 'Invalid username or password');
        expect(responseBody).toHaveProperty('context');
        expect(responseBody.context).toHaveProperty('exception', '401: Invalid username or password');

        const expectedStructure = {
            "statusCode": 401,
            "errorType": "HTTP_ERROR",
            "errorMessage": "Invalid username or password",
            "context": {
                "exception": "401: Invalid username or password"
            },
            "timestamp": expect.any(String),
            "requestId": expect.any(String)
        }
        expect(responseBody).toMatchObject(expectedStructure);
    });

    test('Login with Invalid username and password', async () => {
        const data = new URLSearchParams({
            username: Credentials.invalidUsername,
            password: Credentials.invalidPassword,
        });
        const response = await postRequest(url, data, headers);
        const responseBody = await response.json();
        expect(response.status).toBe(401);
        expect(responseBody).toHaveProperty('statusCode', 401);
        expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
        expect(responseBody).toHaveProperty('errorMessage', 'Invalid username or password');
        expect(responseBody).toHaveProperty('context');
        expect(responseBody.context).toHaveProperty('exception', '401: Invalid username or password');

        const expectedStructure = {
            "statusCode": 401,
            "errorType": "HTTP_ERROR",
            "errorMessage": "Invalid username or password",
            "context": {
                "exception": "401: Invalid username or password"
            },
            "timestamp": expect.any(String),
            "requestId": expect.any(String)
        }
        expect(responseBody).toMatchObject(expectedStructure);
    });

    test('Login with empty fields', async () => {
        const data = new URLSearchParams({
            username: Credentials.emptyUsername,
            password: Credentials.emptyPassword,
        });
        const response = await postRequest(url, data, headers);
        const responseBody = await response.json();
        expect(response.status).toBe(400);
        expect(responseBody).toHaveProperty('statusCode', 400);
        expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
        expect(responseBody).toHaveProperty('errorMessage', 'Either username and password or client_id and client_secret must be provided');
        expect(responseBody).toHaveProperty('context');
        expect(responseBody.context).toHaveProperty('exception', '400: Either username and password or client_id and client_secret must be provided');

        const expectedStructure = {
            "statusCode": 400,
            "errorType": "HTTP_ERROR",
            "errorMessage": "Either username and password or client_id and client_secret must be provided",
            "context": {
                "exception": "400: Either username and password or client_id and client_secret must be provided"
            },
            "timestamp": expect.any(String),
            "requestId": expect.any(String)
        }
        expect(responseBody).toMatchObject(expectedStructure);
    });
});