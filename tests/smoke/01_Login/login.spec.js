import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import { LoginPage } from "../../../pages/loginPage";
import { Credentials } from "../../data/testData";
import { getPasswordAuthResponse, getSrpAuthResponse } from "../../utils/authHelper";

test.describe('Smoke Login Test cases', () => {

  test.afterEach(async({page, baseURL})=>{
    const loginPage = new LoginPage(page, baseURL);
    await loginPage.logOut();
    expect(page.url()).toBe(`${baseURL}/login`);
  })

test('Verify the login functionality with valid credentials', async ({page, baseURL}) => {

  const loginPage = new LoginPage(page, baseURL);

  await loginPage.navigate();
  await loginPage.login(Credentials.username, Credentials.password);

  // Wait for SRP authentication response and validate payload
  const userSrpResponse = await getSrpAuthResponse(page);
  expect(userSrpResponse.status()).toBe(200);

  // Wait for password verifier response and validate payload
  const passwordVerifierResponse = await getPasswordAuthResponse(page);
  expect(passwordVerifierResponse.status()).toBe(200);

  // Ensure that the page navigates to the expected URL
  await page.waitForURL('**/projects');
  expect(page.url()).toBe(`${baseURL}/projects`);
})

test('Verify the login functionality with the email provided in uppercase while keeping the password valid', async ({page, baseURL}) => {

  const loginPage = new LoginPage(page, baseURL);

  await loginPage.navigate();
  await loginPage.login(Credentials.username.toUpperCase(), Credentials.password);
 // Wait for SRP authentication response and validate payload
 const userSrpResponse = await getSrpAuthResponse(page);
 expect(userSrpResponse.status()).toBe(200);

 // Wait for password verifier response and validate payload
 const passwordVerifierResponse = await getPasswordAuthResponse(page);
 expect(passwordVerifierResponse.status()).toBe(200);

 // Ensure that the page navigates to the expected URL
 await page.waitForURL('**/projects');
 expect(page.url()).toBe(`${baseURL}/projects`);
})

 
});

