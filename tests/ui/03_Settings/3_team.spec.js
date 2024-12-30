import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SettingsPage } from "../../../pages/settingsPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail, getGmailMessages } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { safeExpect } from '../../utils/authHelper';


test.describe('Settings - Team Page UI Tests', () => {
  const { newEmail, InviteEmail } = getData('UI');

  test('Verify Settings - Team page elements are displayed correctly', async ({ page, baseURL }) => {
    const errors = [];
    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Navigate to Settings and Team Tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();

    // Header section verification
    await safeExpect('Header section elements', async () => {
      await expect(await settingsPage.breadcrumb()).toBeVisible();
      await expect(await settingsPage.breadcrumb()).toHaveText('Settings');
      await expect(await settingsPage.settingsHeader()).toBeVisible();
      await expect(await settingsPage.headerTitle()).toBeVisible();
      await expect(await settingsPage.headerTitle()).toHaveText('Settings');
      await expect(await settingsPage.headerDescription()).toBeVisible();
      await expect(await settingsPage.headerDescription()).toHaveText('Manage account and organizational settings');
    }, errors);

    // Tab verification
    await safeExpect('Tab elements and states', async () => {
      await expect(await settingsPage.tabList()).toBeVisible();
      await expect(await settingsPage.myAccountTab()).toBeVisible();
      await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'false');
      await expect(await settingsPage.organizationTab()).toBeVisible();
      await expect(await settingsPage.organizationTab()).toHaveAttribute('aria-selected', 'false');
      await expect(await settingsPage.teamTab()).toBeVisible();
      await expect(await settingsPage.teamTab()).toHaveAttribute('aria-selected', 'true');
    }, errors);

    // Team table header verification
    await safeExpect('Team table headers', async () => {
      await expect(await settingsPage.teamheading()).toBeVisible();
      await expect(await settingsPage.teamNamecell()).toBeVisible();
      await expect(await settingsPage.teammembertypecell()).toBeVisible();
      await expect(await settingsPage.teamstatuscell()).toBeVisible();
    }, errors);

    // User details verification
    await safeExpect('User row content', async () => {
      await expect(await settingsPage.user(newEmail)).toBeVisible();
      await expect(await settingsPage.username(newEmail)).toBeVisible();
      const userName = await settingsPage.username(newEmail);
      await expect(await userName.textContent()).toBe(
        `${ValidTestData.newFirstName} ${ValidTestData.lastName}${newEmail}`
      );
      await expect(await settingsPage.useremail(newEmail)).toBeVisible();
      await expect(await settingsPage.useremail(newEmail)).toHaveText(newEmail);
    }, errors);

    // User role and status verification
    await safeExpect('User role and status', async () => {
      await expect(await settingsPage.usertype(newEmail)).toBeVisible();
      await expect(await settingsPage.usertype(newEmail)).toHaveText('Admin');
      await expect(await settingsPage.userstatus(newEmail)).toBeVisible();
      await expect(await settingsPage.userstatus(newEmail)).toHaveText('Active');
    }, errors);

    // Action buttons verification
    await safeExpect('User action buttons', async () => {
      await expect(await settingsPage.useredit(newEmail)).toBeVisible();
      await expect(await settingsPage.userdelete(newEmail)).toBeVisible();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })


  test('Approve the request for an already-invited user (InviteEmail) during the invite process', async ({ page, baseURL }) => {
    const errors = [];

    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Navigate to Settings and Team Tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();

    // User details verification
    await safeExpect('Invite User row content', async () => {
      await expect(await settingsPage.user(InviteEmail)).toBeVisible();
      await expect(await settingsPage.username(InviteEmail)).toBeVisible();
      const userName = await settingsPage.username(InviteEmail);
      await expect(await userName.textContent()).toBe(`${ValidTestData.firstName} ${ValidTestData.lastName}${InviteEmail}`);
      await expect(await settingsPage.useremail(InviteEmail)).toBeVisible();
      await expect(await settingsPage.useremail(InviteEmail)).toHaveText(InviteEmail);
      await expect(await settingsPage.usertype(InviteEmail)).toBeVisible();
      await expect(await settingsPage.usertype(InviteEmail)).toHaveText('Requested');
    }, errors);

    // Approve and reject buttons verification
    await safeExpect('Reject and Approve buttons', async () => {
      await expect(await settingsPage.rejectButton(InviteEmail)).toBeVisible();
      await expect(await settingsPage.rejectButton(InviteEmail)).toHaveText('Reject');
      await expect(await settingsPage.approveButton(InviteEmail)).toBeVisible();
      await expect(await settingsPage.approveButton(InviteEmail)).toHaveText('Approve');
      await expect(await settingsPage.useredit(InviteEmail)).toBeVisible();
      await expect(await settingsPage.userdelete(InviteEmail)).toBeVisible();
    }, errors)

    // edit and delete buttons verification
    await safeExpect('Edit and Delete button', async () => {
      await expect(await settingsPage.useredit(InviteEmail)).toBeVisible();
      await expect(await settingsPage.userdelete(InviteEmail)).toBeVisible();
    }, errors)

    // Approve the user request
    await safeExpect('Invite User row content after approval', async () => {
      const ApproveButton = await settingsPage.approveButton(InviteEmail);
      await ApproveButton.click();
      await expect(await settingsPage.usertype(InviteEmail)).toHaveText('Member');
      await expect(await settingsPage.userstatus(InviteEmail)).toBeVisible();
      await expect(await settingsPage.userstatus(InviteEmail)).toHaveText('Active');
      await expect(await settingsPage.rejectButton(InviteEmail)).not.toBeVisible();
      await expect(await settingsPage.approveButton(InviteEmail)).not.toBeVisible();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Sign up a new user, reject the request, and verify rejection', async ({ page, baseURL }) => {
    const errors = [];
    const RejectEmail = generateTestEmail();
    const signUpPage = new SignUpPage(page, baseURL);

    // Sign up a new user and verify verification code
    await signUpPage.completeSignUpProcess(ValidTestData.firstName, ValidTestData.lastName, ValidTestData.organizationName, RejectEmail);

    const { receivedVerificationCode } = await getGmailMessages(RejectEmail);
    await signUpPage.codeInput(receivedVerificationCode);
    await signUpPage.Password(ValidTestData.newPassword);
    await signUpPage.createAccount();
    await page.waitForURL('**/awaiting-approval');
    expect(page.url()).toContain('/awaiting-approval');

    // Log in as an admin and navigate to Settings
    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();

    // Verify user details in the 'Requested' status
    await safeExpect('Invite User row content', async () => {
      await expect(await settingsPage.user(RejectEmail)).toBeVisible();
      await expect(await settingsPage.username(RejectEmail)).toBeVisible();
      const userName = await settingsPage.username(RejectEmail);
      await expect(await userName.textContent()).toBe(`${ValidTestData.firstName} ${ValidTestData.lastName}${RejectEmail}`);
      await expect(await settingsPage.useremail(RejectEmail)).toBeVisible();
      await expect(await settingsPage.useremail(RejectEmail)).toHaveText(RejectEmail);
    }, errors);

    // Verify user is in 'Requested' status, reject and approve buttons are visible
    await safeExpect('Invite User row content', async () => {
      await expect(await settingsPage.usertype(RejectEmail)).toBeVisible();
      await expect(await settingsPage.usertype(RejectEmail)).toHaveText('Requested');
      await expect(await settingsPage.rejectButton(RejectEmail)).toBeVisible();
      await expect(await settingsPage.rejectButton(RejectEmail)).toHaveText('Reject');
      await expect(await settingsPage.approveButton(RejectEmail)).toBeVisible();
      await expect(await settingsPage.approveButton(RejectEmail)).toHaveText('Approve');
    }, errors);

    await safeExpect('Edit and Delete button', async () => {
      await expect(await settingsPage.useredit(RejectEmail)).toBeVisible();
      await expect(await settingsPage.userdelete(RejectEmail)).toBeVisible();
    }, errors);

    await safeExpect('Invite User row content after rejection', async () => {
      const RejectButton = await settingsPage.rejectButton(RejectEmail);
      await RejectButton.click();
      await expect(await settingsPage.user(RejectEmail)).not.toBeVisible();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  })

  test('Verify Invite User modal display', async ({ page, baseURL }) => {
    const errors = [];
    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Open settings and navigate to the 'Team' tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();

    // Open Invite User modal and verify elements
    const inviteButton = await settingsPage.inviteButton();
    await safeExpect('Invite button visibility',
      async () => await expect(inviteButton).toBeVisible(),
      errors
    );

    // Verify that the Invite User modal is displayed with the correct heading and helper text
    await safeExpect('Invite User modal visibility',
      async () => {
        await inviteButton.click();
        await expect(await settingsPage.inviteUserModal()).toBeVisible();
      },
      errors
    );

    // Verify the modal heading 
    await safeExpect('Invite heading visibility and text',
      async () => {
        await expect(await settingsPage.inviteheading()).toBeVisible();
        await expect(await settingsPage.inviteheading()).toHaveText('Invite users');
      },
      errors
    );

    // Verify the helper text in the modal
    await safeExpect('Helper text visibility and content',
      async () => {
        await expect(await settingsPage.invitehelperText()).toBeVisible();
        await expect(await settingsPage.invitehelperText()).toHaveText(
          "Invite team members to your organization. We'll ask new users to enter their details when they sign up."
        );
      },
      errors
    );

    // Verify form elements in the modal
    await safeExpect('Email field visibility and attributes',
      async () => {
        await expect(await settingsPage.inviteEmail()).toBeVisible();
        await expect(await settingsPage.inviteEmail()).toHaveText('Email');
        await expect(await settingsPage.inviteEmailInput()).toBeVisible();
        await expect(await settingsPage.inviteEmailInput()).toHaveAttribute('type', 'email');
      },
      errors
    );

    // Verify modal buttons
    await safeExpect('Modal buttons visibility and state',
      async () => {
        await expect(await settingsPage.inviteAdduserbutton()).toBeVisible();
        await expect(await settingsPage.modalclose()).toBeVisible();
        await expect(await settingsPage.cancelButton()).toBeVisible();
        await expect(await settingsPage.cancelButton()).toBeEnabled();
        await expect(await settingsPage.sendinvitation()).toBeVisible();
        await expect(await settingsPage.sendinvitation()).toBeEnabled();
      },
      errors
    );

    // Test adding a second email input field and removing it
    await safeExpect('Second email input field functionality',
      async () => {
        const AddUser = await settingsPage.inviteAdduserbutton();
        await AddUser.click();
        await expect(await settingsPage.inviteEmailsecondinput()).toBeVisible();
        await expect(await settingsPage.inviteEmailsecondinput()).toHaveAttribute('type', 'email');
        await expect(await settingsPage.inviteremoveEmailsecondinput()).toBeVisible();
      },
      errors
    );

    // Test removing the second email input field
    await safeExpect('Second email input removal',
      async () => {
        const closeSecondInput = await settingsPage.inviteremoveEmailsecondinput();
        await closeSecondInput.click();
        await expect(await settingsPage.inviteEmailsecondinput()).not.toBeVisible();
      },
      errors
    );

    // If there are any errors, fail the test with details
    if (errors.length > 0) {
      throw new Error(`Test failures:\n${errors.join('\n')}`);
    }
  })


  test('Invite a user to join the organization and auto-approve the invite', async ({ page, baseURL }) => {
    const errors = [];
    const Invite1Email = generateTestEmail();

    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Open settings and navigate to the 'Team' tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();

    const inviteButton = await settingsPage.inviteButton();
    await safeExpect('Invite button visibility',
      async () => await expect(inviteButton).toBeVisible(),
      errors
    );

    // await expect(inviteButton).toBeVisible();
    await inviteButton.click();

    // Fill in the email input with the generated invite email and send the invite
    const inputEmail = await settingsPage.inviteEmailInput()
    await inputEmail.fill(Invite1Email);
    const sendinvitation = await settingsPage.sendinvitation();
    await sendinvitation.click();

    // Verify the invite confirmation modal is shown
    await safeExpect('Invite confirmation modal elements',
      async () => {
        await expect(await settingsPage.modal()).toBeVisible();
        await expect(await settingsPage.modalheading()).toBeVisible();
        await expect(await settingsPage.modalheading()).toHaveText('Invite sent');
      },
      errors
    );

    // Verify the helper text in the modal
    await safeExpect('Invite confirmation helper text',
      async () => {
        await expect(await settingsPage.invitesenthelperText()).toBeVisible();
        await expect(await settingsPage.invitesenthelperText()).toHaveText(
          `An invitation with instructions on how to join ${ValidTestData.organizationName} on Centigrade has been sent to`
        );
      },
      errors
    );

    // Verify the email address in the modal
    await safeExpect('Invite email confirmation',
      async () => {
        await expect(await settingsPage.checkinviteEmail()).toBeVisible();
        await expect(await settingsPage.checkinviteEmail()).toHaveText(Invite1Email);
      },
      errors
    );

    // Verify the buttons in the modal
    await safeExpect('Modal buttons visibility',
      async () => {
        await expect(await settingsPage.Donebutton()).toBeVisible();
        await expect(await settingsPage.modalclose()).toBeVisible();
      },
      errors
    );

    // Click 'Done' to close the modal
    await safeExpect('Modal should not visible after close',
      async () => {
        const Done = await settingsPage.Donebutton()
        await Done.click();
        await expect(await settingsPage.modal()).not.toBeVisible();
      },
      errors
    );

    // Navigate to the signup page using the invite link and fill in the required details
    await safeExpect('Navigate to the signup page using the invite link and fill in the required details',
      async () => {
        await page.goto(`${baseURL}/create-account?email=${encodeURIComponent(Invite1Email)}&org=${ValidTestData.organizationName}`)
        const signUpPage = new SignUpPage(page, baseURL);
        await signUpPage.firstName(ValidTestData.firstName);
        await signUpPage.lastName(ValidTestData.lastName);
        await signUpPage.checkBox();
        await page.waitForTimeout(3000);
        await signUpPage.signUp();
        const { receivedVerificationCode } = await getGmailMessages(Invite1Email);
        await signUpPage.codeInput(receivedVerificationCode);
        await signUpPage.Password(ValidTestData.newPassword);
        await signUpPage.createAccount();
      }
    )

    // Verify the successful redirect to the listings page
    await safeExpect('Successful redirect to listings',
      async () => {
        await page.waitForURL('**/listings');
        expect(page.url()).toContain('/listings');
      },
      errors
    );

    // If there are any errors, fail the test with details
    if (errors.length > 0) {
      throw new Error(`Test failures:\n${errors.join('\n')}`);
    }
  })

  test('Verify edit member details modal elements on the "Team" tab in Settings', async ({ page, baseURL }) => {
    const errors = [];
    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Open settings and navigate to the 'Team' tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();

    const Edituser = await settingsPage.useredit(InviteEmail);
    await Edituser.click();

    // Verify modal basic elements
    await safeExpect('Basic modal elements',
      async () => {
        await expect(await settingsPage.modal()).toBeVisible();
        await expect(await settingsPage.modalheading()).toBeVisible();
        await expect(await settingsPage.modalheading()).toHaveText('Edit Member');
      },
      errors
    );

    // Verify First name field
    await safeExpect('Last name field elements',
      async () => {
        await expect(await settingsPage.EditmodalfirstName()).toBeVisible();
        await expect(await settingsPage.EditmodalfirstName()).toHaveText('First name');
        await expect(await settingsPage.EditmodalfirstNameinput()).toBeVisible();
        await expect(await settingsPage.EditmodalfirstNameinput()).toHaveValue(ValidTestData.firstName);
      },
      errors
    );

    // Verify last name field
    await safeExpect('Last name field elements',
      async () => {
        await expect(await settingsPage.EditmodallastName()).toBeVisible();
        await expect(await settingsPage.EditmodallastName()).toHaveText('Last name');
        await expect(await settingsPage.EditmodallastNameInput()).toBeVisible();
        await expect(await settingsPage.EditmodallastNameInput()).toHaveValue(ValidTestData.lastName);
      },
      errors
    );

    // Verify email field
    await safeExpect('Email field elements',
      async () => {
        await expect(await settingsPage.EditmodalEmail()).toBeVisible();
        await expect(await settingsPage.EditmodalEmail()).toHaveText('Email');
        await expect(await settingsPage.EditmodalEmailinput()).toBeVisible();
        await expect(await settingsPage.EditmodalEmailinput()).toHaveValue(InviteEmail);
        await expect(await settingsPage.EditmodalEmailhelpertext()).toBeVisible();
        await expect(await settingsPage.EditmodalEmailhelpertext()).toHaveText('This is the email they will use to log in to Centigrade and cannot be changed');
      },
      errors
    );

    // Verify phone number field
    await safeExpect('Phone number field elements',
      async () => {
        await expect(await settingsPage.Editmodalphonenumber()).toBeVisible();
        await expect(await settingsPage.Editmodalphonenumber()).toHaveText('Phone number');
        await expect(await settingsPage.Editmodalphonenumberinput()).toBeVisible();
        await expect(await settingsPage.Editmodalphonenumberinput()).toHaveValue('+1');
        await expect(await settingsPage.Editmodalphonenumberhelpertext()).toBeVisible();
        await expect(await settingsPage.Editmodalphonenumberhelpertext()).toHaveText('Used for two-factor authentication (2FA). SMS rates may apply.');
      },
      errors
    );

    // Verify member type field
    await safeExpect('Member type field initial state',
      async () => {
        await expect(await settingsPage.Editmodalmembertype()).toBeVisible();
        await expect(await settingsPage.Editmodalmembertype()).toHaveText('Member type');
        await expect(await settingsPage.Editmodalmembertypedropdown()).toBeVisible();
        await expect(await settingsPage.Editmodalmembertypeselected()).toBeVisible();
        await expect(await settingsPage.Editmodalmembertypeselected()).toHaveText('Member');
        await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();
      },
      errors
    );

    // Verify buttons
    await safeExpect('Modal buttons',
      async () => {
        await expect(await settingsPage.cancelButton()).toBeVisible();
        await expect(await settingsPage.cancelButton()).toHaveText('Cancel');
        await expect(await settingsPage.Editsave()).toBeVisible();
        await expect(await settingsPage.Editsave()).toHaveText('Save');
        await expect(await settingsPage.modalclose()).toBeVisible();
      },
      errors
    );

    const membertypedropdown = await settingsPage.Editmodalmembertypedropdown();
    await safeExpect('Member type dropdown menu elements',
      async () => {
        await membertypedropdown.click();
        await expect(await settingsPage.Editmodalmembertypemenu()).toBeVisible();
        await expect(await settingsPage.EditmodalmembertypeAdmin()).toBeVisible();
        await expect(await settingsPage.EditmodalmembertypeAdmin()).toHaveText('Admin');
        await expect(await settingsPage.EditmodalmembertypeAdminText()).toBeVisible();
        await expect(await settingsPage.EditmodalmembertypeAdminText()).toHaveText('Can invite, edit, and remove members and projects in the organization');
        await expect(await settingsPage.EditmodalmembertypeMember()).toBeVisible();
        await expect(await settingsPage.EditmodalmembertypeMember()).toHaveText('Member');
        await expect(await settingsPage.EditmodalmembertypeMemberText()).toBeVisible();
        await expect(await settingsPage.EditmodalmembertypeMemberText()).toHaveText('Can create, edit, and delete projects');
      },
      errors
    );

    await safeExpect('Dropdown menu close',
      async () => {
        await membertypedropdown.click();
        await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();
      },
      errors
    );

    // Test admin selection
    await safeExpect('Admin role selection',
      async () => {
        await membertypedropdown.click();
        const selectAdmin = await settingsPage.EditmodalmembertypeAdmin();
        await selectAdmin.click();
        await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();
        await expect(await settingsPage.Editmodalmembertypeselected()).toHaveText('Admin');
      },
      errors
    );

    await safeExpect('Member role selection',
      async () => {
        await membertypedropdown.click();
        const selectmember = await settingsPage.EditmodalmembertypeMember();
        await selectmember.click();
        await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();
        await expect(await settingsPage.Editmodalmembertypeselected()).toHaveText('Member');
      },
      errors
    );

    // Test modal close
    await safeExpect('Modal close',
      async () => {
        const modalClose = await settingsPage.modalclose();
        await modalClose.click();
        await expect(await settingsPage.modal()).not.toBeVisible();
      },
      errors
    );

    // If there are any errors, fail the test with details
    if (errors.length > 0) {
      throw new Error(`Test failures:\n${errors.join('\n')}`);
    }
  })

  test('Verify cancel and save button functionality while editing member details', async ({ page, baseURL }) => {


    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Open settings and navigate to the 'Team' tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();


    const Edituser = await settingsPage.useredit(InviteEmail);
    await Edituser.click();

    const firstName = await settingsPage.EditmodalfirstNameinput();
    await firstName.fill(ValidTestData.newFirstName);

    const membertypedropdown = await settingsPage.Editmodalmembertypedropdown();
    await membertypedropdown.click();
    const selectAdmin = await settingsPage.EditmodalmembertypeAdmin();
    await selectAdmin.click();
    await expect(await settingsPage.Editmodalmembertypeselected()).toHaveText('Admin');

    const cancelButton = await settingsPage.cancelButton();
    await cancelButton.click();
    await expect(await settingsPage.modal()).not.toBeVisible();
    await expect(await settingsPage.usertype(InviteEmail)).toHaveText('Member');

    const user = await settingsPage.user(InviteEmail);
    await user.hover();
    await Edituser.click();
    await firstName.fill(ValidTestData.newFirstName);
    await membertypedropdown.click();
    await selectAdmin.click();

    const saveButton = await settingsPage.Editsave();
    await saveButton.click();

    await page.waitForTimeout(5000);
    const userName = await settingsPage.username(InviteEmail);
    await expect(await userName.textContent()).toBe(`${ValidTestData.newFirstName} ${ValidTestData.lastName}${InviteEmail}`);
  })

  test('Verify Remove Member modal elements on the "Team" tab in Settings', async ({ page, baseURL }) => {
    const errors = [];
    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Open settings and navigate to the 'Team' tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();


    const removeUser = await settingsPage.userdelete(InviteEmail);
    await removeUser.click();

    // Verify modal basic elements
    await safeExpect('Basic modal elements',
      async () => {
        await expect(await settingsPage.modal()).toBeVisible();
        await expect(await settingsPage.modalheading()).toBeVisible();
        await expect(await settingsPage.modalheading()).toHaveText('Remove member');
      },
      errors
    );

    // Verify modal content
    await safeExpect('Modal content and warning message',
      async () => {
        await expect(await settingsPage.modalcontent()).toBeVisible();
        await expect(await settingsPage.modalcontent()).toHaveText(
          `Are you sure you want to remove ${ValidTestData.newFirstName} ${ValidTestData.lastName} from your organization? They will no longer be able to access your Organization or its projects.`
        );
        await expect(await settingsPage.unsavedChangetext()).toBeVisible();
        await expect(await settingsPage.unsavedChangetext()).toHaveText('You cannot undo this action.');
      },
      errors
    );

    // Verify modal buttons
    await safeExpect('Modal buttons state',
      async () => {
        await expect(await settingsPage.cancelButton()).toBeVisible();
        await expect(await settingsPage.cancelButton()).toBeEnabled();
        await expect(await settingsPage.removeButton()).toBeVisible();
        await expect(await settingsPage.removeButton()).toBeEnabled();
        await expect(await settingsPage.modalclose()).toBeVisible();
      },
      errors
    );

    const closeModal = await settingsPage.modalclose();
    await safeExpect('Modal close',
      async () => {
        await closeModal.click();
        await expect(await settingsPage.modal()).not.toBeVisible();
      },
      errors
    );

    // If there are any errors, fail the test with details
    if (errors.length > 0) {
      throw new Error(`Test failures:\n${errors.join('\n')}`);
    }

  })

  test('Verify cancel and remove button functionality on the Remove Member modal', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    // Open settings and navigate to the 'Team' tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const teamTab = await settingsPage.teamTab();
    await teamTab.click();

    const removeUser = await settingsPage.userdelete(InviteEmail);
    await removeUser.click();

    const cancelButton = await settingsPage.cancelButton()
    await cancelButton.click();
    await expect(await settingsPage.modal()).not.toBeVisible();

    const user = await settingsPage.user(InviteEmail);
    await user.hover();
    await removeUser.click();
    const removeButton = await settingsPage.removeButton();
    await removeButton.click();
    await page.waitForTimeout(2000);
    await expect(await settingsPage.user(InviteEmail)).not.toBeVisible();
  })

});