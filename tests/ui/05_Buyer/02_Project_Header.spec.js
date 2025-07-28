import { test, expect } from '@playwright/test';
import { FieldHandler } from '../../utils/fieldValidation';
import { ListingPage } from '../../../pages/listingsPage';
import { LoginPage } from "../../../pages/loginPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { project } from '../../data/projectData';
import { ProjectListings } from '../../../pages/projectListingPage';
import { safeExpect } from '../../utils/authHelper';
import { validateGetInTouchModal, validateListingProjectHeader } from '../../utils/listingsProjectHelper';
import path from 'path';
import { projectPublishCredentials } from '../../data/testData';
import { getGmailMessages } from '../../utils/signUpHelper';


test.describe('Project Header - UI and Navigation for Unauthenticated Users', { tag: '@UI' }, async () => {

  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    const listingPage = new ListingPage(page);
    await page.goto(`${baseURL}/listings`);

     // Click on first project to navigate to project details
     const projectTitle = await listingPage.projectItemCardContentMainTitle();
     await expect(projectTitle).toBeVisible();
     await projectTitle.click();
     await page.waitForURL('**/overview');
  });

  // Test case for verifying navigation elements for unauthenticated users
  test('Verify Navbar header should be visible for Unauthenticated Users', async ({ baseURL }) => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await safeExpect(`Navigation should be visible`, async () => {
      await expect(await listingPage.navigation()).toBeVisible();
    }, errors);

    await safeExpect(`Logo should be visible`, async () => {
      await expect(await listingPage.logo()).toBeVisible();
    }, errors);

    await safeExpect(`Login Button visible`, async () => {
      const Login = await listingPage.login();
      await expect(await listingPage.login()).toBeVisible();
      await Login.click();
      await expect(await page.url()).toContain(`${baseURL}/login?from=%2Flistings`);
    }, errors);

    await safeExpect(`Create Account Button visible`, async () => {
      await page.goBack();
      const createAccount = await listingPage.createAccount();
      await expect(await listingPage.createAccount()).toBeVisible();
      await createAccount.click();
      await expect(await page.url()).toContain(`${baseURL}/create-account?from=%2Flistings`);
      await page.goBack();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  // Test case for verifying project information display
  test('Verify should display Project Information on the Header for Unauthenticated Users', async () => {
    const errors = [];
    const projectHeader = new ProjectListings(page);

    await validateListingProjectHeader(projectHeader, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  test('Verify share button should not be visible for Unauthenticated Users', async () => {
    const errors = [];
    const projectHeader = new ProjectListings(page);
    const shareButton = await projectHeader.shareButton();

    await safeExpect(`Share button should not be visible`, async () => {
      await expect(shareButton).not.toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  // Test case for verifying Get In Touch modal functionality
  test('Verify should display and function Get In Touch Modal for Unauthenticated Users', { tag: '@SMOKE' }, async ({baseURL}) => {
    const errors = [];
    const projectHeader = new ProjectListings(page);
    const getInTouch = await projectHeader.getInTouch();
    await getInTouch.click();

    await safeExpect(`should be redirect on the create account page`, async () => {
      expect(await page.url()).toBe(`${baseURL}/create-account`)
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

})


// after Login 
test.describe('Project Header - UI and Navigation for Authenticated Users', { tag: '@UI' }, async () => {
  const { newEmail } = getData('UI');
  const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-Publish-auth.json');

  test.use({
    storageState: authStoragePath,
    contextOptions: {
      permissions: ['clipboard-read', 'clipboard-write']
    }
  });

  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    // Initialize page objects
    const context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page, baseURL);
    const listingPage = new ListingPage(page);

    // Navigate to the login page and perform login
    await loginPage.navigate();
    await page.waitForURL('**/projects');
    const ListingsButton = await listingPage.listings();
    await expect(ListingsButton).toBeVisible();
    await ListingsButton.click();
    await page.waitForURL('**/listings');

    const projectTitle = await listingPage.projectItemCardContentMainTitle();
      await expect(projectTitle).toBeVisible();
      await projectTitle.click();
      await page.waitForURL('**/overview');
  });

  // Test case for verifying navigation elements are hidden for authenticated users
  test('Verify Navbar header should not be visible for authenticated users', async () => {
    const errors = [];
    const listingPage = new ListingPage(page);

    await safeExpect(`Navigation should not be visible`, async () => {
      await expect(await listingPage.navigation()).not.toBeVisible();
    }, errors);

    await safeExpect(`Logo should not be visible`, async () => {
      await expect(await listingPage.logo()).not.toBeVisible();
    }, errors);

    await safeExpect(`Login and create account Buttons should not be visible`, async () => {
      await expect(await listingPage.login()).not.toBeVisible();
      await expect(await listingPage.createAccount()).not.toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  // Test case for verifying breadcrumb navigation for authenticated users
  // test('Verify should display Breadcurmps for authenticated users', async () => {
  //   const errors = [];
  //   const fieldHandler = new FieldHandler(page);

  //   await safeExpect(`Breadcurmps should be visible`, async () => {
  //     await expect(await fieldHandler.breadCrumps()).toHaveCount(3);
  //   }, errors);

  //   await safeExpect(`Breadcurmps should be visible`, async () => {
  //     const separators = await fieldHandler.separators()
  //     const allSeparators = await separators.all();
  //     await expect(separators).toHaveCount(2);
  //     for (const separator of allSeparators) {
  //       await expect(separator).toBeVisible();
  //     }
  //   }, errors);

  //   await safeExpect(`All Projects Breadcurmp should be visible`, async () => {
  //     await fieldHandler.validateBreadcrumb(0, '/listings', "Projects");
  //   }, errors);

  //   await safeExpect(`Project Breadcurmp should be visible`, async () => {
  //     await fieldHandler.validateBreadcrumb(1, '', project.buyerProject);
  //   }, errors);

  //   await safeExpect(`Overview Breadcurmp should be visible`, async () => {
  //     await fieldHandler.validateBreadcrumb(2, '', "Overview");
  //   }, errors);

  //   if (errors.length > 0) {
  //     throw new Error(`Validation errors found:\  n${errors.join('\n')}`);
  //   }

  // })

  // Test case for verifying project information display for authenticated users
  test('Verify should display Project Information on the Header for authenticated users', async () => {
    const errors = [];
    const projectHeader = new ProjectListings(page);

    await validateListingProjectHeader(projectHeader, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  })

  // Test case for verifying share button visibility and functionality for authenticated users
  test('Verify share button should be visible', async () => {
    const errors = [];
    const projectHeader = new ProjectListings(page);
    const shareButton = await projectHeader.shareButton();
    
    await safeExpect(`Share button visibility`, async () => {
      await expect(shareButton).toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  })

  // Test case for verifying share modal functionality for authenticated users
  test('Share Modal should be visible when click on the share button', async ({ context, baseURL }) => {
    const errors = [];
    let copiedUrl;
    const projectHeader = new ProjectListings(page);
    const shareButton = await projectHeader.shareButton();

    // Click on Share Button
    await safeExpect('Click Share button',
      async () => {
        await shareButton.click();
        const modal = await projectHeader.shareModal();
        await expect(modal).toBeVisible();
      },
      errors
    );

    await safeExpect('Verify Share Modal Heading',
      async () => {
        await expect(await projectHeader.shareModalHeader()).toBeVisible();
        await expect(await projectHeader.shareModalHeader()).toHaveText('Share project');
        await expect(await projectHeader.shareModalCloseButton()).toBeVisible();
      },
      errors
    );

    await safeExpect('Verify Share Modal Input Content',
      async () => {
        await expect(await projectHeader.input()).toBeVisible(); 
        await expect(await projectHeader.inputLabel()).toBeVisible();
        await expect(await projectHeader.inputLabel()).toHaveText('Enter email');
        await expect(await projectHeader.shareModalInput()).toBeVisible();
        await expect(await projectHeader.inputHelperText()).toBeVisible();
        await expect(await projectHeader.inputHelperText()).toHaveText('Use commas to separate multiple emails');
        await expect(await projectHeader.shareButtonInModal()).toBeVisible();
      },
      errors
    )

    await safeExpect('Verify Add a message textarea content',
        async () => {
          await expect(await projectHeader.shareModalMessage()).toBeVisible();
          await expect(await projectHeader.shareModalMessageLabel()).toBeVisible();
          await expect(await projectHeader.shareModalMessageLabel()).toHaveText('Add a message (optional)');
          await expect(await projectHeader.shareModalMessageTextArea()).toBeVisible();
        }, errors)

    // Verify Copied URL Message
    await safeExpect('Verify URL copied message',
      async () => {
        const link = await projectHeader.copyLink();
        await expect(link).toBeVisible();
        await link.click();
        const success = await projectHeader.successMessagediv();
        const successMessage = await success.innerText();
        await expect(success).toBeVisible();
        await expect(successMessage).toBe('Link has been copied to your clipboard');
        copiedUrl = await page.evaluate(async () => {
          return await navigator.clipboard.readText();
        });
      },
      errors
    );

    // Open Copied URL and Verify Project Title
    await safeExpect('Open copied URL and verify project title',
      async () => {
        if (!copiedUrl.startsWith('http')) {
              copiedUrl = `https://${copiedUrl}`;
            }
        const newPage = await context.newPage();
        await newPage.goto(copiedUrl);
        const newProjectPage = new ProjectListings(newPage);
        await expect(newPage.url()).toBe(copiedUrl);
        await expect(await newProjectPage.listingprojectTitle()).toBeVisible();
        await expect(await newProjectPage.listingprojectTitle()).toHaveText(project.buyerProject);
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }

  });

  test('Send email should be visible when click on the share button', async () => {
    const errors = [];
    const projectHeader = new ProjectListings(page);
    const shareButton = await projectHeader.shareButton();

    // Click on Share Button
    await safeExpect('Click Share button',
      async () => {
        await shareButton.click();
        const modal = await projectHeader.shareModal();
        await expect(modal).toBeVisible();
      },
      errors
    );

    // Click on Send Email Button
    await safeExpect('Click Send Email button',
      async () => {
        const input = await projectHeader.shareModalInput();
        await input.fill(projectPublishCredentials.email);
        const shareEmailButton = await projectHeader.shareButtonInModal();
        await expect(shareEmailButton).toBeVisible();
        await shareEmailButton.click();
      },
      errors
    );

    await safeExpect('Verify success message',
      async () => {
        const success = await projectHeader.successMessagediv();
        const successMessage = await success.innerText();
        await expect(success).toBeVisible();
        await expect(successMessage).toBe('Your project has been shared.');
      },
      errors
    );

    await safeExpect('Verify the email received',
      async () => {
        const {subject} = await getGmailMessages(projectPublishCredentials.email);
        await expect(subject).toContain('automationProject2 has shared a project with you');
      },
      errors
    );

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });


  // Test case for verifying Get In Touch modal functionality for authenticated users
  test('Verify should display and functional Get In Touch Modal for authenticated users', { tag: '@SMOKE' }, async () => {
    const errors = [];
    const projectHeader = new ProjectListings(page);
    const getInTouch = await projectHeader.getInTouch();
    await getInTouch.click();

    await validateGetInTouchModal(projectHeader, errors);

    await safeExpect(`Modal cancel Button functionlity`, async () => {
      const cancelButton = await projectHeader.modalCancelButton();
      await cancelButton.click();
      await expect(await projectHeader.getInTouchModal()).not.toBeVisible();
    }, errors);

    if (errors.length > 0) {
      throw new Error(`Validation errors found:\n${errors.join('\n')}`);
    }
  });

})