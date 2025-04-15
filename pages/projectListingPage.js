import { expect } from "@playwright/test";
import { getFieldValue } from "../tests/utils/listingsProjectHelper";

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

  async stepLabel(label){
    return await this.page.locator('.left-nav').locator('.nav-accordion-content').getByText(label);
  }

  async contentStepLabel(label){
    return await this.page.locator('.content').locator('.step-header').getByRole('heading', { name: label , exact: true});
  }

  async sectionLabel(name){
    return await this.page.locator(`div > #nav-${name}`);
  }

  
  async contentSectionLabel(name){
    return await this.page.locator(`h2#accordion\\:${name}`);
  }

  async fieldGroupLabel(name){
    return await this.page.locator('.right-nav > .right-nav-list').locator(`li > #nav-${name}`);
  }

  async contentFieldGroupLabel(label){
    return await this.page.locator('.content').getByRole('button', { name: label , exact: true});
  }

  async stepGroup(label){
    return await this.page.locator('.left-nav').locator('.nav-accordion-header ').getByText(label);
  }

  async fieldGroupcontent(){
    return await this.page.locator('.right-nav > h4');
  }

  async contentFieldLocator(field){
    switch(field.view_component){
      case 'media-carousel':
        return await this.page.locator('.content').locator('.ComponentContainer').filter({hasText: field.label});

      case 'key-value-table':
        if (field.component === 'file-upload-multiple' || field.component === 'file-upload') {
          return this.page.locator('.content').locator('.key-value-list > div').filter({ hasText: field.label });
        }
          return this.page.locator('.content').locator('.ComponentContainer').getByText(field.label, { exact: true }).locator('..').locator('..');
      
      case 'truncated-text':
        return this.page.locator('.content').locator('.key-value-item').filter({ hasText: field.label });
      
      case 'rich-text':
        return this.page.locator('.content').locator('.ComponentContainer').filter({ hasText: field.label });
        
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
        
      default:
        return this.page.locator('.content').locator('.key-value-list').locator('.label-container > label').getByText(field.label , {exact: true});  
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
        
      case 'truncated-text':
        await this.ValidateTruncatedText(field, locator);
        break;
        
      case 'rich-text':
        await this.ValidateRichText(field, locator);
        break;

      case 'location-map':
        await this.validateLocationMap(field, locator);
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
    const value = await getFieldValue(field.name);
    if(value){
      await expect(await locator.locator('.relative')).toHaveText(value);
    }else{
      await expect(await locator.locator('.relative')).toHaveText('Data not provided yet');
    }
  }

  async ValidateMultipleSelect(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.relative > div > ul')).toBeVisible();
    const value = await getFieldValue(field.name);
    const parseValue = JSON.parse(value);
    const allText = await locator.locator('.relative > div > ul > li').allTextContents();
    await expect(allText).toEqual(parseValue);
  }

  async validateSelectMultiplePillField(field, locator){
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    await expect(await locator.locator('.pills-container')).toBeVisible();
    const value = await getFieldValue(field.name);
    await expect(await locator.locator('.pills-container > li')).toHaveText(value);
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
    await expect(await locator.locator('.key-value-item')).toHaveText(value);
  }

  async ValidateUploadedFile(field, locator){
    await expect(await locator.locator('svg')).toBeVisible();
    await expect(await locator.locator('label')).toBeVisible();
    await expect(await locator.locator('label')).toHaveText(field.label);
    const value = await getFieldValue(field.name);
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

    const tableLocator = await locator.getByRole('treegrid');
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

    const tableLocator = await locator.getByRole('treegrid');
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
