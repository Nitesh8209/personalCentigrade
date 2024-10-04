import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import { LoginPage } from "../../pages/loginPage";
import { Credentials } from "../data/testData";
import { devUrl } from "../data/testData";
import { verifyPasswordVerifierRequest, verifyTokens, waitForAuthResponses } from "../utils/authHelper";


let invalidUsername;
let invalidPassword;

test.beforeAll(async () => {
  invalidUsername = faker.internet.email().toLowerCase(); 
  invalidPassword = faker.internet.password(8); 
});

test.describe('Integration Login', () => {

  test('Successfully Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.enterEmail(Credentials.username);
    await loginPage.enterPassword(Credentials.password);
    await loginPage.submit();

    const passwordVerifierResponse = await waitForAuthResponses(page, Credentials.username);
    expect(passwordVerifierResponse.status()).toBe(200);
    await verifyPasswordVerifierRequest(passwordVerifierResponse.request());

    await page.waitForURL(`${devUrl}/projects`);
    await verifyTokens(page, true);
    expect(page.url()).toBe(`${devUrl}/projects`);
  });

  test('Login with Invalid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.enterEmail(invalidUsername);
    await loginPage.enterPassword(Credentials.password);
    await loginPage.submit();

    const passwordVerifierResponse = await waitForAuthResponses(page, invalidUsername);
    expect(passwordVerifierResponse.status()).toBe(400);
    await verifyPasswordVerifierRequest(passwordVerifierResponse.request(), false);

    await loginPage.getErrorMessage();
    await verifyTokens(page, false);
    await page.waitForURL(`${devUrl}/login`);
  });

  test('Login with Invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.enterEmail(Credentials.username);
    await loginPage.enterPassword(invalidPassword);
    await loginPage.submit();

    const passwordVerifierResponse = await waitForAuthResponses(page, Credentials.username);
    expect(passwordVerifierResponse.status()).toBe(400);
    await verifyPasswordVerifierRequest(passwordVerifierResponse.request());

    await loginPage.getErrorMessage();
    await verifyTokens(page, false);
    await page.waitForURL(`${devUrl}/login`);
  });

  test('Login with Invalid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.enterEmail(invalidUsername);
    await loginPage.enterPassword(invalidPassword);
    await loginPage.submit();

    const passwordVerifierResponse = await waitForAuthResponses(page, invalidUsername);
    expect(passwordVerifierResponse.status()).toBe(400);
    await verifyPasswordVerifierRequest(passwordVerifierResponse.request(), false);

    await loginPage.getErrorMessage();
    await verifyTokens(page, false);
    await page.waitForURL(`${devUrl}/login`);
  });
});

