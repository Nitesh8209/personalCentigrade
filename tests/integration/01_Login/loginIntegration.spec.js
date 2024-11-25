import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import { LoginPage } from "../../../pages/loginPage";
import { expectedUsername, clientId } from "../../data/testData";
import { getPasswordAuthResponse, getSrpAuthResponse, getTokens } from "../../utils/authHelper";
import { loginTestCases } from "../../data/IntegrationtestData";

// Variables to store dynamically generated invalid credentials
let invalidUsername;
let invalidPassword;

// Generate fake invalid credentials before all tests
test.beforeAll(async () => {
  invalidUsername = faker.internet.email().toLowerCase();
  invalidPassword = faker.internet.password(8);
});

test.describe('Integration Login', () => {

  // Loop through each test case provided in `loginTestCases`
  loginTestCases.forEach(({ description, email, password, expectedUrl, expectedTokens, expectedStatus, isValidUsername }) => {

    // Create a dynamic check for valid or invalid username matching
    const usernameCheck = isValidUsername
      ? expect.stringMatching(expectedUsername)
      : expect.not.stringMatching(expectedUsername);

    // Define the actual test with Playwright
    test(description, async ({ page }) => {

      const username = email === 'invalidUsername' ? invalidUsername : email;
      const testPassword = password === 'invalidPassword' ? invalidPassword : password;

      const loginPage = new LoginPage(page);

      // Navigate to login page and perform login
      await loginPage.navigate();
      await loginPage.enterEmail(username);
      await loginPage.enterPassword(testPassword);
      await loginPage.submit();

      // Wait for SRP authentication response and validate payload
      const userSrpResponse = await getSrpAuthResponse(page);
      expect(userSrpResponse.status()).toBe(200);
      const SrpRequestPayload = JSON.parse(userSrpResponse.request().postData());
      expect(SrpRequestPayload).toMatchObject({
        AuthFlow: 'USER_SRP_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: username.toLowerCase(),
          SRP_A: expect.any(String),
        },
      });

      // Wait for password verifier response and validate payload
      const passwordVerifierResponse = await getPasswordAuthResponse(page);
      expect(passwordVerifierResponse.status()).toBe(expectedStatus);
      const passwordRequestPayload = JSON.parse(passwordVerifierResponse.request().postData());
      expect(passwordRequestPayload).toMatchObject({
        ChallengeName: 'PASSWORD_VERIFIER',
        ClientId: clientId,
        ChallengeResponses: {
          USERNAME: usernameCheck,
          PASSWORD_CLAIM_SIGNATURE: expect.any(String),
          PASSWORD_CLAIM_SECRET_BLOCK: expect.any(String),
          TIMESTAMP: expect.any(String),
        },
      });

      // If the response status is 400, ensure error message is displayed
      if (expectedStatus === 400) {
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe('Unable to log in because the email or password is not correct');
      }

      // Validate token presence or absence based on expectedTokens flag
      const tokens = await getTokens(page);
      if (expectedTokens) {
        expect(tokens.idToken).not.toBeNull();
        expect(tokens.accessToken).not.toBeNull();
        expect(tokens.refreshToken).not.toBeNull();
      } else {
        expect(tokens.idToken).toBeNull();
        expect(tokens.accessToken).toBeNull();
        expect(tokens.refreshToken).toBeNull();
      }

      // Ensure that the page navigates to the expected URL
      await page.waitForURL(expectedUrl);
      expect(page.url()).toBe(expectedUrl);
    })
  })
});

