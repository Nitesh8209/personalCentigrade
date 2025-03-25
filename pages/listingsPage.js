import { project } from '../tests/data/projectData';

export class ListingPage {
  constructor(page){
    this.page = page;
  }

  async navigation(){
    return await this.page.locator('.navbar-header');
  }

  async logo(){
    return await (await this.navigation()).getByRole('img');
  }

  async login(){
    return await this.page.getByRole('link', { name: 'Log in' });
  }

  async createAccount(){
    return await this.page.getByRole('link', { name: 'Create Account' });
  }

  async pageContent(){
    return await this.page.locator('.page-content');
  }

  async buyerProjectHeader(){
    return await this.page.locator('.buyer-projects__header');
  }

  async heading(){
    return (await this.buyerProjectHeader()).locator('.content-header > h1');
  }

  async headingBase(){
    return (await this.buyerProjectHeader()).locator('.content-header-description');
  }

  async buyerProjectHeaderNotice(){
    return await this.page.locator('.buyer-projects__header-notice');
  }

  async buyerProjectHeaderNoticeText(){
    return await (await this.buyerProjectHeaderNotice()).locator('span');
  }

  async buyerProjectHeaderNoticeRMIIcon(){
    return await (await this.buyerProjectHeaderNotice()).locator('.buyer-projects__header-notice-logo');
  }

  async buyerProjectHeaderNoticeRMIIconText(){
    return await this.page.getByLabel('RMI data framework icon');
  }

  async projectList(){
    return await this.page.locator('.space-y-4');
  }

  async projectListItem(){
    return (await this.projectList()).locator('.card.buyer-projects__card');
  }

  async firstprojectListItem(){
    return (await this.projectListItem()).filter({hasText: project.uiProjectName}).first();
  }

  async projectItemImg(){
    return (await this.firstprojectListItem()).locator('img');
  }

  async projectItemCardContent(){
    return (await this.firstprojectListItem()).locator('.buyer-projects__card-content');
  }

  async projectItemCardContentMain(){
    return (await this.projectItemCardContent()).locator('.buyer-projects__card-content-main');
  }

  async projectItemCardContentMainOrg(){
    return (await this.projectItemCardContentMain()).locator('.buyer-projects__card-content-main-organization');
  }

  async projectItemCardContentMainTitle(){
    return (await this.projectItemCardContentMain()).locator('h2 > a');
  }

  async projectItemCardContentMainText(){
    return (await this.projectItemCardContentMain()).locator('span').first();
  }

  async projectItemCardContentFooter(){
    return (await this.projectItemCardContent()).locator('.buyer-projects__card-content-footer');
  }

  async projectItemCardContentFooterStatus(){
    return await (await this.projectItemCardContentFooter()).getByText('Status');
  }

  async projectItemCardContentFootercreditIssuer(){
    return await (await this.projectItemCardContentFooter()).getByText('Credit Issuer');
  }

  async projectItemCardContentFooterType(){
    return await (await this.projectItemCardContentFooter()).getByText('Type');
  }

  async projectItemCardDetails(){
    return (await this.firstprojectListItem()).locator('.buyer-projects__card-details');
  }

  async projectItemCardDetailsProjectScale(){
    return (await this.projectItemCardDetails()).getByText('Project Scale');
  }

  async projectItemCardDetailsLocation(){
    return (await this.projectItemCardDetails()).getByText('Location');;
  }

  async listings(){
    return await this.page.locator('a[href="/listings"]');
  }

  async needHelp(){
    return await this.page.getByRole('button', {name: 'Need help'});
  }

  async ProjectBreadcrumb(){
    return await this.page.getByRole('link', {name: 'Projects'});
  }

}