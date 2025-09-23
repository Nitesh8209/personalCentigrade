import { expect } from "@playwright/test";
import { getFieldValue, getFileValue } from "../tests/utils/listingsProjectHelper";

export class ProjectListings {

  constructor(page) {
    this.page = page;
  }

  async navbar() {
    return await this.page.locator('.navbar');
  }

  async projectTag() {
    return await this.page.locator('.project-organization');
  }

  async projectTitle() {
    return await this.page.locator('.content-header > h1');
  }

  async shareButton() {
    return await this.page.getByRole('button', { name: 'Share' });
  }

  async shareModal() {
    return await this.page.getByRole('dialog');
  }

  async shareModalHeader() {
    return await this.page.locator('.modal-header');
  }

  async input() {
    return await (await this.shareModal()).locator('.input');
  }
  
  async shareModalInput() {
    return await (await this.input()).getByLabel('Enter email');
  }

  async inputLabel() {
    return await (await this.input()).locator('label');
  }

  async inputHelperText() {
    return await (await this.input()).locator('.helper-text');
  }

  async shareButtonInModal() {
    return await (await this.shareModal()).getByRole('button', { name: 'Share' });
  }

  async shareModalParagraph() {
    return await this.page.locator('.share-form').locator('p');
  }

  async shareModalCloseButton() {
    return await this.page.locator('.modal-close-btn');
  }

  async shareModalMessage() {
    return await this.page.locator('.share-project-form > form > div:nth-child(3)');
  }

  async shareModalMessageLabel() {
    return await (await this.shareModalMessage()).getByText('Add a message (optional)');
  }

  async shareModalMessageTextArea() {
    return await (await this.shareModalMessage()).locator('textarea');
  }

  async copyLink() {
    return await this.page.getByRole('button', { name: 'Copy link' });
  }

  async successMessagediv() {
    return this.page.locator('.toast-content > div');
  }

  async listingprojectTitle() {
    return await this.page.locator('.content-header-title');
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
    return await this.page.getByRole('link', { name: label , exact: true })
  }

  async stepLabel(label){
    return await this.page.locator('.sidebar').getByRole('link', { name: label , exact: true });
  }

  async contentStepLabel(label){
    return await this.page.locator('.content').locator('.step-header').getByRole('heading', { name: label , exact: true});
  }

  async sectionLabel(name) {
    return this.page.locator(`.step-content-nav a[href$="${name}"]`);
  }

  
  async contentSectionLabel(name){
    return await this.page.locator(`h2#accordion\\:${name}`);
  }

  async fieldGroupLabel(label){
    return await this.page.locator('.step-content-nav .nav-item.pl-gutter').getByText(label , { exact: true });
  }

  async contentFieldGroupLabel(label){
    return await this.page.locator('.content').getByRole('button', { name: label , exact: true});
  }

  async stepGroup(label){
    return await this.page.locator('.sidebar').locator('.collapsible-trigger.menu-item').filter({ hasText: label });
  }

  async fieldGroupcontent(){
    return await this.page.locator('.right-nav > h4');
  }

  async linkViewData() {
    return await this.page.getByRole('link', { name: 'View data' });
  }

  async ProjectSummary() {
    return await this.page.locator('.ProjectSummary');
  }

  async headingProjectSummary() {
    return await this.page.locator('.ProjectSummary').locator('h2');
  }

  async missionStatement() {
    return await this.page.locator('.mission-statement');
  }

  async headingMissionStatement() {
    return await this.page.locator('.mission-statement').locator('h3');
  }

  async contentMissionStatement() {
    return await (await this.missionStatement()).locator('.TruncatedText');
  }

  async learnMoreButton() {
    return await this.page.getByRole('button', { name: 'Learn more' });
  }

  async locationMap() {
    return await this.page.locator('.location-map');
  }

  async headingLocationMap() {
    return await this.page.locator('.location-map').locator('h3');
  }

  async map() {
    return await this.page.locator('.location-map').locator('.LocationMap');
  }


  async contentFieldLocator(field){
    switch(field.view_component){
      case 'media-carousel':
        const value = await getFileValue(field.name);
        if(value){
          return await this.page.locator('.content').locator('.ComponentContainer').filter({hasText: field.label});
        }
        return false;

      case 'key-value-table':
        if (field.component === 'file-upload-multiple' || field.component === 'file-upload') {
          return this.page.locator('.content').locator('.key-value-list > div').filter({ hasText: field.label });
        }
          return this.page.locator('.content').locator('.ComponentContainer').getByText(field.label, { exact: true }).locator('..').locator('..');
      
      case 'truncated-text':
        return this.page.locator('.content').locator('.key-value-item').filter({ hasText: field.label });
      
      case 'rich-text':
        return this.page.locator('.content').locator('.ComponentContainer').getByText(field.label, { exact: true }).locator('..').locator('..');
        
      case 'location-map':
        return this.page.locator('.content').locator('.ComponentContainer').filter({ hasText: field.label });

      case 'modular-chart':
        return this.page.locator('.content').locator('.DynamicChart').filter({ hasText: field.label });
      
      case 'data-grid':
        return this.page.locator('.content').locator('.ComponentContainer').getByText(field.label, { exact: true }).locator('..').locator('..');
        
      case 'data-table':
        return this.page.locator('.content').locator('.ComponentContainer > .data-table').getByText(field.label, { exact: true }).locator('..').locator('..');

      case 'pill':
        return this.page.locator('.content').locator('.ComponentContainer').getByText(field.label, { exact: true }).locator('..').locator('..');
        
      case 'block-table':
        return this.page.locator('.content').locator('.ComponentContainer').locator('.TrioHeroBlockRow');
        
      default:
        return this.page.locator('.content').locator('.key-value-list').locator('.label-container > label').getByText(field.label , {exact: true});  
    }
  }

  async contentOverviewFieldLocator(field, step){
    if(step.name === 'keyFactors'){
      return this.page.locator('.flex.flex-col.gap-sm', { hasText: 'Key factors' });
    }else if(step.name === 'keyDifferentiators'){
      return this.page.locator('.KeyDifferentiatorContainer');
    }else if(step.name === 'creditSummary' && field.view_component === 'block-table'){
      return this.page.locator('.content').locator('.Summary__content');
    }else{
      return false;
    }

  }


  async keyFactorRow(label) {
    // Locate label cell
    const rowLabel = await this.page.locator('.key-value-table .flex.bg-subtle', { hasText: label });
    // Its next sibling is the value cell
    const rowValue = await rowLabel.locator('xpath=following-sibling::div[1]');
    return { rowLabel, rowValue };
    }

  async overViewFieldValue(field, locator, step) {

    switch (step.name) {
      case 'keyFactors':
        const { rowLabel, rowValue } = await this.keyFactorRow(field.label);

        // Validate label
        await expect(rowLabel).toBeVisible();
        await expect(rowLabel).toHaveText(field.label);

        const value = await getFieldValue(field.name);

        if (value && field.component !== 'select-multiple') {
          // For single value fields
          await expect(rowValue).toBeVisible();
          await expect(rowValue).toHaveText(value);

        } else if (value && field.component === 'select-multiple') {
          // For multiple values
          const parseValue = JSON.parse(value);
          const listItems = rowValue.locator('ul > li');
          const textContent = await listItems.allTextContents();
          await expect(textContent).toEqual(parseValue);
        }
        break;
         
      case 'keyDifferentiators':
        const value2 = await getFieldValue(field.name);

        if(value2){
          await expect(await locator.getByText(value2)).toBeVisible();
          await expect(await locator.getByText(value2)).toHaveText(value2);
        }
        break;

      case 'creditSummary' :
          await this.validateBlockTable(field, locator);
        break;
  }
  }

  async contentField(field, locator){  
    switch (field.view_component) {
      case 'media-carousel':
        await this.ValidateMediaCarouselField(field, locator);
        break;
      
      case 'key-value-table':
        if (field.component === 'file-upload-multiple' || field.component === 'file-upload') {
          await this.ValidateUploadedFile(field, locator);
        } else if(field.component === 'select-multiple'){
          await this.ValidateMultipleSelect(field, locator);
        } else if(field.component === 'checkbox'){
          await this.ValidateCheckBox(field, locator);
        } else {
          await this.ValidateKeyValueTabel(field, locator);
        }
        break;
        
      case 'block-table':
        await this.validateBlockTable(field, locator);
      break;
        
      case 'truncated-text':
        await this.ValidateTruncatedText(field, locator);
        break;
        
      case 'rich-text':
        await this.ValidateRichText(field, locator);
        break;

      case 'location-map':
        if(field.component == "country-select"){
          await this.validateLocationMap(field, locator);
        }else{
          await this.validateLocationMapSelectMultiple(field, locator);
        }
        break;
      
      case 'modular-chart':
        await this.validateModularChart(field, locator);
        break;

      case 'data-grid':
        const startYear = await getFieldValue(field.attributes.startYear.replace(/^\$/, ''));
        const endYear = await getFieldValue(field.attributes.endYear.replace(/^\$/, ''));
        await this.validateDataGrid(field, locator, startYear, endYear); 
        break;
        
      case 'data-table':
        await this.validateDataTable(field, locator);
        break;
      
      case 'pill':
        if(field.component === 'select-multiple'){
          await this.validateSelectMultiplePillField(field, locator);
        }else{
          await this.validatePillField(field, locator);
        }
        break; 
        
      default:
        return await this.page.locator('.content').locator('.key-value-list').locator('.label-container > label').getByText(field.label , {exact: true});  
    }
  }

  async ValidateMediaCarouselField(field, locator){
   await expect(await locator.getByText(field.label)).toBeVisible();
   await expect(await locator.getByText(field.label)).toHaveText(field.label);
   await expect(await locator.locator('img')).toBeVisible();
  }

  async ValidateKeyValueTabel(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.relative')).toBeVisible();
    let value = await getFieldValue(field.name);
    if(value){
      if(field.component === 'country-select'){
        if(value == "United Kingdom, India"){
            value = "[\"GB\",\"IN\"]" ;
        }
        const parseValue = JSON.parse(value);
        const listItems = await locator.locator('.unordered-list > li').allTextContents();
        await expect(listItems).toEqual(parseValue);
      }else{
        await expect(await locator.locator('.relative')).toHaveText(value);
      }
    }else{
      await expect(await locator.locator('.relative')).toHaveText('Data not provided yet');
    }
  }

  async ValidateMultipleSelect(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    const value = await getFieldValue(field.name);
    if(value){
      await expect(await locator.locator('.relative > div > ul')).toBeVisible();
      const parseValue = JSON.parse(value);
      const allText = await locator.locator('.relative > div > ul > li').allTextContents();
      await expect(allText).toEqual(parseValue);
    }
    
  }

  async validateSelectMultiplePillField(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.pills-container')).toBeVisible();
    const value = await getFieldValue(field.name);
    const parseValue = JSON.parse(value);
    const allText = await locator.locator('.pills-container > li').allTextContents();
    await expect(allText).toEqual(parseValue);
  }

  async ValidateCheckBox(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.relative > div > ul')).toBeVisible();
    const value = await getFieldValue(field.name);
    const expectedValues = JSON.parse(value);
    const items = await locator.locator('.relative > div > ul > li').allTextContents();
    expect(items).toEqual(expectedValues);
  }

  async ValidateTruncatedText(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.relative')).toBeVisible();
    const value = await getFieldValue(field.name);
    await expect(await locator.locator('.relative')).toHaveText(value);
  }


  async ValidateRichText(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.key-value-item')).toBeVisible();
    const value = await getFieldValue(field.name);
    if(value){
      await expect(await locator.locator('.key-value-item')).toHaveText(value);
    }else{
      await expect(await locator.locator('.key-value-item')).toHaveText('Data not provided yet');
    }
    
  }

  async ValidateUploadedFile(field, locator){
    await expect(await locator.locator('svg')).toBeVisible();
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    const value = await getFileValue(field.name);
   if(value){
        await expect(await locator.locator('.text-link').first()).toBeVisible();
     await expect(await locator.locator('.text-link').first()).toHaveText(value);
   }else{
     await expect(await locator.locator('.text-secondary')).toHaveText('Data not provided yet');
   }
  }

  async validateLocationMap(field, locator){
    await expect(await locator.locator('.LocationMap')).toBeVisible();
    await expect(await locator.locator('.key-value-item').locator('label')).toBeVisible();
    await expect(await locator.locator('.key-value-item').locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.key-value-item').locator('.relative')).toBeVisible();
    const value = await getFieldValue(field.name);
    await expect(await locator.locator('.key-value-item').locator('.relative')).toHaveText(value);
  }

  async validateLocationMapSelectMultiple(field, locator){
    await expect(locator).toBeVisible();
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.LocationMap')).toBeVisible();
  }

  async validateBlockTable(field, locator) {

    for (const column of field?.columns) {
      const blockTableLocator = await this.page.locator('.TrioHeroBlock').filter({ hasText: column.label });

      await expect(blockTableLocator.locator('.label')).toHaveText(column.label);
      if (column.attributes.field) {
        const cleanKeyName = column.attributes.field.replace(/-namevalue(-namevalue)?$/, '');
        const value = await getFieldValue(cleanKeyName);
        if (column.view_component === 'pill') {
          const pillValue = await blockTableLocator.locator('.BlockValue').locator('.pills').allTextContents();
          const parseValue = JSON.parse(value);
          await expect(pillValue).toEqual(parseValue);
        } else {
          if(value){
            await expect(await blockTableLocator.locator('.BlockValue')).toHaveText(value);
          }
        }
      }


    }
  }

  async validateModularChart(field, locator){
    await expect(await locator.locator('h2')).toBeVisible();
    await expect(await locator.locator('h2')).toHaveText(field.label);
    const value = await getFieldValue(field.name);
    if(value){
      await expect(await locator.locator('.recharts-responsive-container').locator('svg.recharts-surface')).toBeVisible(); 

      const seriesSetLocator = await locator.locator('.recharts-responsive-container').locator('.recharts-legend-wrapper');
      await expect(seriesSetLocator).toBeVisible();
  
        for(const element of field?.elements || []){
          for(const seriesSet of element?.series_sets || []){
            const seriesSetItemLocator = await seriesSetLocator.locator('div > div').filter({hasText : seriesSet.label});
            // await expect(await seriesSetItemLocator.locator('svg')).toBeVisible();
            await expect(await seriesSetItemLocator.locator('span')).toBeVisible();
            await expect(await seriesSetItemLocator.locator('span')).toHaveText(seriesSet.label);
          }
        }
    }
    
  }

  async validateDataGrid(field, locator, startYear, endYear){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);

    const tableLocator = await locator.getByRole('grid');
    const tableHeader = await tableLocator.locator('.ag-header');

    await expect(await tableHeader.locator('.ag-pinned-left-header')).toBeVisible();
    await expect(await tableHeader.locator('.ag-pinned-left-header')).toHaveText('Vintage');
    
        const value = await getFieldValue(field.name);
        const headerVeiwPort = await tableLocator.locator('.ag-header-viewport ');
        await expect(headerVeiwPort).toBeVisible();
        if(value){
          for (let i = 0; i <= endYear - startYear; i++) {
            const colId = Number(startYear);
            const colheader = await headerVeiwPort.locator(`[col-id="${colId + i}"]`);
            await expect(colheader).toBeVisible();
            await expect(colheader).toHaveText(String(colId + i));
          }
        }
    
        for (const option of field.options) {
          const colName = await tableLocator.getByText(option.label);
          await expect(colName).toBeVisible();
          await expect(colName).toHaveText(option.label);
          if(value){
            for (let i = 0; i <= endYear - startYear; i++) {
              const colId = Number(startYear);
              const rowIndex = await tableLocator.locator('.ag-center-cols-viewport').locator(`[row-id="${option.name}"]`);
              await expect(rowIndex).toBeVisible();
              const colheader = await rowIndex.locator(`[col-id="${colId + i}"]`);
              await expect(colheader).toBeVisible();
              await expect(colheader).toHaveText((colId + i).toLocaleString());
            }
          }
        }
      
  }

  async validateDataTable(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);

    const tableLocator = await locator.getByRole('grid');
    const tableHeader = await tableLocator.locator('.ag-header');
    await expect(tableHeader).toBeVisible();
    await expect(await tableLocator.locator('.ag-body')).toBeVisible();

    for(const column of field?.columns || []){
    const columnLabel = await tableHeader.getByText(column.label, {exact: true});
    await expect(columnLabel).toBeVisible();
    await expect(columnLabel).toHaveText(column.label);
    }
  }

  async validatePillField(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.pills-container')).toBeVisible();
    const value = await getFieldValue(field.name);
    await expect(await locator.locator('.pills-container')).toHaveText(value);
  }

}
