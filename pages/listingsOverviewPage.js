export class ListingOverviewPage {
  constructor(page) {
    this.page = page;
  }

  async navbarOverview() {
    return await this.page.getByRole('main').getByRole('navigation').getByRole('link', { name: 'Overview' });
  }

  async aISearchOverview() {
    return await this.page.locator('.AISearchOverview');
  }

  async mainContent() {
    return await this.page.locator('.main-content');
  }

  async orgName(name) {
    return await this.page.getByText(name);
  }

  async projectName(name) {
    return await this.page.getByRole('heading', { name: name });
  }

  async projectDiscription() {
    return await this.page.locator('.TruncatedText')
  }

  async keyFactor() {
    return await this.page.locator('.flex.flex-col.gap-sm', { hasText: 'Key factors' });
  }

  async keyFactorHeading() {
    return await (await this.keyFactor()).getByRole('heading', { name: 'Key factors' })
  }

  async keyFactorTable() {
    return await (await this.keyFactor()).locator('.key-value-table')
  }

  async keyFactorRow(label) {
    // Locate label cell
    const rowLabel = await this.page.locator('.key-value-table .flex.bg-subtle', { hasText: label });
    // Its next sibling is the value cell
    const rowValue = await rowLabel.locator('xpath=following-sibling::div[1]');
    return { rowLabel, rowValue };
  }

  async summaryPanel() {
    return await this.page.locator('.SummaryPanel');
  }

  async quickLinkGroup() {
    return await (await this.summaryPanel()).locator('.QuickLinkGroup')
  }

  async quickLinkGroupHeading() {
    return await (await this.quickLinkGroup()).getByRole('heading');
  }

  async quickLinkGroupTextLink(name) {
    return await (await this.quickLinkGroup()).getByText(name);
  }

  async stepLink(name) {
    return await this.page.getByRole('link', { name: name });
  }

  async location() {
    return await (await this.summaryPanel()).locator('div', { hasText: 'Location' });
  }

  async locationHeading() {
    return await (await this.location()).getByRole('heading');
  }

  async locationMap() {
    return await (await this.location()).locator('.LocationMap');
  }

  async projectImage() {
    return await this.page.getByText('Project images and videos').locator('..');
  }

  async projectImageHeading() {
    return await this.page.getByRole('heading');
  }

  async projectImageView() {
    return (await this.projectImage()).locator('.carousel-container');
  }

  async readMoreButton() {
    return await this.page.getByRole('button', { name: 'Read more' });
  }

  async readMoreModal() {
    return await this.page.getByRole('dialog');
  }

  async readMoreModalHeading() {
    return await this.page.locator('.modal-header');
  }

  async readMoreModalContent() {
    return await this.page.locator('.modal-content');
  }

  async readMoreModalClose() {
    return await this.page.locator('.modal-close-btn');
  }

}