export const Credentials = {
  username: 'bidipta.paul@kreeti.com',
  password: 'Centigrade@2025',
  invalidUsername: 'Invalid@kreeti.com',
  invalidPassword: 'InvalidPassword'
};

export const projectPublishCredentials = {
  email: 'nitesh.agarwal+test1743665610357@kreeti.com',
  password: 'Centigrade@12345',
  organizationName: 'automationProject2',
  memberEmail: 'nitesh.agarwal+test1743665610234@kreeti.com'
}

export const projectValidationCredentials = {
  email:'nitesh.agarwal+test1743664097066@kreeti.com',
  password: 'Centigrade@12345',
  organizationName: 'automationProject1',
  organizationId: 408,
}

export const apiProjectCreadentials = {
  email: 'nitesh.agarwal+test1743665610357@kreeti.com',
  password: 'Centigrade@12345',
  organizationName: 'automationProject2',
  organizationId: 409,
} 

export const InvalidCreadentials = [
  {
    description: 'Invalid username',
    username: 'InvalidUser@gmail.com',
    password: 'Centigrade@2025',
    expectedStatusCode: 401,
    expectedMessage: 'Invalid username or password'
  },
  {
    description: 'Invalid password',
    username: 'bidipta.paul@kreeti.com',
    password: 'InvalidPassword',
    expectedStatusCode: 401,
    expectedMessage: 'Invalid username or password'
  },
  {
    description: 'Invalid username and password',
    username: 'InvalidUser@gmail.com',
    password: 'InvalidPassword',
    expectedStatusCode: 401,
    expectedMessage: 'Invalid username or password'
  },
  {
    description: 'Empty fields',
    username: '',
    password: '',
    expectedStatusCode: 400,
    expectedMessage: 'Either username and password or client_id and client_secret must be provided'
  }
];

export const DataRoomTestdata = {
  dataRoomName: 'Automation Test data',
  updateDataRoomName: 'Automation Test data updated',
  email: 'nitesh.agarwal+test1743664097066@kreeti.com',
  message: 'Message added for automation testing',
  name: 'Nitesh123 Agarwal',
  projectName: 'automationProject1',
  
}

export const quickLinkGroupData = [
  { label: "Project details", path: "/projectDetails" , stepLabel: "Project details", unAuthPath: "/projectDetails"},
  { label: "Baseline summary", path: "/bslSummary" , stepLabel: "Summary", unAuthPath: "/carbonSummary"},
  { label: "Project summary", path: "/projSummary" , stepLabel: "Summary", unAuthPath: "/carbonSummary"},
  { label: "Additionality", path: "/additionality" , stepLabel: "Additionality", unAuthPath: "/carbonSummary"},
  { label: "Cookstove monitoring", path: "/cookstoveMonitoring" , stepLabel: "Cookstoves monitoring", unAuthPath: "/carbonSummary"},
];


 /**
     * Test data configuration for feature flags
     * Each object contains:
     * - label: The feature flag identifier
     * - helperText: Description text shown to users
     * - checked: Default state of the feature flag
     */
export const featureFlagTestProjectGuid = "Z0EqNtflzy";
export const featureFlagsTestData = [
        {
            label: "project.ai_summaries",
            helperText: "Allow PDs to control/refine AI-generated summaries for buyers reviewing their project",
            checked: true
        },
        {
            label: "metrics.pd_dashboard",
            helperText: "Enable PD dashboard metrics for projects",
            checked: false
        },
        {
            label: "project.ai_search",
            helperText: "Allow users to search project data using natural language prompts",
            checked: true
        },
        {
            label: "project.send_google_analytics",
            helperText: "Enable event tracking via Google Analytics",
            checked: false
        },
        {
            label: "project.credit_inventory",
            helperText: "Enable the credit inventory management UI for projects",
            checked: true
        },
        {
            label: "rfp.feature",
            helperText: "Enable UI for managing RFPs and submitting proposals",
            checked: false
        }
    ];
 

export const API_BASE_URL =
  process.env.PLATFORM === 'local'
    ? process.env.API_BASE_URL_LOCAL
    : process.env.PLATFORM === 'dev'
      ? process.env.API_BASE_URL_DEV
      : process.env.API_BASE_URL_PROD;

export const clientId = '3vt9mvi7g8brl86n35rqe5pf93';
export const expectedUsername = 'bpaul';
