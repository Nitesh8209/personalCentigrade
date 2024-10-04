import { expect } from "@playwright/test";
import { clientId, expectedUsername } from "../data/testData";

export async function verifyUserSRPAuthRequest(request, username) {
  const requestPayload = JSON.parse(request.postData());
  expect(requestPayload).toMatchObject({
    AuthFlow: 'USER_SRP_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      SRP_A: expect.any(String),
    },
  });
}

export async function verifyPasswordVerifierRequest(request, shouldMatch=true) {
  const usernameCheck = shouldMatch
    ? expect.stringMatching(expectedUsername)
    : expect.not.stringMatching(expectedUsername);

  const requestPayload = JSON.parse(request.postData());
  expect(requestPayload).toMatchObject({
    ChallengeName: 'PASSWORD_VERIFIER',
    ClientId: clientId,
    ChallengeResponses: {
      USERNAME: usernameCheck,
      PASSWORD_CLAIM_SIGNATURE: expect.any(String),
      PASSWORD_CLAIM_SECRET_BLOCK: expect.any(String),
      TIMESTAMP: expect.any(String),
    },
  });
}

export async function waitForAuthResponses(page, username) {
  const userSrpResponse = await page.waitForResponse(
    response => response.url() === 'https://cognito-idp.us-east-1.amazonaws.com/' && response.request().postData().includes('USER_SRP_AUTH')
  );
  expect(userSrpResponse.status()).toBe(200);
  await verifyUserSRPAuthRequest(userSrpResponse.request(), username);

  const passwordVerifierResponse = await page.waitForResponse(
    response => response.url() === 'https://cognito-idp.us-east-1.amazonaws.com/' && response.request().postData().includes('PASSWORD_VERIFIER')
  );
  return passwordVerifierResponse;
}


 async function getTokenFromLocalStorage(page, tokenName) {
  return await page.evaluate(({ tokenName, clientId }) =>
    localStorage.getItem(`CognitoIdentityServiceProvider.${clientId}.bpaul.${tokenName}`),
    { tokenName, clientId }
  );
}

export async function verifyTokens(page, expectedStatus = true) {
  const idToken = await getTokenFromLocalStorage(page, 'idToken' );
  const accessToken = await getTokenFromLocalStorage(page, 'accessToken' );
  const refreshToken = await getTokenFromLocalStorage(page, 'refreshToken');

  if (expectedStatus) {
    expect(idToken).not.toBeNull();
    expect(accessToken).not.toBeNull();
    expect(refreshToken).not.toBeNull();
  } else {
    expect(idToken).toBeNull();
    expect(accessToken).toBeNull();
    expect(refreshToken).toBeNull();
  }
}
