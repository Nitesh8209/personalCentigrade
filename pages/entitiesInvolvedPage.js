export class EntitiesInvolvedPage {
  constructor(page){
    this.myPage = page;
  }

  async navigation(){
    return await this.myPage.getByRole('link', { name: 'Entities involved' });
  }

  async entityHeader(){
    return await this.myPage.locator('.entities-header');
  }

  async entityHeaderTitle(){
    return await (await this.entityHeader()).getByRole('heading', { name: 'Entities involved' });
  }

  async entityHeaderDescription(){
    return await (await this.entityHeader()).locator('.entities-description');
  }

  async addEntities() {
    return await this.myPage.locator('.add-entities');
  }

  async addEntitiesParagraph() {
    return await (await this.addEntities()).locator('p');
  }

  async addEntitiesButton() {
    return await (await this.addEntities()).getByRole('button', { name: '+ Add entity' });
  }

  async entityList() {
    return await this.myPage.locator('.table');
  }

  async projectRoleHeader() {
    return await this.myPage.getByText('Project role');
  }

  async organizationHeader() {
    return await (await this.entityList()).getByText('Organization');
  }

  async noRow() {
    return await this.myPage.getByText('No rows to show');
  }

  async addEntityModal() {
    return await this.myPage.locator('.modal');
  }

  async addEntityModalTitle() {
    return await (await this.addEntityModal()).getByRole('heading', { name: 'Add Entity' });
  }

  async addEntityRole() {
    return await (await this.addEntityModal()).getByText('Role');
  }

  async addEntityRoleSelect() {
    return await (await this.addEntityModal()).getByRole('combobox', { name: 'Role' });
  }

  async addEntityOrganizationLabel() {
    return await (await this.addEntityModal()).getByText('Organization name');
  }

  async addEntityOrganizationInput() {
    return await (await this.addEntityModal()).getByRole('textbox', { name: 'Organization name' });
  }

  async saveButton() {
    return await (await this.addEntityModal()).getByRole('button', { name: 'Save' });
  }

   async cancelButton() {
    return await (await this.addEntityModal()).getByRole('button', { name: 'Cancel' });
  }
  
  async selectRole() {
    return await this.myPage.getByRole('listbox', { name: 'Role' });
  }

  async selectOrganizationInput() {
    return await this.myPage.locator('.autocomplete-menu');
  }

  async rowGroup() {
    return await this.myPage.locator("[row-index='0']");
  }

  async rowProjectRole(role) {
    return await (await this.rowGroup()).locator('.ag-cell-value').getByText(role);
  }

    async rowOrganization(name) {
    return await (await this.rowGroup()).locator('.ag-cell-value').getByText(name);
  }

  async editButton(){
    return await (await this.rowGroup()).getByRole('button').nth(0);
  }

    async deleteButton(){
    return await (await this.rowGroup()).getByRole('button').nth(1);
  }

  async modal(){
    return await this.myPage.locator('.modal');
  }

  async modalHeading() {
    return await (await this.modal()).getByRole('heading');
  }

  async modalContent() {
   return await (await this.modal()).getByText('Are you sure you want to remove "automationProject1" from the project? You');
  }

  async modalDeleteButton() {
    return await (await this.modal()).getByRole('button', {name: 'Delete'}) 
  }

  async successMessagediv() {
    return this.myPage.locator('.toast-content > .toast-message');
  }


}