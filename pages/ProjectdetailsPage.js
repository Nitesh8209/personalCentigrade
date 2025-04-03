export class ProjectDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async findByText(text){
    return await this.page.getByText(text);
  }

  async stepTitle(text){
    return await this.page.locator(h1).getByText(text)
  }

  async stepDescription(){
    return await this.page.locator('.step-header > span');
  }

  async formGrouplabel(text){
    return await this.page.locator(h3).getByText(text)
  }

  async fieldLabelName(label){
    return await this.page.locator('label').getByText(`${label}`, {exact: true})
  }
}
