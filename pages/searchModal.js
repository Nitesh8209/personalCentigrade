export class SearchModal {

  constructor(page) {
    this.page = page;
  }

  async searchButton() {
    return await this.page.locator('.search-button');
  }

  async searchBoxIcon() {
    return await (await this.searchButton()).locator('.btn-icon-right');
  }

  async searchModal() {
    return await this.page.locator('.SearchModal');
  }

  async searchInputWrapper() {
    return await (await this.searchModal()).locator('.input-wrapper');
  }

  async searchInput() {
    return await (await this.searchInputWrapper()).locator('input');
  }

  async searchIcon() {
    return await (await this.searchInputWrapper()).locator('.input-adornment');
  }

  async NoResultsFound() {
    return await (await this.searchModal()).locator('.NoResultsFound');
  }
  
  async SearchContent() {
  return await (await this.searchModal()).locator('.SearchContent');
  }

  async SearchItem() {
    return await (await this.searchModal()).locator('.SearchItem');
  }

  async tabListTitle() {
    return await this.page.locator('.tab-list > .active');
  }

  async navAccordionItem() {
    return await this.page.locator('.nav-accordion-item-title.active');
  }

}
