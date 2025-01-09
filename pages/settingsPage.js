export class SettingsPage {
  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async settingButton() {
   return await this.page.locator(".nav-items > a:last-child");
}

  async breadcrumb() {
    return await this.page.locator('li.breadcrumb > a');
  }

  async settingsHeader() {
    return await this.page.locator('div.settings-header');
  }

  async headerTitle() {
    return await this.page.locator('div.settings-header > h1');
  }

  async headerDescription() {
    return await this.page.locator('div.settings-header > p');
  }

  async tabList() {
    return await this.page.locator('div[role="tablist"]');
  }

  async myAccountTab() {
    return await this.page.locator('button[role="tab"]', { hasText: 'My account' });
  }

  async organizationTab() {
    return await this.page.locator('button[role="tab"]', { hasText: 'Organization' });
  }

  async teamTab() {
    return await this.page.locator('button[role="tab"]', { hasText: 'Team' });
  }

  async firstName() {
    return await this.page.getByLabel('My account').getByText('First name');
  }

  async firstNameInput() {
    return await this.page.getByRole('textbox', { name: 'First name' });
  }


  async lastName() {
    return await this.page.getByLabel('My account').getByText('Last name');
  }

  async lastNameInput() {
    return await this.page.getByRole('textbox', { name: 'Last name' });
  }

  async email() {
    return await this.page.getByLabel('My account').getByText('Email', { exact: true });
  }

  async emailInput() {
    return await this.page.getByRole('textbox', { name: 'Email' });
  }

  async emailText() {
    return await this.page.getByLabel('My account').getByText('This email is used as your');
  }

  async phoneNumber() {
    return await this.page.getByLabel('My account').getByText('Phone number');
  }

  async phoneNumberInput() {
    return await this.page.getByLabel('My account').getByTestId('phone-number-input');
  }

  async phoneNumberText() {
    return await this.page.getByLabel('My account').getByText('Used for two-factor');
  }

  async passwordText() {
    return await this.page.getByLabel('My account').getByText('Password', { exact: true });
  }

  async passwordButton() {
    return await this.page.getByRole('Button', { name: 'Change password' });
  }

  async cancelButton() {
    return await this.page.getByRole('Button', { name: 'Cancel' });
  }

  async saveButton() {
    return await this.page.getByRole('Button', { name: 'Save changes' });
  }

  async unsavedChangeModal() {
    return await this.page.getByLabel('Unsaved changes');
  }

  async unsavedChangeheading() {
    return await this.page.getByRole('heading', { name: 'Unsaved changes' });
  }

  async unsavedChangediscription() {
    return await this.page.getByText('Are you sure you want to');
  }

  async unsavedChangetext() {
    return await this.page.getByText('You cannot undo this action.');
  }

  async discardButton() {
    return await this.page.getByRole('button', { name: 'Discard' });
  }

  async saveMessage() {
    return await this.page.locator('.toast-content > div:nth-child(1)');
  }

  async orgfunctions() {
    return await this.page.getByLabel('Organization', { exact: true }).getByText('Organization functions');
  }

  async orgfunctiondropdown() {
    return await this.page.getByRole('combobox', { name: 'Organization functions' });
  }

  async selectOrganizationFunctions(options) {
    const dropdown = await this.orgfunctiondropdown();
    await dropdown.click();

    for (const option of options) {
        await this.page.getByLabel('Organization', { exact: true }).getByText(option).click();
    }
}

  async orgfunctiondropdownoption() {
    return await this.page.locator('div.select-option');
  }

  async orgfunctiondropdownsaelected() {
    return await this.page.getByLabel('Organization', { exact: true }).locator('span.select-value.multiple div.badge');
  }

  async orgfunctionremoveoption() {
    return await this.page.getByLabel('Organization', { exact: true }).locator('.badge-delete-btn');
  }
  

  async orgfunctionhelperText() {
    return await this.page.getByLabel('Organization', { exact: true }).getByText('Your organization can be');
  }

  async orgName() {
    return await this.page.getByLabel('Organization', { exact: true }).getByText('Organization name');
  }

  async orgNameInput() {
    return await this.page.getByRole('textbox', { name: 'Organization name' });
  }

  async orgNamehelpertext() {
    return await this.page.getByLabel('Organization', { exact: true }).getByText('NOTE: Changes made here will');
  }

  async orgAddress() {
    return await this.page.getByRole('heading', { name: 'Address' });
  }

  async orgstreetAddress() {
    return await this.page.getByLabel('Organization', { exact: true }).getByText('Street address');
  }

  async orgstreetAddressInput() {
    return await this.page.getByRole('textbox', { name: 'Street address' });
  }

  async orgcity() {
    return await this.page.getByLabel('Organization', { exact: true }).getByText('City', { exact: true });
  }

  async orgcityInput() {
    return await this.page.getByRole('textbox', { name: 'City' });
  }

  async orgCountry() {
    return await this.page.getByLabel('Organization', { exact: true }).getByText('Country');
  }

  async orgcountryInput() {
    return await this.page.getByRole('combobox', { name: 'Country' });
  }

  async teamheading() {
    return await this.page.getByRole('heading', { name: 'Team members' });
  }

  async teamNamecell() {
    return await this.page.getByRole('columnheader', { name: 'Name' });
  }

  async teammembertypecell() {
    return await this.page.getByRole('columnheader', { name: 'Member type' });
  }

  async teamstatuscell() {
    return await this.page.getByRole('columnheader', { name: 'Status' });
  }
  
   async user(newEmail) {
    return await this.page.getByRole('row', { name: newEmail });
   }
   
   async username(newEmail) {
    return await this.page.getByRole('gridcell', { name: newEmail }).nth(0);
   }

   async useremail(newEmail) {
    return await this.page.getByRole('gridcell', { name: newEmail }).locator('.body-sm.text-secondary');
   }

   async usertype(newEmail) {
    return await this.page.getByRole('row', { name: newEmail }).locator('[col-id="memberType"]');
   }

   async userstatus(newEmail) {
    return await this.page.getByRole('row', { name: newEmail }).locator('[col-id="status"]');
   }

   async usereditdeletebutton(newEmail) {
    const row = this.page.getByRole('row', { name: newEmail });
    await row.hover();
    return row.locator('.ag-action-cell');
     }

   async useredit() {
    return await this.page.getByRole('menuitem', { name: 'Edit' });
  }

   async userdelete() {
    return await this.page.getByRole('menuitem', { name: 'Remove' });
    }

   async rejectButton(Email) {
    return await this.page.getByRole('row', { name: Email }).locator('.approve-request .btn-outline.btn-primary.btn-sm');
   }

   async approveButton(Email) {
    return await this.page.getByRole('row', { name: Email }).locator('.approve-request .btn-solid.btn-primary.btn-sm');
   }

   async inviteButton() {
    return await this.page.getByRole('button', { name: '+ Invite user' });
   }

   async inviteUserModal() {
    return await this.page.getByLabel('Invite users');
   }

   async inviteheading() {
    return await this.page.getByRole('heading', { name: 'Invite users' });
   }

   async invitehelperText() {
    return await this.page.getByText('Invite team members to your');
   }

   async inviteEmail() {
    return await this.page.getByText('Email', { exact: true });
   }

   async inviteEmailInput() {
    return await this.page.getByPlaceholder('Enter email');
   }

   async inviteAdduserbutton() {
    return await this.page.getByRole('button', { name: '+ Add user' });
   }

   async inviteEmailsecondinput() {
    return await this.page.locator('input[name="users\\.1\\.email"]');
   }

   async inviteremoveEmailsecondinput() {
    return await this.page.getByLabel('Invite users').locator('form').getByRole('button').nth(1);
   }

   async modalclose() {
    return await this.page.locator('.modal-header > button');
   }

   async sendinvitation() {
    return await this.page.getByRole('button', {name: 'Send invitation'});
   }

   async modal() {
    return await this.page.locator('.modal');
   }

   async modalheading() {
    return await this.page.locator('.modal-title');
   }

   async invitesenthelperText() {
    return await this.page.locator('.flex.flex-col.gap-sm > p');
   }

   async checkinviteEmail() {
    return await this.page.locator('.unordered-list > li');
   }

   async Donebutton() {
    return await this.page.getByRole('button', {name: 'Done'});
   }

   async EditmodalfirstName() {
    return await this.page.getByText('First name');
   }

   async EditmodalfirstNameinput() {
    return await this.page.getByLabel('First name');
   }

   async EditmodallastName() {
    return await this.page.getByText('Last name');
   }

   async EditmodallastNameInput() {
    return await this.page.getByLabel('Last name');
   }

   async EditmodalEmail() {
    return await this.page.getByText('Email', {exact: true});
   }

   async EditmodalEmailinput() {
    return await this.page.getByLabel('Email');
   }

   async EditmodalEmailhelpertext() {
    return await this.page.getByText('This is the email they will');
   }

   async Editmodalphonenumber() {
    return await this.page.getByText('Phone number');
   }

   async Editmodalphonenumberinput() {
    return await this.page.getByTestId('phone-number-input');
   }

   async Editmodalphonenumberhelpertext() {
    return await this.page.getByText('Used for two-factor');
   }

   async Editmodalmembertype() {
    return await this.page.locator('.label.select-label');
   }

   async Editmodalmembertypedropdown() {
    return await this.page.locator('.select-trigger');
   }

   async Editmodalmembertypemenu() {
    return await this.page.locator('.select-menu');
   }
   
   async EditmodalmembertypeAdmin() {
    return await this.page.getByRole('listbox').getByText('Admin');
   }

   async EditmodalmembertypeAdminText() {
    return await this.page.getByText('Can invite, edit, and remove');
   }

   async EditmodalmembertypeMember() {
    return await this.page.locator('.select-menu').getByText('Member', { exact: true });
   }

   async EditmodalmembertypeMemberText() {
    return await this.page.getByText('Can create, edit, and delete');
   }

   async Editmodalmembertypeselected() {
    return await this.page.locator('.select-value');
   }

   async Editsave() {
    return await this.page.getByRole('button', {name: 'save'});
   }

   async modalcontent() {
    return await this.page.locator('.modal-content > :first-child > :first-child');
   }

   async removeButton() {
    return await this.page.getByRole('Button', { name: 'Remove' });
  }
  
}

