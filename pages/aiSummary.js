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

  async stepLabel(label, stepGroupLabel) {
    return await (await this.aiSummaries()).locator('.ai-summaries-step-group', { has: this.page.locator('h3', { hasText: stepGroupLabel }) }).locator('label').filter({ hasText: label });
  }

  async stepAccordion(label, stepGroupLabel) {
    return await (await this.aiSummaries()).locator('.ai-summaries-step-group', { has: this.page.locator('h3', { hasText: stepGroupLabel }) }).locator('.accordion-item').filter({
      has: this.page.locator('label', { hasText: label })
    });
  }

  async accordionItemBadge(label, stepGroupLabel) {
    return await (await this.stepAccordion(label, stepGroupLabel)).locator('.accordion-item-badge');
  }

  async stepAccordionButton(label, stepGroupLabel) {
    return await (await this.stepAccordion(label, stepGroupLabel)).locator('.accordion-item-trigger');
  }

  async accordionItemContent(label, stepGroupLabel) {
    return await (await this.stepAccordion(label, stepGroupLabel)).locator('.prose');
  }

  async stepAccordionThumbsRating(label, stepGroupLabel) {
    return await (await this.stepAccordion(label, stepGroupLabel)).locator('.thumbs-rating');
  }

  async stepAccordionViewProjectButton(label, stepGroupLabel) {
    return await (await this.stepAccordion(label, stepGroupLabel)).getByRole('button', { name: 'View in project' });
  }

  async buyerAiSummaryContent(Content) {
    return await this.page.locator('.prose').getByText(Content);
  }

  async aiSummaryModal() {
    return await this.page.locator('.modal');
  }

}