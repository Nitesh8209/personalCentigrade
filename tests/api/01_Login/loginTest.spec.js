import { test, expect } from '@playwright/test';
import { Credentials, API_BASE_URL, InvalidCreadentials } from '../../data/testData';
import { postRequest, validateErrorResponse, saveData } from '../../utils/apiHelper'

test.describe('Login Api Tests', () => {
    let url;
    let headers;

    test.beforeAll(async () => {
        url = `${API_BASE_URL}/auth/token`;
        console.log(url);
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
        expect(responseBody).toHaveProperty('token_type', 'Bearer');
        expect(responseBody).toHaveProperty('refresh_token');

        const accessToken = responseBody.access_token;
        await saveData({ admin_access_token: accessToken }, 'Api');

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