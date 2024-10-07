import { Credentials, devUrl } from "./testData";

export const loginTestCases = [
    {
        description: 'Successfully Login with valid credentials',
        email: Credentials.username,
        password: Credentials.password,
        expectedUrl: `${devUrl}/projects`,
        expectedTokens: true,
        expectedStatus: 200,
        isValidUsername: true,
    },
    {
        description: 'Successfully Login with Uppercase Email',
        email: Credentials.username.toUpperCase(),
        password: Credentials.password,
        expectedUrl: `${devUrl}/projects`,
        expectedTokens: true,
        expectedStatus: 200,
        isValidUsername: true,
    },
    {
        description: 'Login with Invalid username',
        email: 'invalidUsername',
        password: Credentials.password,
        expectedUrl: `${devUrl}/login`,
        expectedTokens: false,
        expectedStatus: 400,
        isValidUsername: false,
    },
    {
        description: 'Login with Invalid password',
        email: Credentials.username,
        password: 'invalidPassword',
        expectedUrl: `${devUrl}/login`,
        expectedTokens: false,
        expectedStatus: 400,
        isValidUsername: true,
    },
    {
        description: 'Login with Invalid username and password',
        email: 'invalidUsername',
        password: 'invalidPassword',
        expectedUrl: `${devUrl}/login`,
        expectedTokens: false,
        expectedStatus: 400,
        isValidUsername: false,
    },
];
