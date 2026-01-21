export class Frameworks{
  constructor(page) {
    this.page = page;
    
    this.frameworks = page.locator('.select.multiple');
    this.frameworkLabel = this.frameworks.locator('label');
    this.frameworkInput = this.frameworks.locator('button');
    this.frameworkHelperText = this.frameworks.locator('.select-helper-text');
    this.frameworksListbox = page.getByRole('listbox');
    this.frameworkOptions = this.frameworksListbox.getByRole('option');

    this.frameworkSelect = page.locator('.framework-select');
    this.frameworkSelectLabel = page.locator('.framework-select-label')
    this.frameworkSelectButton = this.frameworkSelect.locator('button');
    this.frameworkSelectMenu = this.frameworkSelect.getByRole('menu');

    this.dialog = page.getByRole('dialog');
    this.dialogHeader = this.dialog.locator('.modal-header');
    this.dialogContent = this.dialog.locator('.modal-content');
    this.dialogContentPera = this.dialogContent.locator('p');
    this.saveButton = this.dialog.getByRole('button', { name: 'Save' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });

    this.confirmRemovalHeading = this.dialogContent.locator('h3');
    this.confirmRemovalBadgeList = this.dialogContent.locator('.badge-list');
    this.confirmRemovalFristPera = this.dialogContent.getByText('Removing frameworks will remove any unique fields for that framework and may result in loss of any data entered on those fields.');
    this.confirmRemovalSecondPera = this.dialogContent.getByText('This action cannot be undone.');

    this.backButton = this.dialog.getByRole('button', { name: 'Back' });
    this.confirmButton = this.dialog.getByRole('button', { name: 'Confirm' });
    }

  frameworkOptionByName(name) {
    return this.frameworksListbox.getByRole('option', {
      name,
      exact: true,
    });
  }

  async selectMultipleFramwork(frameworks){
    await this.frameworkInput.click();
    for (const framework of frameworks) {
          await this.frameworkOptionByName(framework).click();
      }
  }

  menuItemByName(name){
    return this.frameworkSelectMenu.getByRole('menuitem', { name, exact: true });
  }

  frameworkCheckboxByName(name){
    return this.dialogContent.getByRole('checkbox', { name, exact: true });
  }

  frameworkLabelByName(name){
    return this.dialogContent.locator('.checkbox-label', { hasText: name });
  }

  
}