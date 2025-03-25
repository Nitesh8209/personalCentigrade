import { expect } from "@playwright/test";

export class ProjectListings {

  constructor(page) {
    this.page = page;
  }

  async pageHeader() {
    return await this.page.locator('.page-header');
  }

  async projectTag() {
    return await this.page.locator('.project-organization');
  }

  async projectTitle() {
    return await this.page.locator('.content-header > h1');
  }

  async getInTouch() {
    return await this.page.getByRole('button', { name: 'Get in touch' });
  }

  async projectDetails() {
    return await this.page.locator('.project-details');
  }


  async validateProjectDetailsList(index, keyName){
    const key = await (await this.projectDetails()).locator('.project-details-list').nth(index);
    await expect((key).locator('.project-details-key')).toHaveText(keyName);
    await expect((key).locator('.label-container.project-details-value')).toBeVisible();
  }

  async getInTouchModal() {
    return await this.page.getByRole('dialog');
  } 

  async modalHeader() {
    return await this.page.locator('.modal-header');
  }

  async getInTouchForm(){
    return await this.page.locator('.get-in-touch-form');
  }

  async getInTouchFormPeragraph(){
    return (await this.getInTouchForm()).locator('p');
  }

  async getInTouchFormLabel(){
    return (await this.getInTouchForm()).locator('.label-container');
  }

  async getInTouchFormInput(){
    return (await this.getInTouchForm()).getByLabel('Your message');
  }

  async modalCancelButton(){
    return await this.page.getByRole('button', { name: 'Cancel' });
  }

  async modalSendButton(){
    return await this.page.getByRole('button', { name: 'Send' });
  } 

  async topicName(label){
    return await this.page.locator('.tab-list > li').getByText(label);
  }

  async stepGroup(label){
    return await this.page.locator('.left-nav').locator('.nav-accordion-header ').getByText(label);
  }
}