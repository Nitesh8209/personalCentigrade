
export class DataRoom{

  constructor(page){
    this.page = page;
  }


  async dataRoomNavigation() {
    return await this.page.locator('.menu-item.nav-link').filter({hasText: 'Data rooms'});
  }

  async heading() {
    return await this.page.locator('.content-header-title');
  }

  async createButton() {
    return await this.page.getByRole('button' , {name: 'Create', exact: true});
  }

  async headingDiscription() {
    return await this.page.locator('.content-header-description');
  }

  async dataRoomTable() {
    return await this.page.locator('.data-room-table');
  }

  async tableHeader() {
    return await this.page.locator('.ag-header');
  }

  // async tableHeaderName(){
  //  return await (await this.tableHeader()).getByText('Name');
  // }

  async tableHeaderFiles() {
    return await (await this.tableHeader()).getByText('Files');
  }

  async tableHeaderPeople() {
    return await (await this.tableHeader()).getByText('People with access');
  }

  async tableNoResult() {
    return await (await this.dataRoomTable()).locator('.no-results > p');
  }

  async createDataRoomButton() {
    return await (await this.dataRoomTable()).getByRole('button', {name:'Create data room'})
  }

  async modal() {
    return await this.page.getByRole('dialog');
  }
 
  async modalHeading() {
    return await (await this.modal()).locator('.modal-header > h2');
  }

  async modalCloseIcon() {
    return await (await this.modal()).locator('.modal-header > button');
  }

  async modalContent(){
    return await (await this.modal()).locator('.modal-content');
  }

  async dataRoomnameLabel(){
    return await (await this.modalContent()).locator('.label-container');
  }

  async dataRoomnameInput(){
    return await (await this.modalContent()).locator('.input-control > input');
  }

  async modalCancelButton(){
    return await (await this.modal()).getByRole('button', {name: 'Cancel'});
  }

  async modalCreateButton(){
    return await (await this.modal()).getByRole('button', {name: 'Create'})
  }

  
  async modalSaveButton(){
    return await (await this.modal()).getByRole('button', {name: 'Save'})
  }


  async closeToast() {
    return this.page.locator('.toast-close-trigger');
  }

  async successMessagediv() {
    return this.page.locator('.toast-content > div');
  }

  async bodyContent() {
    return await (await this.dataRoomTable()).locator('.ag-body');
  }

  async bodyContentName () {
    return await (await this.dataRoomTable()).locator('.ag-body [col-id="name"]');
  }

  async bodyContentNameLink (name) {
    return await (await this.bodyContentName()).getByText(name)
  }

  async bodyContentFileCount () {
    return await (await this.dataRoomTable()).locator('.ag-body  [col-id="fileCount"]');
  }

  async bodyContentMemberCount () {
    return await (await this.dataRoomTable()).locator('.ag-body  [col-id="memberCount"]');
  }

  async bodyContentAction() {
    return await (await this.dataRoomTable()).locator('.ag-body [col-id="actions"]');
  }

  async bodyContentActionButton() {
    return await (await this.bodyContentAction()).locator('button');
  }

  async editButton() {
    return await this.page.getByRole('menuitem', {name: 'Edit'});
  }

  async deleteButton() {
    return await this.page.getByRole('menuitem', {name: 'Delete'});
  }

  async tablist() {
    return await this.page.getByRole('tablist');
  }

  async documentsTabButton() {
    return await this.page.getByRole('tab', {name: 'Documents'});
  }

  async accessTabButton() {
    return await this.page.getByRole('tab', {name: 'Access'});
  }

  async dataroomDocumnets() {
    return await this.page.locator('.data-room-documents');
  }

  async documnetsHeader() {
    return await (await this.dataroomDocumnets()).locator('.table-header');
  }

  async documnetsHeading() {
    return await (await this.documnetsHeader()).locator('span');
  }

  async AddFilesButton() {
    return await (await this.documnetsHeader()).locator('button');
  }

  async tableHeaderName() {
    return await (await this.tableHeader()).getByRole('columnheader', {name: 'Name'});
  }

  async tableHeaderUpload() {
    return await (await this.tableHeader()).getByRole('columnheader', {name: 'Upload date'});
  }

  async documetTable() {
    return await this.page.locator('.ag-overlay');
  }

  async documentTableNoResult() {
    return await (await this.documetTable()).locator('.no-results > p');
  }


  async noContentAddFileButton() {
    return await (await this.documetTable()).getByRole('button', {name:'Add files'})
  }

  async dataroomAccess() {
    return await this.page.locator('.data-room-access');
  }

  async accessHeader() {
    return await (await this.dataroomAccess()).locator('.table-header');
  }

  async accessHeading() {
    return await (await this.accessHeader()).locator('span');
  }

  async InviteButton() {
    return await (await this.accessHeader()).locator('button');
  }

  async tableHeaderOrg() {
    return await (await this.tableHeader()).getByRole('columnheader', {name: 'Organization'});
  }

  async tableHeaderStatus() {
    return await (await this.tableHeader()).getByRole('columnheader', {name: 'Status'});
  }

  async tableHeaderDate() {
    return await (await this.tableHeader()).getByRole('columnheader', {name: 'Date added'});
  }

  async noContentAccess () {
    return await (await this.dataroomAccess()).getByText('No rows to show')
  }

  async modalContentDiscription() {
    return await (await this.modalContent()).getByText('Select existing files')
  }

  async modalUploadButton(){
    return await (await this.modal()).getByRole('button', {name: 'Upload new files'});
  }

  async modalAddButton(){
    return await (await this.modal()).getByRole('button', {name: 'Add'});
  }

  async uploadModaldiscription(){
    return await (await this.modalContent()).locator('.flex > span')
  }

  async uploadModalFileUpload(){
    return await (await this.modalContent()).locator('.flex > .project-file-upload')
  }

  async fileUplaodInput(){
    return await (await this.uploadModalFileUpload()).locator('input');
  }

  async modalDoneButton(){
    return await (await this.modal()).getByRole('button', {name: 'Done'});
  }

  async fileRow() {
    return await this.page.locator("[row-index='0']");
  }

  async fileName() {
    return await (await this.fileRow()).locator('[col-id="name"]')
  }

  async fileUploadDate() {
    return await (await this.fileRow()).locator('[col-id="uploadDate"]')
  }

  async fileAction() {
    return await (await this.fileRow()).locator('[col-id="actions"]')
  }

  async fileDelete() {
    return await (await this.fileAction()).locator('button')
  }

  async inviteModalDiscription() {
    return await (await this.modalContent()).getByText('Add a buyer to your data room');
  }

  async inviteModalEmail() {
    return await (await this.modalContent()).locator('.input');
  }

  async inviteModalEmailLabel() {
    return await (await this.inviteModalEmail()).locator('.label-container');
  }

  async inviteModalEmailinput() {
    return await (await this.inviteModalEmail()).locator('.input-control > input');
  }

  async inviteModalMessage() {
    return await (await this.modalContent()).locator('.textarea');
  }

  async inviteModalMessageLabel() {
    return await (await this.inviteModalMessage()).locator('.label-container');
  }

  async inviteModalMessageinput() {
    return await (await this.inviteModalMessage()).locator('textarea');
  }

  async inviteButtonModal() {
    return await (await this.modal()).getByRole('button', {name: 'Invite'});
  }

  async accessNameEmail() {
    return await (await this.fileRow()).locator('[col-id="name"]')
  }

  async accessName() {
    return await (await this.accessNameEmail()).locator('.body-semibold');
  }

  async accessEmail() {
    return await (await this.accessNameEmail()).locator('.body-sm');
  }

  async accessOrgName() {
    return await (await this.fileRow()).locator('[col-id="organizationName"]')
  }

  async accessStatus() {
    return await (await this.fileRow()).locator('[col-id="status"]')
  }

  async accessDate() {
    return await (await this.fileRow()).locator('[col-id="createdAt"]')
  }

  async accessAction() {
    return await (await this.fileRow()).locator('[col-id="actions"]')
  }

  async accessDelete() {
    return await (await this.accessAction()).locator('button');
  }

  async removeAccessModalfirstPera() {
    return await (await this.modalContent()).getByText('Are you sure');
  }

  async removeAccessModalSecondPera() {
    return await (await this.modalContent()).getByText('You can choose');
  }

  async modalRemoveButton(){
    return await (await this.modal()).getByRole('button', {name: 'Remove'});
  }

  async deleteDataRoomModalfirstPera() {
    return await (await this.modalContent()).getByText('Are you sure');
  }

  async deleteDataRoomModalSecondPera() {
    return await (await this.modalContent()).getByText('This action cannot');
  }

  async modalDeleteButton() {
    return await this.page.getByRole('button' , {name: 'Delete', exact: true});
  }
  
}