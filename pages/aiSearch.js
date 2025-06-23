export class AiSearch {
   constructor(page){
    this.myPage = page;
   }

   async centigradeAiButton() {
    return await this.myPage.getByRole('button', {name: 'Ask  Centigrade.AI'})
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
    return await (await this.AIQuestionsWrapper()).getByRole('button', {name: "What is this project's main climate benefit?"});
   }

   async AIQuestionsSecond() {
    return await (await this.AIQuestionsWrapper()).getByRole('button', {name: "What carbon pools are included in the calculations?"});
   }
   
   async AIQuestionsThird() {
    return await (await this.AIQuestionsWrapper()).getByRole('button', {name: "How does the project ensure additionality?"});
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



}