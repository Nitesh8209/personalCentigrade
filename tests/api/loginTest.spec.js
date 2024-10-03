import { test, expect } from '@playwright/test';
import { Credentials, apiUrl, InvalidCreadentials } from '../data/testData';
import { postRequest, validateErrorResponse } from '../utils/apiHelper'

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

    InvalidCreadentials.forEach(({ description, username, password, expectedStatusCode, expectedMessage }) => {
        test(`Login With ${description}`, async () => {
            const data = new URLSearchParams({ username, password });
            const response = await postRequest(url, data, headers);
            const responseBody = await response.json();
            expect(response.status).toBe(expectedStatusCode);
            validateErrorResponse(responseBody, expectedStatusCode, expectedMessage);
        });
    });
});