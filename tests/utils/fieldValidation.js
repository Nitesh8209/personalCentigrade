import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { project } from '../data/projectData';
const fs = require('fs');


// Field type constants remain the same
const FIELD_TYPES = {
  STRING: 'string',
  INTEGER: 'integer',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ARRAY: 'array',
  DATE: 'date',
  OBJECT: 'object'
};

// Component type constants remain the same
const COMPONENT_TYPES = {
  TEXT_INPUT: 'text-input',
  TEXT_INPUT_MULTIPLE: 'text-input-multiple',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  SELECT_MULTIPLE: 'select-multiple',
  METHODOLOGY_SELECT: 'methodology-select',
  COUNTRY_SELECT: 'country-select',
  RADIO: 'radio',
  RADIOYN: 'radio-y-n',
  RADIOIDK: 'radio-y-n-idk',
  CHECKBOX: 'checkbox',
  YEAR_INPUT: 'year-input',
  MEDIA_CAROUSEL: 'media-carousel',
  FILE_UPLOAD_MULTIPLE: 'file-upload-multiple',
  FILE_UPLOAD: 'file-upload',
  DATE_PICKER: 'date-picker',
  DATA_GRID: 'data-grid',
  DATA_TABLE: 'data-table',
  RICH_TEXT: 'rich-text'
};

export class FieldHandler {
  constructor(page) {
    this.page = page;
  }

  /**
   * Gets the appropriate locator based on field type and component
   */

  async getLocator(fieldName, fieldLabel, fieldType, component) {
    // Handle select components first
    if (component === COMPONENT_TYPES.SELECT ||
      component === COMPONENT_TYPES.SELECT_MULTIPLE ||
      component === COMPONENT_TYPES.METHODOLOGY_SELECT) {
      return this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      }).getByRole('combobox');
    }

    // Handle special input types
    if (component === COMPONENT_TYPES.MEDIA_CAROUSEL || component === COMPONENT_TYPES.FILE_UPLOAD_MULTIPLE || component === COMPONENT_TYPES.FILE_UPLOAD) {
      return this.page.locator(`input[name="${fieldName}"][type="file"]`);
    }

    if (component === COMPONENT_TYPES.YEAR_INPUT) {
      return this.page.locator(`input[name="${fieldName}"][data-scope="number-input"]`);
    }

    if (component === COMPONENT_TYPES.CHECKBOX) {
      return this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      }).locator('.checkbox-group-options');
    }

    if (component === COMPONENT_TYPES.COUNTRY_SELECT) {
      return this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      })    
    }

    if (component === COMPONENT_TYPES.DATA_GRID) {
      return this.page.locator('.field').filter({
        has: this.page.locator(`label[for="${fieldName}"]`)
      })
    }

    if (component === COMPONENT_TYPES.DATA_TABLE) {
      return this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      }).locator('.ag-theme-quartz');
    }

    if (component === COMPONENT_TYPES.RADIOYN || component === COMPONENT_TYPES.RADIO || component === COMPONENT_TYPES.RADIOIDK) {
      return this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      }).getByRole('radiogroup');
    }

    if (component === COMPONENT_TYPES.TEXT_INPUT_MULTIPLE) {
      return this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      });
    }

    if (component === COMPONENT_TYPES.TEXT_INPUT || component === COMPONENT_TYPES.DATE_PICKER) {
      return this.page.locator(`input[name="${fieldName}"]`);
    }

    if (component === COMPONENT_TYPES.RICH_TEXT) {
      return this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      }).locator('.editor-control');
    }

    if (component === COMPONENT_TYPES.TEXTAREA) {
      return this.page.locator(`textarea[name="${fieldName}"]`);
    }

    // Handle standard field types
    switch (fieldType) {
      case FIELD_TYPES.INTEGER:
      case FIELD_TYPES.ARRAY:
        return this.page.locator(`[name='${fieldName}']`);

      case FIELD_TYPES.BOOLEAN:
        return this.page.getByLabel(fieldLabel)

      default:
        return this.page.getByLabel(fieldLabel, { exact: true });
    }
  }

  async findLabel(label) {
    return this.page.locator('.nav-menu').getByText(label, { exact: true });
  }

  async findStep(step) {
    const stepSlug = step
      .split(/(?=[A-Z])/)  
      .join('-')            
      .toLowerCase();      

    return this.page.locator(`a[href*="/${stepSlug}"]`);
  }

  async breadCrumps() {
    return this.page.locator('ol.breadcrumbs > li.breadcrumb');
  }

  async separators() {
    return this.page.locator('ol.breadcrumbs > li.breadcrumb-separator');
  }

  async breadCrumpDetail(number) {
    const breadCrumbsLocator = await this.breadCrumps();
    return breadCrumbsLocator.nth(number).locator('a');
  }


  async validateBreadcrumb(index, expectedHref, expectedText) {
    const breadcrumb = await this.breadCrumpDetail(index);
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toHaveText(expectedText);

    if (expectedHref) {
      await expect(breadcrumb).toHaveAttribute('href', expectedHref);
    }

  }

  async section(label) {
    return this.page.locator('.section-header').getByText(label);
  }

  async title() {
    return this.page.locator('.step-header > .step-title');
  }

  async description() {
    return this.page.locator('.step-header > .step-description');
  }

  async fieldGroupLabel(label) {
    return this.page.locator('.field-group > .field-group-label').getByText(label);
  }

  async cancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  async saveButton() {
    return this.page.getByRole('button', { name: 'Save', exact: true });
  }

  async unsavedChangeModal() {
    return await this.page.getByLabel('Unsaved changes');
  }

  async unsavedChangeHeading() {
    return await this.page.getByRole('heading', { name: 'Unsaved changes' });
  }

  async unsavedChangeDiscription() {
    return await this.page.getByText('Are you sure you want to');
  }

  async unsavedChangeText() {
    return await this.page.getByText('You cannot undo this action.');
  }

  async discardButton() {
    return await this.page.getByRole('button', { name: 'Discard' });
  }

  async unsavedCancelButton() {
    const modal = await this.unsavedChangeModal()
    return modal.getByRole('button', { name: 'Cancel' });
  }

  async successMessageHeader() {
    return this.page.locator('.toast-content > .toast-title');
  }

  async successMessagediv() {
    return this.page.locator('.toast-content > .toast-message');
  }

  async closeToast() {
    return this.page.locator('.toast-close-trigger');
  }

  /**
   * Validates field attributes and behavior
   */
  async validateField(locator, field) {
    const tagName = await locator.evaluate(el => el.tagName.toLowerCase(), { timeout: 10000 });

    // Validate field attributes
    switch (field.component) {
      case COMPONENT_TYPES.TEXT_INPUT:
        expect(tagName).toBe('input');
        await expect(locator).toHaveAttribute('type', 'text');
        await this.validateTextInput(locator, field);
        break;

      case COMPONENT_TYPES.TEXTAREA:
        expect(tagName).toBe('textarea');
        await this.validateTextInput(locator, field);
        break;

      case COMPONENT_TYPES.SELECT:
        await expect(locator).toHaveAttribute('data-scope', 'select');
        if(field.label == 'Project type'){
          const expectedOptions = ["Improved Forest Management (IFM)"];
          await this.validateSelectField(locator, field.label, expectedOptions);
        }else{
          await this.validateSelectField(locator, field.label, field.options);
        }
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        const indicator = await locator.locator('.select-indicator');
        const listbox = await this.page.locator('.field').filter({
        has: this.page.getByText(field.label, { exact: true })
      }).getByRole('listbox');
        if (!(await listbox.isVisible())) {
          await indicator.click();
        }
        for (const option of field.options) {
          const selectedValuesText = await locator.textContent();
          if (selectedValuesText.includes(option)) continue;
          const optionLocator = listbox.locator(`text="${option}"`);
          await expect(optionLocator).toBeVisible();
          await optionLocator.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const middleY = window.innerHeight / 2;
            window.scrollBy({ top: rect.top - middleY, behavior: 'instant' });
          });
          await optionLocator.click();
        }
        await indicator.click();
        const finalSelectedValuesText = await locator.textContent();
        for (const option of field.options) {
          expect(finalSelectedValuesText).toContain(option);
        }
        break;

      case COMPONENT_TYPES.METHODOLOGY_SELECT:
        await this.validateMethodologySelectField(locator);
        break;

      case COMPONENT_TYPES.RADIOYN:
        await expect(locator).toHaveAttribute('data-scope', 'radio-group');
        await this.validateRadioYNField(locator, field.component);
        break;

      case COMPONENT_TYPES.RADIO:
        await expect(locator).toHaveAttribute('data-scope', 'radio-group');
        await this.validateRadioField(locator, field.options);
        break;


      case COMPONENT_TYPES.RADIOIDK:
        await expect(locator).toHaveAttribute('data-scope', 'radio-group');
        await this.validateRadioIDKField(locator, field.component);
        break;

      case COMPONENT_TYPES.CHECKBOX:
        await this.validateCheckboxField(locator, field.component);
        break;

      case COMPONENT_TYPES.YEAR_INPUT:
        await expect(locator).toHaveAttribute('type', 'text');
        await expect(locator).toHaveAttribute('data-scope', 'number-input');
        await this.validateNumberField(locator, field.label);
        break;

      case COMPONENT_TYPES.MEDIA_CAROUSEL:
        await expect(locator).toHaveAttribute('type', 'file');
        await this.validateFileField(locator);
        break;


      case COMPONENT_TYPES.DATA_GRID:
        await this.validateDataGridWarningBanner(locator);
        break;

      case COMPONENT_TYPES.DATA_TABLE:
        await this.validateDataTableFields(locator, field);
        break;

      case COMPONENT_TYPES.TEXT_INPUT_MULTIPLE:
        await this.ValidateTextInputMultipleField(locator, field.name);
        break;

      case COMPONENT_TYPES.RICH_TEXT:
        await this.validateRichTextField(locator)
    }
  }

  async validateRichTextField(locator) {
    // await expect(await locator.locator('.toolbar')).toBeVisible();
    await expect(await locator.locator('.tiptap')).toBeVisible();

    const inputField = await locator.locator('.tiptap');
    await inputField.fill('test');
    await expect(inputField).toHaveText('test');
  }

  async ValidateTextInputMultipleField(locator, fieldName) {
    const addButton = await locator.getByRole('button', { name: '+ Add field' });
    await expect(addButton).toBeVisible();
    await addButton.click();
    const inputFiled = await locator.locator('.input');
    await expect(inputFiled).toBeVisible();
  }

  // Data Table validation Function
  async dataTableValidate(locator, dataTableLocator, field) {
    switch (field.component) {
      case COMPONENT_TYPES.SELECT:
        await this.dataTableSelectField(locator, dataTableLocator, field);
        break;

      case COMPONENT_TYPES.TEXT_INPUT:
        await this.dataTableInputField(locator, field);
        break;

      case COMPONENT_TYPES.TEXTAREA:
        await this.dataTableTextAreaField(dataTableLocator, field);
        break;

      case COMPONENT_TYPES.DATE_PICKER:
        const date = "06/26/2025";
        await locator.click();
        await locator.locator('input').fill(date);
        await locator.locator('button').click();
        break;  
    }
  }

  // selct the filed in the data Table
  async dataTableSelectField(locator, dataTableLocator, field) {
    for (const option of field.options) {
      const selectLocator = await locator.locator('.select-indicator')
      await locator.click();
      const listBox = await dataTableLocator.getByRole('listbox');
      if(!(await listBox.isVisible())){
        await expect(selectLocator).toBeVisible()
        await selectLocator.click();
      }
      await expect(listBox).toBeVisible();
      const optionText = await listBox.getByText(option, { exact: true });
      await expect(optionText).toBeVisible();
      await expect(optionText).toHaveText(option);
      await optionText.click(); 
      await this.page.keyboard.press('Enter');
      await expect(locator).toHaveText(option);
    }
  }

  // Fill the Input Field In the Data Table
  async dataTableInputField(locator, field) {
    const inputField = await locator.locator('input');
    await inputField.click();
    await inputField.clear();

    const testValue = field.type === FIELD_TYPES.STRING ? 'Test Input' : '123';
    await inputField.type(testValue);
    await expect(inputField).toHaveValue(testValue);

  }

  // Fill the Text Area Field in the Data Table
  async dataTableTextAreaField(locator, field) {
    const inputField = await locator.locator('textarea');
    await inputField.click();
    await inputField.clear()

    const testValue = field.type === FIELD_TYPES.STRING ? 'Test Input' : '123';
    await inputField.fill(testValue);
    await expect(inputField).toHaveValue(testValue);
  }

  // Validating hte Data Table Fields 
  async validateDataTableFields(locator, field) {
    const firstRow = await locator.locator('[row-id="0"]');
    await expect(firstRow).toBeVisible();

    for (const column of field.columns) {
      await expect(await locator.getByText(column.label, { exact: true })).toBeVisible();
      await expect(await locator.getByText(column.label, { exact: true })).toHaveText(column.label);

      const firstRowFieldLocator = await firstRow.locator(`[col-id="${column.column_id}"]`)
      await expect(firstRowFieldLocator).toBeVisible();
      await firstRowFieldLocator.click();

      await this.dataTableValidate(firstRowFieldLocator, locator, {
        type: column.type,
        component: column.component,
        label: column.label,
        options: column.options
      })

      const firstRowDeleteField = await firstRow.locator(`[col-id="actions"]`)
      await expect(firstRowDeleteField).toBeVisible();

      const AddRow = await locator.getByRole('button', { name: '+ Add row' });
      await expect(AddRow).toBeVisible();
      await AddRow.click();
    }
  }

  //Validate the Warning Banner in Data Grid 
  async validateDataGridWarningBanner(locator) {
    const banner = await locator.locator('.banner');
    await expect(banner).toBeVisible();

    const bannerHeading = await banner.getByRole('heading', { name: 'Period not defined' });
    expect(bannerHeading).toBeVisible();
    expect(bannerHeading).toHaveText('Period not defined');

    const bannerContent = await banner.locator('.banner-content > div');
    await expect(bannerContent).toBeVisible();
    await expect(bannerContent).toHaveText('To enter data, use "Crediting start year" and "Crediting end year" in Tier 0 - Provenance - Project details to define the period');

    const bannerLink = await banner.getByRole('link', { name: 'Go to Project details' });
    await expect(bannerLink).toBeVisible();
    await expect(bannerLink).toHaveAttribute('href', /\/projects\/[\w-]+\/project-details/);

  }

  // Validating the Data Grid Fields 
  async validateDataGridFields(locator, field, startYear, endYear) {
    const dataGridField = await locator.getByRole('grid');
    await expect(dataGridField).toBeVisible();
    const headerLeft = await dataGridField.locator('.ag-header').locator('.ag-pinned-left-header ');
    await expect(headerLeft).toBeVisible();
    await expect(headerLeft).toHaveText('Vintage');

    const headerVeiwPort = await dataGridField.locator('.ag-header-viewport ');
    await expect(headerVeiwPort).toBeVisible();
    for (let i = 0; i <= endYear - startYear; i++) {
      await headerVeiwPort.evaluate(el => el.scrollBy({ left: 150, behavior: 'smooth' }));
      const colId = Number(startYear);
      const colheader = await headerVeiwPort.locator(`[col-id="${colId + i}"]`);
      await expect(colheader).toBeVisible();
      await expect(colheader).toHaveText(String(colId + i));
    }

    for (const option of field.options) {
      await headerVeiwPort.evaluate(el => el.scrollLeft = 0);

      const colName = await dataGridField.getByText(option.label);
      await expect(colName).toBeVisible();
      await expect(colName).toHaveText(option.label);
      for (let i = 0; i <= endYear - startYear; i++) {
        await headerVeiwPort.evaluate(el => el.scrollBy({ left: 150, behavior: 'smooth' }));

        const colId = Number(startYear);
        const rowIndex = await dataGridField.locator('.ag-center-cols-viewport').locator(`[row-id="${option.name}"]`);
        await expect(rowIndex).toBeVisible();
        const colheader = await rowIndex.locator(`[col-id="${colId + i}"]`);
        await expect(colheader).toBeVisible();
        await colheader.type(String(colId + i));
        await colName.click();
        await expect(colheader).toHaveText((colId + i).toLocaleString());
      }
    }
  }

  /**
  * Validates text input fields
  */
  async validateTextInput(locator, field) {
    const testValue = field.type === FIELD_TYPES.STRING ? 'Test Input' : '123';
    await locator.fill(testValue);
    await expect(locator).toHaveValue(testValue);
  }

  async listBox(label) {
    return this.page.locator('.field').filter({
        has: this.page.getByText(label, { exact: true })
      }).getByRole('listbox');
  }

  async validateMethodologySelectField(locator) {
    await expect(locator).toBeDisabled();
  }

  /**
 * Validates select fields
 */
  async validateSelectField(locator, label, expectedOptions) {
    // Click to open dropdown
    await locator.click();
    const listBox = await this.page.locator('.field').filter({
        has: this.page.getByText(label, { exact: true })
      }).getByRole('listbox');

    // If dropdown isn't visible after first click, try clicking again
    if (!(await listBox.isVisible())) {
      await locator.click();
    }
    await expect(listBox).toBeVisible();

    const options = await listBox.getByRole('option').allInnerTexts();
    const normalizedExpectedOptions = expectedOptions.map(option =>
      option.trim().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    );

    expect(options.length).toBeGreaterThan(0);
    expect(options).toEqual(normalizedExpectedOptions);

    for (const expectedOption of normalizedExpectedOptions) {
      if (expectedOption === 'Other') continue;

      // Reopen dropdown before selecting each option if dropdown closed
      if (!(await listBox.isVisible())) {
        await locator.click();
      }

      const optionLocator = listBox.locator(`text="${expectedOption}"`);

      // Ensure the option exists and matches the expected text
      await expect(optionLocator).toBeVisible();
      await expect(optionLocator).toHaveText(expectedOption);

      // Select the option
      await optionLocator.click();
      const selectedValue = await locator.innerText();
      expect(selectedValue).toBe(expectedOption);

    }
  }


  /**
 * Validates boolean fields (radio/checkbox)
 */
  async validateRadioYNField(locator, component) {
    const radiolocator = locator.locator('.radio-container').getByText('Yes');
    await radiolocator.check();
    await expect(radiolocator).toBeChecked();
    await radiolocator.click();
    await expect(radiolocator).not.toBeChecked();
    await radiolocator.check();
  }

  async validateRadioField(locator, options) {
    for (const option of options) {
      const radioLocator = locator.locator('.radio-container').getByText(option, { exact: true });
      await radioLocator.check();
      await expect(radioLocator).toBeChecked();
    }
  }


  async validateRadioIDKField(locator, component) {
    const options = ["Yes", "No", "I don't know"];

    for (const option of options) {
      const radioLocator = locator.getByText(option, { exact: true });
      await radioLocator.check();
      await expect(radioLocator).toBeChecked();
    }

    // Uncheck "I don't know" and validate
    const radiolocatorIDK = locator.getByText("I don't know");
    await radiolocatorIDK.click();
    await expect(radiolocatorIDK).not.toBeChecked();

    // Recheck "Yes" to ensure behavior
    await locator.locator('.radio-container').getByText("Yes").check();
  }

  /**
 * Validates Checckbox field
 */
  async validateCheckboxField(locator, component) {
    const checkboxes = await locator.locator('.checkbox-container label');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      await expect(checkbox).toHaveAttribute('data-scope', 'checkbox');
      const state = await checkbox.getAttribute('data-state');
      if (state === 'unchecked') {
        await checkbox.click();
      }
    }
  }

  /**
  * Validates number input fields
  */
  async validateNumberField(locator, label) {

    await locator.fill('2010');
    await expect(locator).toHaveValue('2010');

    // Test invalid input
    await locator.clear();
    await locator.fill('abc');
    await expect(locator).toHaveValue('');
  }

  /**
* Fill Year input fields
*/
  async fillNumberField(locator, Year) {

    await locator.fill(Year);
    await expect(locator).toHaveValue(Year);

  }

  /**
  * Validates file input fields
  */
  async validateFileField(locator) {
    await expect(locator).toHaveAttribute('type', 'file');
  }

  /**
  * Validates label presence
  */

  async validateLabel(field) {
    return this.page.locator(`label[for="${field.name}"]`);
  }


  async validateRequiredField(field) {
    const labelElement = await this.validateLabel(field);

    const hasAsterisk = await labelElement.evaluate((el) => {
      const afterContent = window.getComputedStyle(el, '::after').content;
      return afterContent && afterContent.includes('*');
    });

    return hasAsterisk;
  }


  /**
 * Validates helper text
 */
  async validateHelperText(fieldLabel, helperText) {
    return await this.page.locator('.field').filter({
        has: this.page.getByText(fieldLabel, { exact: true })
      }).getByText(helperText);
  }

  /**
* Fills field with test data
*/
  async fillField(locator, filePath, field) {
    let value;
    switch (field.component) {

      case COMPONENT_TYPES.TEXT_INPUT:
        if (FIELD_TYPES.NUMBER === field.type || FIELD_TYPES.INTEGER === field.type) {
          value = faker.number.int(100).toString();
          await locator.fill(value);
        } else {
          value = faker.lorem.words(3);
          await locator.fill(value);
        }
        break;

      case COMPONENT_TYPES.RICH_TEXT:
          value = faker.lorem.words(3);
          const inputField = await locator.locator('.tiptap')
          await inputField.fill(value);
        break;

      case COMPONENT_TYPES.TEXTAREA:
          value = faker.lorem.words(3);
          await locator.fill(value);
        break;  

      case COMPONENT_TYPES.SELECT:
        value = await field.options[0];
        if(field.label == 'Project type'){
          value = "Improved Forest Management (IFM)";
        }
        const normalizedExpectedOptions = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        await this.fillSelectField(locator, field.label, normalizedExpectedOptions);
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        value = [];
        const indicator = await locator.locator('.select-indicator');
        const listbox = await this.listBox(field.label);
        
        for (const option of field.options) {
          if (!(await listbox.isVisible())) {
            await indicator.click();
          }
          
          // Check if option is already selected by looking for exact badge matches
          const selectedBadges = await locator.locator('.badge').allTextContents();
          const isAlreadySelected = selectedBadges.some(badgeText => {
            // Remove any extra whitespace and compare exact text
            const cleanBadgeText = badgeText.trim().replace(/\s+/g, ' ');
            return cleanBadgeText === option;
          });
          
          if (isAlreadySelected) {
            value.push(option);
            continue;
          }
          
          const optionLocator = listbox.locator(`text="${option}"`);
          await expect(optionLocator).toBeVisible();
          await optionLocator.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const middleY = window.innerHeight / 2;
            window.scrollBy({ top: rect.top - middleY, behavior: 'instant' });
          });
          await optionLocator.click();
          value.push(option);
        }
        
        await indicator.click();
        
        // Verify all expected options are selected
        const finalSelectedBadges = await locator.locator('.badge').allTextContents();
        for (const expectedOption of field.options) {
          const isSelected = finalSelectedBadges.some(badgeText => {
            const cleanBadgeText = badgeText.trim().replace(/\s+/g, ' ');
            return cleanBadgeText === expectedOption;
          });
          expect(isSelected).toBe(true);
        }
        break;

      case COMPONENT_TYPES.COUNTRY_SELECT:
        value = 'United States of America';
        if(!(await locator.locator('.autocomplete-control').innerText()).includes(value)){
        await locator.locator('.autocomplete-control').click();
        await locator.locator('input').fill(value);
        await expect(await this.page.locator('.autocomplete-menu')).toBeVisible();
        await this.page.locator('.autocomplete-option').click();
        await this.page.locator('.step-title').click();
        }
        break;

      case COMPONENT_TYPES.METHODOLOGY_SELECT:
        await this.validateMethodologySelectField(locator);
        break;

      case COMPONENT_TYPES.YEAR_INPUT:
        if(field.name === 'creditStart-nameValue-nameValue' || field.name === 'creditEnd-nameValue-nameValue'){
          const yearValue = await locator.getAttribute('value');
          if(yearValue && yearValue.trim() !== ''){
            value = yearValue;
          }else{
          value = field.label.includes('start year') ? faker.date.past({ years: 5 }).getFullYear().toString() : faker.date.future({ years: 5 }).getFullYear().toString();
          await this.fillNumberField(locator, value);
        }
        }else{
          value = field.label.includes('start year') ? faker.date.past({ years: 5 }).getFullYear().toString() : faker.date.future({ years: 5 }).getFullYear().toString();
          await this.fillNumberField(locator, value);
        }
        break;

      case COMPONENT_TYPES.MEDIA_CAROUSEL:
      case COMPONENT_TYPES.FILE_UPLOAD_MULTIPLE:
      case COMPONENT_TYPES.FILE_UPLOAD:
        await locator.setInputFiles(filePath);
        const lastLi = await locator.locator('..').locator('ul li').nth(-1);
        const lastLiFilePreview = await lastLi.locator('.file-preview > svg');
        await expect(lastLiFilePreview).toBeVisible({ timeout: 30000 });
        const lastLiFileName = await lastLi.locator('.file-name-container');
        const lastLiText = await lastLiFileName.textContent();
        await expect(lastLiText).toBe('file2.png');
        value = "file2.png";
        break;

      case COMPONENT_TYPES.CHECKBOX:
        await this.validateCheckboxField(locator, field.component);
        value = field.options;
        break;

      case COMPONENT_TYPES.RADIOYN:
      case COMPONENT_TYPES.RADIOIDK:
        const radiolocator = await locator.locator('.radio-container').getByText('Yes');
        await radiolocator.check();
        value = "Yes";
        break;

      case COMPONENT_TYPES.RADIO:
        value = field.options[0];
        const radioOption = await locator.locator('.radio-container').getByText(value);
        await radioOption.check();
        break;

      case COMPONENT_TYPES.DATA_GRID:
        const projectdataFilePath = './tests/data/Project-data.json';
        const data = await this.getData('ProjectData', projectdataFilePath);
        const startYear = data["creditStart-nameValue-nameValue"];
        const endyear = data["creditEnd-nameValue-nameValue"];
        await this.validateDataGridFields(locator, field, startYear, endyear);
        value = true;
        break;

      case COMPONENT_TYPES.DATA_TABLE:
        await this.validateDataTableFields(locator, field);
        value = true;
        break;

      case COMPONENT_TYPES.DATE_PICKER:
        const date = faker.date.past();
        value = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  });
        await locator.fill(value);
        break;

      case COMPONENT_TYPES.TEXT_INPUT_MULTIPLE:
        const latitude = faker.location.latitude();
        const longitude = faker.location.longitude();
        value = `${latitude}, ${longitude}`;
        await locator.locator('input').fill(value);
        break;

      default:
        value = faker.lorem.words(2);
        await locator.fill(value);
    }

    const projectdataFilePath = './tests/data/Project-data.json';
    await this.saveData({ [field.name]: value }, 'ProjectData', projectdataFilePath);
  }


  // Function to save new data to the JSON file by merging it with existing data
  async saveData(newData, section, dataFilePath) {
    let data = {};
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(rawData);
    data[section] = { ...data[section], ...newData };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  }

  // Function to retrieve data from the JSON file
  async getData(section, dataFilePath) {
    let data = {};
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(rawData);
    return data[section] || {};
  }


  /**
   * Fill display dependency field 
   */
  async FillDisplayDependenciesField(locator, displayDependencyField, field) {

    switch (displayDependencyField.component) {

      case COMPONENT_TYPES.SELECT:
        await this.fillSelectField(locator, displayDependencyField.label, field.display_dependencies[0]?.pattern);
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        const patterns = field.display_dependencies[0]?.pattern.split("|").map(p => p.trim()); // Split and trim values
        for (const pattern of patterns) {
          await this.fillMultiSelectField(locator, displayDependencyField.label, pattern);
        }
        break;

      case COMPONENT_TYPES.RADIO:
      case COMPONENT_TYPES.RADIOYN:
      case COMPONENT_TYPES.RADIOIDK:
        await this.fillRadioField(locator, field.display_dependencies[0]?.pattern, displayDependencyField.label);
        break;

      case COMPONENT_TYPES.CHECKBOX:
        await this.fillCheckboxField(locator, field.component);
        break;
    }
  }

  // Fill Multi Select Field
  async fillMultiSelectField(locator, label, value) {
    const selectedValuesText = await locator.textContent();

    if (selectedValuesText.includes(value)) {
      console.log(`Value "${value}" is already selected. Skipping.`);
      return;
    }
    await locator.click();
    const listbox = await this.listBox(label);
    if (!(await listbox.isVisible())) {
      await locator.click();
    }
    const optionLocator = listbox.locator(`text="${value}"`);
    await expect(optionLocator).toBeVisible();
    await optionLocator.click();
    const selectedValue = await locator.textContent();
    expect(selectedValue).toContain(value);
    const indicator = await locator.locator('.select-indicator');
    await indicator.click();
  }

  // Fill Select Field
  async fillSelectField(locator, label, value) {
    const values = value.split('|').map(v => v.trim());
    await locator.click();
    const listbox = await this.listBox(label);
    if(values.length > 1){
      value = values[0];
    }
    const optionLocator = listbox.locator(`text="${value}"`);
    await expect(optionLocator).toBeVisible();
    await optionLocator.click();
    expect(locator).toHaveText(value);
  }

  // check the Radio Field
  async fillRadioField(locator, value, label) {
    const radiolocator = await locator.locator('.radio-container').getByText(value);
    const isChecked = await radiolocator.isChecked();
    console.log(`radio - ${label}`, isChecked);
    if (!isChecked) {
      await radiolocator.check();
      await expect(radiolocator).toBeChecked();
    }
  }

  async fillCheckboxField(locator, displayDependencylabel, value) {

  }

  /**
   * Validates field attributes and behavior
   */
  async validateFieldAfterCancel(locator, field) {

    // Validate field attributes
    switch (field.component) {
      case COMPONENT_TYPES.TEXT_INPUT:
        const testValue = field.type === FIELD_TYPES.STRING ? 'Test Input' : '123';
        const inputText = await locator.inputValue();
        expect(inputText).toBe(testValue);
        break;

      case COMPONENT_TYPES.TEXTAREA:
        const testareaValue = field.type === FIELD_TYPES.STRING ? 'Test Input' : '123';
        const textarea = await locator.textContent();
        expect(textarea).toBe(testareaValue)
        break;

      case COMPONENT_TYPES.SELECT:
        const selectedValuesText = await locator.textContent();
        let expectedValue;
        if (field.options[field.options.length - 1] == 'Other') {
          expectedValue = field.options[field.options.length - 2]
        } else if(field.label == 'Project type'){
          expectedValue = "Improved Forest Management (IFM)";
        }else {
          expectedValue = field.options[field.options.length - 1]
        }
        await expect(selectedValuesText).toBe(expectedValue);
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        const selectedmultiValuesText = await locator.textContent();
        for (const option of field.options) {
          await expect(selectedmultiValuesText).toContain(option);
        }
        break;

      case COMPONENT_TYPES.METHODOLOGY_SELECT:
        const MethodologyselectedValuesText = await locator.textContent();
        await expect(MethodologyselectedValuesText).toBe('QA (ACR 1.3 test methodology)');
        console.log('select', MethodologyselectedValuesText)

        break;

      case COMPONENT_TYPES.RADIOYN:
      case COMPONENT_TYPES.RADIOIDK:
        const radiolocator = await locator.locator('.radio-container').getByText('Yes');
        const isChecked = await radiolocator.isChecked();
        expect(isChecked).toBe(true);
        break;

      case COMPONENT_TYPES.CHECKBOX:
        for (const option of field.options) {
          const checkBoxlocator = await locator.getByText(option);
          const isChecked = await checkBoxlocator.isChecked();
          expect(isChecked).toBe(true);
        }
        break;

      case COMPONENT_TYPES.YEAR_INPUT:
        const yearText = await locator.inputValue();
        expect(yearText).toBe('');
        break;

    }
  }


  async validateFieldAfterDiscard(locator, field) {

    // Validate field attributes
    switch (field.component) {
      case COMPONENT_TYPES.TEXT_INPUT:
        const inputText = await locator.inputValue();
        if (field.label == "Project name") {
          expect(inputText).toBe(project.uiProjectName);
          break;
        }
        expect(inputText).toBe('');
        break;

      case COMPONENT_TYPES.TEXTAREA:
        const textarea = await locator.textContent();
        expect(textarea).toBe('')
        break;

      case COMPONENT_TYPES.SELECT:
        const selectedValuesText = await locator.textContent();
        await expect(selectedValuesText).toBe('');
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        const selectedmultiValuesText = await locator.textContent();
        if (field.label == 'Classification category') {
          await expect(["Carbon removal", ""].includes(selectedmultiValuesText)).toBe(true);
          break;
        }
        await expect(selectedmultiValuesText).toBe('');
        break;

      case COMPONENT_TYPES.METHODOLOGY_SELECT:
        const MethodologyselectedValuesText = await locator.textContent();
        await expect(MethodologyselectedValuesText).toBe('QA (ACR 1.3 test methodology)');
        console.log('select', MethodologyselectedValuesText)
        break;

      case COMPONENT_TYPES.RADIOYN:
      case COMPONENT_TYPES.RADIOIDK:
        const radiolocator = await locator.locator('.radio-container').getByText('Yes');
        const isChecked = await radiolocator.isChecked();
        expect(isChecked).toBe(false);
        break;

      case COMPONENT_TYPES.CHECKBOX:
        for (const option of field.options) {
          const checkBoxlocator = await locator.getByText(option);
          const isChecked = await checkBoxlocator.isChecked();
          expect(isChecked).toBe(false);
        }
        break;

      case COMPONENT_TYPES.YEAR_INPUT:
        const yearText = await locator.inputValue();
        expect(yearText).toBe('');
        break;

    }
  }


  async checkStepVisibility(stepElement, step, test) {
    if (! await stepElement.isVisible()) {
      test.skip(true, `Step '${step.label}' is not visible - skipping validation`);
    }
  }

  async checkValidateField(step, test) {
    const hasValidField = await step.sections?.some(section =>
      section.field_groups?.some(fieldGroup =>
        fieldGroup.fields?.some(field =>
          field.display_dependencies == null &&
          field.component !== 'file-upload-multiple' &&
          field.component !== 'media-carousel' &&
          field.component !== 'data-table' &&
          field.component !== 'data-grid'
        )
      )
    );

    if (!hasValidField) {
      test.skip(true, `In this Step ${step.label} not filed available other than file-upload - skipping validation`);
    }
  }


  async handleDisplayDependencies(step, field, formData, selectedFields, topic) {
    let isNewlyVisible = false;

    if (!field?.display_dependencies) {
      return; // Exit if there are no display dependencies
    }

    const fieldExists = selectedFields.some(
      item =>
        item.name === field.display_dependencies[0]?.field &&
        item.value === field.display_dependencies[0]?.pattern
    );

    if (fieldExists) {
      return; // Exit if the dependent field is already handled
    }

    let dependencyField = await this.findDependencyField(step, field.display_dependencies[0]?.field);

    if (!dependencyField) {
      const dependentFieldDetails = await this.findDependencyFieldInTopics(formData, field.display_dependencies[0]?.field);
      const topicLabelElement = await this.findLabel(dependentFieldDetails.topicLabel);
      await topicLabelElement.click();

      const stepLabelElement = await this.findLabel(dependentFieldDetails.stepLabel);
      await stepLabelElement.click();

      dependencyField = await dependentFieldDetails?.field;
      isNewlyVisible = true;
    }

    // Check if the dependency field has its own display dependencies
    if (dependencyField?.display_dependencies) {
      // Process dependency field's own dependencies first
      await this.handleDisplayDependencies(
        step,
        dependencyField,
        formData,
        selectedFields,
        topic
      );
    }

    const dependencyFieldLocator = await this.getLocator(dependencyField.name, dependencyField.label, dependencyField.type, dependencyField.component);
    await expect(dependencyFieldLocator).toBeVisible();

    // Fill the display dependencies field
    await this.FillDisplayDependenciesField(dependencyFieldLocator, dependencyField, field);

    if (isNewlyVisible) {
      await this.navigateToFieldContext(topic, step);
    }

    const fieldName = field.display_dependencies[0]?.field;
    const fieldValue = field.display_dependencies[0]?.pattern;
    const existingIndex = selectedFields.findIndex(item => item.name === fieldName);
    if (existingIndex !== -1) {
      selectedFields[existingIndex].value = fieldValue;
    } else {
      selectedFields.push({ name: fieldName, value: fieldValue });
    }

  }

  async findDependencyField(step, dependencyName) {
    return step.sections
      ?.flatMap(sec => sec?.field_groups ?? [])
      .flatMap(group => group?.fields ?? [])
      .find(field => field?.name === dependencyName);
  }

  async findDependencyFieldInTopics(formData, dependencyName) {
    for (const topic of formData.topics) {
      for (const stepGroup of topic.step_groups || []) {
        for (const step of stepGroup.steps || []) {
          for (const section of step.sections || []) {
            for (const fieldGroup of section.field_groups || []) {
              const field = fieldGroup.fields?.find(f => f.name === dependencyName);
              if (field) {
                return {
                  topicLabel: topic?.label,
                  stepLabel: step?.label,
                  field
                };
              }
            }
          }
        }
      }
    }
    return null;
  }

  async navigateToFieldContext(topic, step) {
    const topicElement = await this.findLabel(topic.label)
    const dataState = await topicElement.locator('..').getAttribute('data-state');

    if (dataState != 'open') {
      const saveButton = await this.saveButton();
      if (await saveButton.isEnabled()) {
        await saveButton.click();
        await expect(await this.successMessageHeader()).toBeVisible({timeout: 20000});
        await expect(saveButton).toBeDisabled();
      }

      await topicElement.click();
    };

    const stepElement = await this.findStep(step.name);
    const stepState = await stepElement.getAttribute('class');
    if (!stepState?.includes('active')) {
      await stepElement.click();
    }
  }


  async validateFieldAfterSave(locator, field, value) {
   
    switch (field.component) {

      case COMPONENT_TYPES.TEXT_INPUT:
          expect(locator).toHaveValue(value);
        break;

      case COMPONENT_TYPES.RICH_TEXT:
      case COMPONENT_TYPES.TEXTAREA:
          await expect(locator).toHaveText(value)
        break;

      case COMPONENT_TYPES.SELECT:
        await expect(locator).toHaveText(value);
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        const selectMultipleallText = await locator.locator('span > div').allTextContents();
        await expect(selectMultipleallText).toEqual(value);
        break;

      case COMPONENT_TYPES.COUNTRY_SELECT:
        const countrySelectallText = await locator.locator('.autocomplete-control').allTextContents();
        await expect(countrySelectallText).toEqual([value]);
        break;

      case COMPONENT_TYPES.YEAR_INPUT:
        expect(locator).toHaveValue(value);
        break;

      case COMPONENT_TYPES.MEDIA_CAROUSEL:
      case COMPONENT_TYPES.FILE_UPLOAD_MULTIPLE:
      case COMPONENT_TYPES.FILE_UPLOAD:   
        const lastLi = await locator.locator('..').locator('ul li').nth(-1);     
        const lastLiFileName = await lastLi.locator('.file-name-container');
        const lastLiText = await lastLiFileName.textContent();
        await expect(lastLiText).toBe('file2.png');
        value = "file2.png";
        break;

      case COMPONENT_TYPES.RADIOYN:
      case COMPONENT_TYPES.RADIOIDK:
        const radiolocator = await locator.locator('.radio-container').getByText('Yes');
        const isChecked = await radiolocator.isChecked();
        expect(isChecked).toBe(true);
        break;

      case COMPONENT_TYPES.CHECKBOX:
        for (const option of field.options) {
          const checkBoxlocator = await locator.getByText(option);
          const isChecked = await checkBoxlocator.isChecked();
          await expect(isChecked).toBe(true);
        }
        break;  

      case COMPONENT_TYPES.RADIO:
        value = field.options[0];
        const radioOption = await locator.locator('.radio-container').getByText(value);
        const isRadioChecked = await radioOption.isChecked();
        await expect(isRadioChecked).toBe(true);
        break;

      case COMPONENT_TYPES.DATA_GRID:
        const projectdataFilePath = './tests/data/Project-data.json';
        const data = await this.getData('ProjectData', projectdataFilePath);
        const startYear = data["creditStart-nameValue-nameValue"];
        const endyear = data["creditEnd-nameValue-nameValue"];

        const dataGridField = await locator.getByRole('grid');
        await expect(dataGridField).toBeVisible();
        const headerVeiwPort = await dataGridField.locator('.ag-header-viewport ');

        for (const option of field.options) {
          await headerVeiwPort.evaluate(el => el.scrollLeft = 0);

          const colName = await dataGridField.getByText(option.label);
          await expect(colName).toBeVisible();
          await expect(colName).toHaveText(option.label);
          for (let i = 0; i <= endyear - startYear; i++) {
            await headerVeiwPort.evaluate(el => el.scrollBy({ left: 150, behavior: 'smooth' }));
            const colId = Number(startYear);
            const rowIndex = await dataGridField.locator('.ag-center-cols-viewport').locator(`[row-id="${option.name}"]`);
            await expect(rowIndex).toBeVisible();
            const colheader = await rowIndex.locator(`[col-id="${colId + i}"]`);
            await expect(colheader).toBeVisible();
            await expect(colheader).toHaveText((colId + i).toLocaleString());
          }
        }
        break;

      case COMPONENT_TYPES.DATA_TABLE:
            const firstRow = await locator.locator('[row-id="0"]');
          for(const column of field.columns){
            if(column.component == 'text-input' || column.component == 'textarea'){
            const testValue = column.type === 'string' ? 'Test Input' : '123';
            await expect(await firstRow.locator(`[col-id="${column.column_id}"]`)).toBeVisible();
            await expect(await firstRow.locator(`[col-id="${column.column_id}"]`)).toHaveText(testValue);
            }else if(column.component == 'select'){
            }else if(column.component == 'date-picker'){
              await expect(await firstRow.locator(`[col-id="${column.column_id}"]`)).toBeVisible();
              await expect(await firstRow.locator(`[col-id="${column.column_id}"]`)).toHaveText("06/26/2025");
            }
            
          }
        break;

      case COMPONENT_TYPES.DATE_PICKER:
        await expect(locator).toHaveValue(value);
        break;

      case COMPONENT_TYPES.TEXT_INPUT_MULTIPLE:
       expect(await locator.locator('input')).toHaveValue(value);
        break;

      default:
          console.log('default', locator, value)
    }

  }

}
