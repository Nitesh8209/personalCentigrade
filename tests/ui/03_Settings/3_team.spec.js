import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SettingsPage } from "../../../pages/settingsPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail, getGmailMessages } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';

test.describe('Settings - Team Page UI Tests', () => {
  const { newEmail, InviteEmail } = getData('UI');

  test('Verify Settings - Team page elements are displayed correctly', async ({ page, baseURL }) => {
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

    // Verify that various elements are displayed correctly on the Settings - Team page
    await expect(await settingsPage.breadcrumb()).toBeVisible();
    await expect(await settingsPage.breadcrumb()).toHaveText('Settings');
    await expect(await settingsPage.settingsHeader()).toBeVisible();
    await expect(await settingsPage.headerTitle()).toBeVisible();
    await expect(await settingsPage.headerTitle()).toHaveText('Settings');
    await expect(await settingsPage.headerDescription()).toBeVisible();
    await expect(await settingsPage.headerDescription()).toHaveText('Manage account and organizational settings');

    // Verify tabs are visible and selected correctly   
    await expect(await settingsPage.tabList()).toBeVisible();
    await expect(await settingsPage.myAccountTab()).toBeVisible();
    await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'false');;
    await expect(await settingsPage.organizationTab()).toBeVisible();
    await expect(await settingsPage.organizationTab()).toHaveAttribute('aria-selected', 'false');;
    await expect(await settingsPage.teamTab()).toBeVisible();
    await expect(await settingsPage.teamTab()).toHaveAttribute('aria-selected', 'true');;
    await expect(await settingsPage.teamheading()).toBeVisible();
    await expect(await settingsPage.teamNamecell()).toBeVisible();
    await expect(await settingsPage.teammembertypecell()).toBeVisible();
    await expect(await settingsPage.teamstatuscell()).toBeVisible();

    // Verify the User details are displayed
    await expect(await settingsPage.user(newEmail)).toBeVisible();
    await expect(await settingsPage.username(newEmail)).toBeVisible();
    const userName = await settingsPage.username(newEmail);
    await expect(await userName.textContent()).toBe(`${ValidTestData.newFirstName} ${ValidTestData.lastName}${newEmail}`);
    await expect(await settingsPage.useremail(newEmail)).toBeVisible();
    await expect(await settingsPage.useremail(newEmail)).toHaveText(newEmail);
    await expect(await settingsPage.usertype(newEmail)).toBeVisible();
    await expect(await settingsPage.usertype(newEmail)).toHaveText('Admin');
    await expect(await settingsPage.userstatus(newEmail)).toBeVisible();
    await expect(await settingsPage.userstatus(newEmail)).toHaveText('Active');
    await expect(await settingsPage.useredit(newEmail)).toBeVisible();
    await expect(await settingsPage.userdelete(newEmail)).toBeVisible();
  })


  test('Approve the request for an already-invited user (InviteEmail) during the invite process', async ({ page, baseURL }) => {
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

    // Verify user is visible and in 'Requested' status
    await expect(await settingsPage.user(InviteEmail)).toBeVisible();
    await expect(await settingsPage.username(InviteEmail)).toBeVisible();
    const userName = await settingsPage.username(InviteEmail);
    await expect(await userName.textContent()).toBe(`${ValidTestData.firstName} ${ValidTestData.lastName}${InviteEmail}`);
    await expect(await settingsPage.useremail(InviteEmail)).toBeVisible();
    await expect(await settingsPage.useremail(InviteEmail)).toHaveText(InviteEmail);
    await expect(await settingsPage.usertype(InviteEmail)).toBeVisible();
    await expect(await settingsPage.usertype(InviteEmail)).toHaveText('Requested');
    await expect(await settingsPage.rejectButton(InviteEmail)).toBeVisible();
    await expect(await settingsPage.rejectButton(InviteEmail)).toHaveText('Reject');
    await expect(await settingsPage.approveButton(InviteEmail)).toBeVisible();
    await expect(await settingsPage.approveButton(InviteEmail)).toHaveText('Approve');
    await expect(await settingsPage.useredit(InviteEmail)).toBeVisible();
    await expect(await settingsPage.userdelete(InviteEmail)).toBeVisible();

    // Approve the invitation and check the changes
    const ApproveButton = await settingsPage.approveButton(InviteEmail);
    await ApproveButton.click();
    await expect(await settingsPage.usertype(InviteEmail)).toHaveText('Member');
    await expect(await settingsPage.userstatus(InviteEmail)).toBeVisible();
    await expect(await settingsPage.userstatus(InviteEmail)).toHaveText('Active');
    await expect(await settingsPage.rejectButton(InviteEmail)).not.toBeVisible();
    await expect(await settingsPage.approveButton(InviteEmail)).not.toBeVisible();
  })

  test('Sign up a new user, reject the request, and verify rejection', async ({ page, baseURL }) => {

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

    // Verify user is in 'Requested' status and reject
    await expect(await settingsPage.user(RejectEmail)).toBeVisible();
    await expect(await settingsPage.username(RejectEmail)).toBeVisible();
    const userName = await settingsPage.username(RejectEmail);
    await expect(await userName.textContent()).toBe(`${ValidTestData.firstName} ${ValidTestData.lastName}${RejectEmail}`);
    await expect(await settingsPage.useremail(RejectEmail)).toBeVisible();
    await expect(await settingsPage.useremail(RejectEmail)).toHaveText(RejectEmail);
    await expect(await settingsPage.usertype(RejectEmail)).toBeVisible();
    await expect(await settingsPage.usertype(RejectEmail)).toHaveText('Requested');
    await expect(await settingsPage.rejectButton(RejectEmail)).toBeVisible();
    await expect(await settingsPage.rejectButton(RejectEmail)).toHaveText('Reject');
    await expect(await settingsPage.approveButton(RejectEmail)).toBeVisible();
    await expect(await settingsPage.approveButton(RejectEmail)).toHaveText('Approve');
    await expect(await settingsPage.useredit(RejectEmail)).toBeVisible();
    await expect(await settingsPage.userdelete(RejectEmail)).toBeVisible();

    // Reject the user and verify they are removed
    const RejectButton = await settingsPage.rejectButton(RejectEmail);
    await RejectButton.click();
    await expect(await settingsPage.user(RejectEmail)).not.toBeVisible();
  })

  test('Verify Invite User modal display', async ({ page, baseURL }) => {

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
    await expect(inviteButton).toBeVisible();
    await inviteButton.click();

    // Verify that the Invite User modal is displayed with the correct heading and helper text
    await expect(await settingsPage.inviteUserModal()).toBeVisible();
    await expect(await settingsPage.inviteheading()).toBeVisible();
    await expect(await settingsPage.inviteheading()).toHaveText('Invite users');
    await expect(await settingsPage.invitehelperText()).toBeVisible();
    await expect(await settingsPage.invitehelperText()).toHaveText("Invite team members to your organization. We'll ask new users to enter their details when they sign up.");

    // Verify form elements in the modal (email input, buttons)
    await expect(await settingsPage.inviteEmail()).toBeVisible();
    await expect(await settingsPage.inviteEmail()).toHaveText('Email');
    await expect(await settingsPage.inviteEmailInput()).toBeVisible();
    await expect(await settingsPage.inviteEmailInput()).toHaveAttribute('type', 'email');
    await expect(await settingsPage.inviteAdduserbutton()).toBeVisible();
    await expect(await settingsPage.modalclose()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.sendinvitation()).toBeVisible();
    await expect(await settingsPage.sendinvitation()).toBeEnabled();

    // Test adding a second email input field and removing it
    const AddUser = await settingsPage.inviteAdduserbutton();
    await AddUser.click();
    await expect(await settingsPage.inviteEmailsecondinput()).toBeVisible();
    await expect(await settingsPage.inviteEmailsecondinput()).toHaveAttribute('type', 'email');
    await expect(await settingsPage.inviteremoveEmailsecondinput()).toBeVisible();

    const closeSecondInput = await settingsPage.inviteremoveEmailsecondinput();
    await closeSecondInput.click();
    await expect(await settingsPage.inviteEmailsecondinput()).not.toBeVisible();
  })


  test('Invite a user to join the organization and auto-approve the invite', async ({ page, baseURL }) => {

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
    await expect(inviteButton).toBeVisible();
    await inviteButton.click();

    // Fill in the email input with the generated invite email and send the invite
    const inputEmail = await settingsPage.inviteEmailInput()
    await inputEmail.fill(Invite1Email);

    const sendinvitation = await settingsPage.sendinvitation();
    await sendinvitation.click();

    // Verify the invite confirmation modal is shown
    await expect(await settingsPage.modal()).toBeVisible();
    await expect(await settingsPage.modalheading()).toBeVisible();
    await expect(await settingsPage.modalheading()).toHaveText('Invite sent');
    await expect(await settingsPage.invitesenthelperText()).toBeVisible();
    await expect(await settingsPage.invitesenthelperText()).toHaveText(`An invitation with instructions on how to join ${ValidTestData.organizationName} on Centigrade has been sent to`);
    await expect(await settingsPage.checkinviteEmail()).toBeVisible();
    await expect(await settingsPage.checkinviteEmail()).toHaveText(Invite1Email);
    await expect(await settingsPage.Donebutton()).toBeVisible();
    await expect(await settingsPage.modalclose()).toBeVisible();

    // Step 5: Click 'Done' to close the modal
    const Done = await settingsPage.Donebutton()
    await Done.click();

    // Navigate to the signup page using the invite link and fill in the required details
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
    await page.waitForURL('**/listings');
    expect(page.url()).toContain('/listings');

  })

  test('Verify edit member details modal elements on the "Team" tab in Settings', async ({ page, baseURL }) => {

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

    await expect(await settingsPage.modal()).toBeVisible();
    await expect(await settingsPage.modalheading()).toBeVisible();
    await expect(await settingsPage.modalheading()).toHaveText('Edit Member');
    await expect(await settingsPage.EditmodalfirstName()).toBeVisible();
    await expect(await settingsPage.EditmodalfirstName()).toHaveText('First name');
    await expect(await settingsPage.EditmodalfirstNameinput()).toBeVisible();
    await expect(await settingsPage.EditmodalfirstNameinput()).toHaveValue(ValidTestData.firstName);
    await expect(await settingsPage.EditmodallastName()).toBeVisible();
    await expect(await settingsPage.EditmodallastName()).toHaveText('Last name');
    await expect(await settingsPage.EditmodallastNameInput()).toBeVisible();
    await expect(await settingsPage.EditmodallastNameInput()).toHaveValue(ValidTestData.lastName);
    await expect(await settingsPage.EditmodalEmail()).toBeVisible();
    await expect(await settingsPage.EditmodalEmail()).toHaveText('Email');
    await expect(await settingsPage.EditmodalEmailinput()).toBeVisible();
    await expect(await settingsPage.EditmodalEmailinput()).toHaveValue(InviteEmail);
    await expect(await settingsPage.EditmodalEmailhelpertext()).toBeVisible();
    await expect(await settingsPage.EditmodalEmailhelpertext()).toHaveText('This is the email they will use to log in to Centigrade and cannot be changed');
    await expect(await settingsPage.Editmodalphonenumber()).toBeVisible();
    await expect(await settingsPage.Editmodalphonenumber()).toHaveText('Phone number');
    await expect(await settingsPage.Editmodalphonenumberinput()).toBeVisible();
    await expect(await settingsPage.Editmodalphonenumberinput()).toHaveValue('+1');
    await expect(await settingsPage.Editmodalphonenumberhelpertext()).toBeVisible();
    await expect(await settingsPage.Editmodalphonenumberhelpertext()).toHaveText('Used for two-factor authentication (2FA). SMS rates may apply.');
    await expect(await settingsPage.Editmodalmembertype()).toBeVisible();
    await expect(await settingsPage.Editmodalmembertype()).toHaveText('Member type');
    await expect(await settingsPage.Editmodalmembertypedropdown()).toBeVisible();
    await expect(await settingsPage.Editmodalmembertypeselected()).toBeVisible();
    await expect(await settingsPage.Editmodalmembertypeselected()).toHaveText('Member');
    await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toHaveText('Cancel');
    await expect(await settingsPage.Editsave()).toBeVisible();
    await expect(await settingsPage.Editsave()).toHaveText('Save');
    await expect(await settingsPage.modalclose()).toBeVisible();

    const membertypedropdown = await settingsPage.Editmodalmembertypedropdown();
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

    await membertypedropdown.click();
    await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();

    await membertypedropdown.click();
    const selectAdmin = await settingsPage.EditmodalmembertypeAdmin();
    await selectAdmin.click();
    await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();
    await expect(await settingsPage.Editmodalmembertypeselected()).toHaveText('Admin');


    await membertypedropdown.click();
    const selectmember = await settingsPage.EditmodalmembertypeMember();
    await selectmember.click();
    await expect(await settingsPage.Editmodalmembertypemenu()).not.toBeVisible();
    await expect(await settingsPage.Editmodalmembertypeselected()).toHaveText('Member');

    const modalClose = await settingsPage.modalclose();
    await modalClose.click();
    await expect(await settingsPage.modal()).not.toBeVisible();
  })


  test('Verify cancel and save button functionality while editing member details', async({page, baseURL})=>{


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
    await expect(await settingsPage.modal()).toBeVisible();
    await expect(await settingsPage.modalheading()).toBeVisible();
    await expect(await settingsPage.modalheading()).toHaveText('Remove member');
    await expect(await settingsPage.modalcontent()).toBeVisible();
    await expect(await settingsPage.modalcontent()).toHaveText(`Are you sure you want to remove ${ValidTestData.newFirstName} ${ValidTestData.lastName} from your organization? They will no longer be able to access your Organization or its projects.`);
    await expect(await settingsPage.unsavedChangetext()).toBeVisible();
    await expect(await settingsPage.unsavedChangetext()).toHaveText('You cannot undo this action.');
    await expect(await settingsPage.cancelButton()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.removeButton()).toBeVisible();
    await expect(await settingsPage.removeButton()).toBeEnabled();
    await expect(await settingsPage.modalclose()).toBeVisible();

    const closeModal = await settingsPage.modalclose();
    await closeModal.click();
    await expect(await settingsPage.modal()).not.toBeVisible();
  })

  test('Verify cancel and remove button functionality on the Remove Member modal', async ({page, baseURL}) => {
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