import { expect } from "@playwright/test";

export class AiSearch {
   constructor(page){
    this.myPage = page;
   }

   async centigradeAiButton() {
    // return await this.myPage.getByRole('button', {name: 'Ask  Centigrade.AI'});

    return await this.myPage.locator('.btn-icon-left');
   }

   async AiSearchOverview(){
    return await this.myPage.locator('.AISearchOverview');
   }

   async AiSearchBar() {
    return await this.myPage.locator('.AISearchBar');
   }

   async AiSearchBarHeading(){
    return await this.myPage.getByRole('heading', {name: 'Ask Centigrade.AI'});
   }

   async AiSearchBarInput(){
    return await (await this.AiSearchBar()).locator('input');
   }

   async AiSearchBarInputIcon(){
    return await (await this.AiSearchBar()).locator('.input-icon');
   }

   async AIQuestionsWrapper() {
    return await this.myPage.locator('.AIQuestionsWrapper');
   }

   async AIQuestionsFirst() {
    return await (await this.AIQuestionsWrapper()).getByRole('button', {name: "Review the project's baseline"});
   }

   async AIQuestionsSecond() {
    return await (await this.AIQuestionsWrapper()).getByRole('button', {name: "Ask about additionality"});
   }
   
   async AIQuestionsThird() {
    return await (await this.AIQuestionsWrapper()).getByRole('button', {name: "Explore the project's monitoring approach"});
   }

   async drawer() {
    return await this.myPage.locator('.drawer-positioner');
   }

   async drawerContent() {
    return await (await this.drawer()).locator('.drawer-content');
   }

   async drawerAiSearchInput(){
     return await (await this.drawerContent()).locator('input');
   }

   async drawerHeader() {
    return await (await this.drawer()).locator('.drawer-header');
   }

   async centigradeAiTab() {
     return await (await this.drawerHeader()).getByRole('tab', {name: "Ask Centigrade.AI"});
   }

   async searchTab() {
     return await (await this.drawerHeader()).getByRole('tab', {name: 'Search'});
   }

   async closeDrawerButton() {
    return await (await this.drawerHeader()).locator('.drawer-close-btn');
   }

   async  prose() {
    return await (await this.drawerContent()).locator('.prose');
   }

   async  aiSources() {
    return await (await this.drawerContent()).locator('.ai-sources');
   } 

   async  sourceLabel() {
    return await (await this.aiSources()).locator('label');
   } 

   async  thumbsUp() {
    return await (await this.aiSources()).getByTestId('thumbs-up-outline');
   } 

   async  thumbsDown() {
    return await (await this.aiSources()).getByTestId('thumbs-down-outline');
   } 

   async  thumbsUpSolid() {
    return await (await this.aiSources()).getByTestId('thumbs-up-solid');
   } 

   async  thumbsDownSolid() {
    return await (await this.aiSources()).getByTestId('thumbs-down-solid');
   } 

   async dialog() {
    return await this.myPage.locator('.drawer.drawer-lg');
   }

   async dialog() {
    return await this.myPage.locator('.modal.modal-md');
   }

   async modalClose() {
    return await this.myPage.locator('.modal-close-btn');
   }


  // Helper methods for drawer state management
  async ensureDrawerIsOpen() {
    const drawer = await this.drawer();
    const isVisible = await drawer.isVisible();

    if (!isVisible) {
      const ctaButton = await this.centigradeAiButton();
      await ctaButton.click();
      await expect(drawer).toBeVisible();
    }
  }

  async ensureDrawerIsClosed() {
    const drawer = await this.drawer();
    const isVisible = await drawer.isVisible();

    if (isVisible) {
      const closeButton = await this.closeDrawerButton();
      await closeButton.click();
      await expect(drawer).not.toBeVisible();
    }
  }

  async ensureDrawerHasSearchResults() {
    const drawer = await this.drawer();
    const isVisible = await drawer.isVisible();

    if (!isVisible) {
      const firstQuestion = await this.AIQuestionsFirst();
      await firstQuestion.click();
      await expect(drawer).toBeVisible();
    }
  }

}