export class AiSummary {
  constructor(page){
    this.page = page;
  }

  async aiSummaryNavigation() {
    return await this.page.locator('.menu-item.nav-link').filter({hasText: 'AI summaries'});
  }

  async aiSummaries(){
    return await this.page.locator('.ai-summaries');
  }

  async contentHeader() {
    return await this.page.getByRole('heading', { name: 'AI summaries' });
  }

  async contentDiscription() {
    return await this.page.locator('.content-header-description');
  }

  async topicHeading(label) {
    return await (await this.aiSummaries()).getByRole('heading', { name: label, exact: true });
  }

  async stepGroupHeading(label) {
    return await (await this.aiSummaries()).getByRole('heading', { name: label, exact: true });
  }

  async stepLabel(label) {
    return await (await this.aiSummaries()).locator('label').filter({ hasText: label });
  }

  async stepAccordion(label) {
    return await (await this.aiSummaries()).locator('.accordion-item').filter({
      has: this.page.locator('label', { hasText: label })
    });
  }

  async accordionItemBadge(label) {
    return await (await this.stepAccordion(label)).locator('.accordion-item-badge');
  }

  async stepAccordionButton(label) {
    return await (await this.stepAccordion(label)).locator('.accordion-item-trigger');
  }

  async accordionItemContent(label) {
    return await (await this.stepAccordion(label)).locator('.prose');
  }

  async stepAccordionThumbsRating(label) {
    return await (await this.stepAccordion(label)).locator('.thumbs-rating');
  }

  async stepAccordionViewProjectButton(label, rating) {
    return await (await this.stepAccordion(label)).getByRole('button', { name: 'View in project' });
  }

  async buyerAiSummaryContent(Content) {
    return await this.page.locator('.prose').getByText(Content);
  }

  async aiSummaryModal() {
    return await this.page.locator('.modal');
  }

}