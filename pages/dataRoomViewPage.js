
export class dataRoomViewPage {
  constructor(page) {
    this.page = page;
  }

  async dataRoomNavigation() {
    return await this.page.locator('.sidebar').getByRole('link', { name: 'Data rooms' });
  }

  async mainContent() {
    return await this.page.locator('.content');
  }

  async stepTitle() {
    return await (await this.mainContent()).locator('.step-title');
  }

  async requestInfoButton() {
    return await (await this.mainContent()).locator('div').nth(1).getByRole('button', { name: 'Request info' });
  }

  async table() {
    return await this.page.locator('.table');
  }

  async tableHeader() {
    return await this.page.locator('.ag-header');
  }

  async tableHeaderName() {
    return await (await this.tableHeader()).getByText('Name');
  }

  async tableHeaderFiles() {
    return await (await this.tableHeader()).getByText('Files');
  }

  async tableHeaderDate() {
    return await (await this.tableHeader()).getByText('Date added');
  }

  async noResult() {
    return await (await this.table()).locator('.no-results > p');
  }

  async TableRequestInfoButton() {
    return await (await this.table()).getByRole('button', { name: 'Request info' });
  }


  async modal() {
    return await this.page.getByRole('dialog');
  }
 
  async modalHeading() {
    return await (await this.modal()).locator('.modal-header > h2');
  }

  async modalContent(){
    return await (await this.modal()).locator('.modal-content');
  }

  async messageLabel(){
    return await (await this.modalContent()).locator('.label-container');
  }

  async messageInput(){
    return await (await this.modalContent()).locator('textarea');
  }

  async modalCancelButton(){
    return await (await this.modal()).getByRole('button', {name: 'Cancel'});
  }

  async modalSendButton(){
    return await (await this.modal()).getByRole('button', {name: 'Send request'});
  }

  async successMessagediv() {
    return this.page.locator('.toast-content > .toast-message');
  }

  async successMessageHeader() {
    return this.page.locator('.toast-content > .toast-title');
  }

  async backDataRoomButton() {
    return await this.page.locator('.text-link');
  }

  async tableHeaderType() {
    return await (await this.tableHeader()).getByText('Type');
  }

  async fileRow() {
    return await this.page.locator("[row-index='0']");
  }

  async fileName() {
    return await (await this.fileRow()).locator('[col-id="name"]').locator('.body-semibold');
  }

  async fileType() {
    return await (await this.fileRow()).locator('[col-id="type"]')
  }

  async fileDate() {
    return await (await this.fileRow()).locator('[col-id="uploadDate"]')
  }


}