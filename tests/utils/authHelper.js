import { clientId, expectedUsername } from "../data/testData";

// Retrieve a token from localStorage based on its token name.
 async function getTokenFromLocalStorage(page, tokenName) {
  return await page.evaluate(({ tokenName, clientId, expectedUsername }) =>
    localStorage.getItem(`CognitoIdentityServiceProvider.${clientId}.${expectedUsername}.${tokenName}`),
    { tokenName, clientId, expectedUsername }
  );
}

// Wait for the SRP authentication response from the Cognito API.
export async function getSrpAuthResponse(page) {
  const userSrpResponse = await page.waitForResponse(
    response => response.url() === 'https://cognito-idp.us-east-1.amazonaws.com/' && response.request().postData().includes('USER_SRP_AUTH')
  );
  return userSrpResponse;
}

// Wait for the password verifier response from the Cognito API.
export async function getPasswordAuthResponse(page) {
  const passwordVerifierResponse = await page.waitForResponse(
    response => response.url() === 'https://cognito-idp.us-east-1.amazonaws.com/' && response.request().postData().includes('PASSWORD_VERIFIER')
  );
  return passwordVerifierResponse;
}

// Retrieve authentication tokens (idToken, accessToken, refreshToken) from localStorage.
export async function getTokens(page) {
    const idToken = await getTokenFromLocalStorage(page, 'idToken' );
    const accessToken = await getTokenFromLocalStorage(page, 'accessToken' );
    const refreshToken = await getTokenFromLocalStorage(page, 'refreshToken');
    return {idToken, accessToken, refreshToken};
  }
