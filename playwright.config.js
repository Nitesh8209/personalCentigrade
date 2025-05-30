// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

const baseUrl =
  process.env.PLATFORM === 'local'
    ? process.env.BASE_URL_LOCAL
    : process.env.PLATFORM === 'dev'
      ? process.env.BASE_URL_DEV
      : process.env.BASE_URL_PROD;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  snapshotPathTemplate: 'tests/assets/{arg}{ext}',
  snapshotDir: '__snapshots__',
  /* Run tests in files in parallel */
  // fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' , open: 'never',}],
    ['list'] // Shows real-time results in console
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 120000,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseUrl,
    actionTimeout: 60000,
    navigationTimeout: 60000,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'on'
  },
  expect: {
    timeout: 10000, // Global timeout for assertions (10 seconds)
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] ,
    //     viewport: { width: 1366, height: 768 },
    //   },
    // },
    // {
    //   name: 'API',
    //   testMatch: [ 'api/*/*.spec.js' ],
    //    use: { ...devices['Desktop Chrome'] ,
    //     viewport: { width: 1366, height: 768 },
    //   },
    //   fullyParallel: false,
    // },
    {
      name: 'login',
      testMatch: [ 'ui/01_Login/loginTest.spec.js' ],
       use: { ...devices['Desktop Chrome'] ,
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
    },
    {
      name: 'CompleteSignUp',
      testMatch: [ 'ui/02_SignUp/0_completeSignUp.spec.js'],
      use: { ...devices['Desktop Chrome'] ,
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
    },
    {
      name: 'CreateAccount',
      testMatch: [ 'ui/02_SignUp/1_CreateAccount.spec.js'],
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: false,
    },
    {
      name: 'verify',
      testMatch: [ 'ui/02_SignUp/2_verify.spec.js'],
      use: { ...devices['Desktop Chrome'] ,
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
    },
    {
      name: 'forgotPassword',
      testMatch: [ 'ui/02_SignUp/3_forgotPassword.spec.js' ],
      use: { ...devices['Desktop Chrome'] ,
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
    },
    {
      name: 'invite',
      testMatch: [ 'ui/02_SignUp/4_invite.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['CompleteSignUp'],
    },
    {
      name: 'Settings',
      testMatch: [ 'ui/03_Settings/1_myAccount.spec.js',
         'ui/03_Settings/2_organization.spec.js', 'ui/03_Settings/3_team.spec.js'
        ],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['CompleteSignUp'],
    },
    {
      name: 'organizationRole',
      testMatch: ['ui/03_Settings/4_organizationRole.spec.js' ],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['CompleteSignUp'],
    },
    {
      name: 'organizationEdgeCase',
      testMatch: ['ui/03_Settings/5_edgeCase.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['organizationRole'],
    },
    {
      name: 'ProjectPage',
      testMatch: [ 'ui/04_Project/01_ProjectPage.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
    },
    {
      name: 'ProjectOverview',
      testMatch: [ 'ui/04_Project/02_ProjectOverview.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['ProjectPage'],
    },
    {
      name: 'ProjectTopics',
      testMatch: [ 'ui/04_Project/03_Topic_level.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['ProjectPage'],
    },
    {
      name: 'Projectsteps',
      testMatch: [ 'ui/04_Project/04_Step_level.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['ProjectPage'],
    },
    {
      name: 'ProjectFields',
      testMatch: [ 'ui/04_Project/05_Field_level.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['ProjectPage'],
    },
    {
      name: 'ProjectButtons',
      testMatch: [ 'ui/04_Project/06_Form_discard_changes.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      fullyParallel: false,
      dependencies: ['ProjectPage'],
    },
    {
        name: 'PublishProject',
        testMatch: [ 'ui/04_Project/07_Publish_project.spec.js'],
        use: { ...devices['Desktop Chrome'],
          viewport: { width: 1366, height: 768 },
        },
        fullyParallel: false,
    },
    {
      name: 'FillRemainingTopics',
      testMatch: [ 'ui/04_Project/08_Fill_Other_Tiers.spec.js'],
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: false,
      dependencies: ['PublishProject'],
    },
      {
      name: 'ListingsPage',
      testMatch: [ 'ui/05_Buyer/*.spec.js'],
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
       },
      fullyParallel: true,
      dependencies: ['FillRemainingTopics'],
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
