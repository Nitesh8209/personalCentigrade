import { expect } from '@playwright/test';

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
  TEXTAREA: 'textarea',
  SELECT: 'select',
  SELECT_MULTIPLE: 'select-multiple',
  METHODOLOGY_SELECT: 'methodology-select',
  COUNTRY_SELECT: 'country-select',
  RADIO: 'radio-y-n',
  RADIOIDK: 'radio-y-n-idk',
  CHECKBOX: 'checkbox',
  YEAR_INPUT: 'year-input',
  MEDIA_CAROUSEL: 'media-carousel',
  FILE_UPLOAD: 'file-upload-multiple',
  DATE_PICKER: 'date-picker',
  DATA_GRID: 'data-grid',
  DATA_TABLE: 'data-table',
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
      return this.page.getByRole('combobox', { name: fieldLabel });
    }

    // Handle special input types
    if (component === COMPONENT_TYPES.MEDIA_CAROUSEL) {
      return this.page.locator(`input[name="${fieldName}"][type="file"]`);
    }

    if (component === COMPONENT_TYPES.YEAR_INPUT) {
      return this.page.locator(`input[name="${fieldName}"][data-scope="number-input"]`);
    }

    if (component === COMPONENT_TYPES.CHECKBOX) {
      return this.page.locator('label').getByText(fieldLabel, { exact: true }).locator('..').locator('..').locator('.checkbox-group-options');
    }

    if (component === COMPONENT_TYPES.COUNTRY_SELECT) {
      return this.page.getByText(fieldLabel, { exact: true });
    }

    if (component === COMPONENT_TYPES.DATA_GRID) {
      return this.page.getByText(fieldLabel, { exact: true }).locator('..').locator('..').getByRole('treegrid');
    }

    if (component === COMPONENT_TYPES.DATA_TABLE) {
      return this.page.getByText(fieldLabel, { exact: true }).locator('..').locator('..').locator('.ag-theme-quartz');
    }

    if (component === COMPONENT_TYPES.RADIO) {
      return this.page.getByLabel(fieldLabel, { exact: true });
    }

    // Handle standard field types
    switch (fieldType) {
      case FIELD_TYPES.INTEGER:
      case FIELD_TYPES.ARRAY:
        return this.page.locator(`[name='${fieldName}']`);

      case FIELD_TYPES.BOOLEAN:
        return this.page.getByLabel(fieldLabel, { exact: true })

      default:
        return this.page.getByLabel(fieldLabel, { exact: true });
    }
  }

  async findLabel(label) {
    return this.page.getByText(label, { exact: true });
  }

  async findStep(step) {
    return this.page.locator('.nav-menu').getByRole('link', { name: step, exact: true });
  }

  async BreadCrumps() {
    return this.page.locator('ol.breadcrumbs > li.breadcrumb');
  }

  async separators() {
    return this.page.locator('ol.breadcrumbs > li.breadcrumb-separator');
  }

  async BreadCrumpDetail(number) {
    const breadCrumbsLocator = await this.BreadCrumps();
    return breadCrumbsLocator.nth(number).locator('a');
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
    return this.page.getByRole('button', { name: 'Save' });
  }

  async unsavedChangeModal() {
    return await this.page.getByLabel('Unsaved changes');
  }

  async unsavedChangeheading() {
    return await this.page.getByRole('heading', { name: 'Unsaved changes' });
  }

  async unsavedChangediscription() {
    return await this.page.getByText('Are you sure you want to');
  }

  async unsavedChangetext() {
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
    return this.page.locator('.toast-content > header');
  }

  async successMessagediv() {
    return this.page.locator('.toast-content > div');
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
        await this.validateSelectField(locator, field.label, field.options);
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        const normalizedExpectedMultipleOptions = field.options[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        await this.fillSelectField(locator, field.label, normalizedExpectedMultipleOptions);
        const indicator = await locator.locator('.select-indicator');
        await indicator.click();
        break;

      case COMPONENT_TYPES.METHODOLOGY_SELECT:
        await this.validateMethodologySelectField(locator);
        break;

      case COMPONENT_TYPES.RADIO:
      case COMPONENT_TYPES.RADIOIDK:
        await expect(locator).toHaveAttribute('data-scope', 'radio-group');
        await this.validateRadioField(locator, field.component);
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
        await this.ValidateDataGridFields(locator, field);
        break;

      case COMPONENT_TYPES.DATA_TABLE:
        await this.ValidateDataTableFields(locator, field);
        break;
    }
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
    }
  }

  // selct the filed in the data Table
  async dataTableSelectField(locator, dataTableLocator, field) {
    for (const option of field.options) {
      await locator.click();
      const listBox = await dataTableLocator.getByRole('listbox');
      await expect(listBox).toBeVisible();
      const optionText = await listBox.getByText(option);
      await expect(optionText).toBeVisible();
      await expect(optionText).toHaveText(option);
      await optionText.click();
      await expect(locator).toHaveText(option);
    }
  }

  // Fill the Input Field In the Data Table
  async dataTableInputField(locator, field) {
    const inputField = await locator.locator('input');
    await inputField.click();

    const testValue = field.type === FIELD_TYPES.STRING ? 'Test Input' : '123';
    await inputField.type(testValue);
    await expect(inputField).toHaveValue(testValue);

  }

  // Fill the Text Area Field in the Data Table
  async dataTableTextAreaField(locator, field) {
    const inputField = await locator.locator('textarea');
    await inputField.click();

    const testValue = field.type === FIELD_TYPES.STRING ? 'Test Input' : '123';
    await inputField.type(testValue);
    await expect(inputField).toHaveValue(testValue);
  }

  // Validating hte Data Table Fields 
  async ValidateDataTableFields(locator, field) {
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
    }
  }

  // Validating the Data Grid Fields 
  async ValidateDataGridFields(locator, field) {
    const header = await locator.locator('.ag-pinned-left-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('Vintage');

    const headerVeiwPort = await locator.locator('.ag-header-viewport');
    await expect(headerVeiwPort).toBeVisible();

    for (let i = 0; i < 11; i++) {
      const colId = 2010;
      const colheader = await headerVeiwPort.locator(`[col-id="${colId + i}"]`);
      await expect(colheader).toBeVisible();
      await expect(colheader).toHaveText(String(colId + i));
    }

    for (const option of field.options) {
      console.log(option);
      const colName = await locator.getByText(option.label);
      await expect(colName).toBeVisible();
      await expect(colName).toHaveText(option.label);
      for (let i = 0; i < 11; i++) {
        const colId = 2010;
        const rowIndex = await locator.locator('.ag-center-cols-viewport').locator(`[row-id="${option.name}"]`);
        await expect(rowIndex).toBeVisible();
        const colheader = await rowIndex.locator(`[col-id="${colId + i}"]`);
        await expect(colheader).toBeVisible();
        await colheader.type(String(colId + i));
        await colName.click();
        console.log((colId + i).toLocaleString());
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
    return this.page.getByRole('listbox', { name: label })
  }

  async validateMethodologySelectField(locator) {
    await expect(locator).toBeDisabled();
  }

  /**
 * Validates select fields
 */
  async validateSelectField(locator, label, expectedOptions) {
    await locator.click();
    const listBox = await this.listBox(label);
    await expect(listBox).toBeVisible();

    const optionsText = await listBox.innerText();
    const options = optionsText.split('\n').map(option => option.trim());

    const normalizedExpectedOptions = expectedOptions.map(option =>
      option.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    );

    expect(options.length).toBeGreaterThan(0);
    expect(options).toEqual(normalizedExpectedOptions);
    await locator.click();
    for (const expectedOption of normalizedExpectedOptions) {
      if (expectedOption === 'Other') {
        continue;
      }
      await locator.click();
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
  async validateRadioField(locator, component) {
    const radiolocator = locator.getByText('Yes');
    await radiolocator.check();
    await expect(radiolocator).toBeChecked();
    await radiolocator.uncheck();
    await expect(radiolocator).not.toBeChecked();
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
      await checkbox.click();
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
  async fillNumberField(locator, label) {
    if (label.includes('start year')) {
      await locator.fill('2010');
      await expect(locator).toHaveValue('2010');
    } else {
      await locator.fill('2020');
      await expect(locator).toHaveValue('2020');
    }

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
  async validateLabel(label) {
    return this.page.locator('label').getByText(label, { exact: true });
  }


  /**
 * Validates helper text
 */
  async validateHelperText(locator, helperText) {
    return locator.locator('..').locator('..').getByText(helperText);
  }

  /**
* Fills field with test data
*/
  async fillField(locator, filePath, field) {
    switch (field.component) {

      case COMPONENT_TYPES.TEXT_INPUT:
      case COMPONENT_TYPES.TEXTAREA:
        if (FIELD_TYPES.NUMBER === field.type || FIELD_TYPES.INTEGER === field.type) {
          await locator.fill('80');
        } else {
          await locator.fill('Test Input');
        }
        break;

      case COMPONENT_TYPES.SELECT:
        const normalizedExpectedOptions = field.options[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        await this.fillSelectField(locator, field.label, normalizedExpectedOptions);
        break;

      case COMPONENT_TYPES.SELECT_MULTIPLE:
        for (const option of field.options) {
          const optionLocator = listbox.locator(`text="${option}"`);
          await expect(optionLocator).toBeVisible();
          await optionLocator.click();
          console.log(`Selected value: ${option}`);
        }
        const indicator = await locator.locator('.select-indicator');
        await indicator.click();
        const selectedValues = await locator.textContent();
        for (const value of field.options) {
          expect(selectedValues).toContain(value);
        }
        // const normalizedExpectedMultipleOptions = field.options[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        // await this.fillMultiSelectField(locator, field.label, normalizedExpectedMultipleOptions);
        // const indicator = await locator.locator('.select-indicator');
        // await indicator.click();
        break;

      case COMPONENT_TYPES.COUNTRY_SELECT:
        await locator.click();
        await locator.fill('United States of America');
        await expect(await this.listBox(field.label)).toBeVisible();
        await this.page.locator('.autocomplete-option').click();
        await this.page.locator('.step-title').click();
        break;

      case COMPONENT_TYPES.METHODOLOGY_SELECT:
        await this.validateMethodologySelectField(locator);
        break;

      case COMPONENT_TYPES.YEAR_INPUT:
        await this.fillNumberField(locator, field.label);
        break;

      case COMPONENT_TYPES.MEDIA_CAROUSEL:
      case COMPONENT_TYPES.FILE_UPLOAD:
        await this.page.waitForTimeout(3000);
        await locator.setInputFiles(filePath);
        const lastLi = await locator.locator('..').locator('ul li').nth(-1);
        const lastLiFilePreview = await lastLi.locator('.file-preview > svg');
        await expect(lastLiFilePreview).toBeVisible();
        const lastLiFileName = await lastLi.locator('.file-name-container');
        const lastLiText = await lastLiFileName.textContent();
        await expect(lastLiText).toBe('file2.png');

        break;

      case COMPONENT_TYPES.CHECKBOX:
        await this.validateCheckboxField(locator, field.component);
        break;

      case COMPONENT_TYPES.RADIO:
      case COMPONENT_TYPES.RADIOIDK:
        const radiolocator = locator.getByText('Yes');
        await radiolocator.check();
        break;

      case COMPONENT_TYPES.DATA_GRID:
        await this.ValidateDataGridFields(locator, field);
        break;

      case COMPONENT_TYPES.DATA_TABLE:
        await this.ValidateDataTableFields(locator, field);
        break;

      default:
        await locator.fill('Test Input');
    }
  }


  /**
   * Fill display dependency field 
   */
  async FilldisplayDependenciesField(locator, displayDependencyField, field) {

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
    const selectedValues = selectedValuesText.split(',').map((val) => val.trim());

    console.log('value', value);
    console.log('selectedValue', selectedValues);

    if (selectedValues.includes(value)) {
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
    expect(selectedValue).toBe(value);
    const indicator = await locator.locator('.select-indicator');
    await indicator.click();
  }

  // Fill Select Field
  async fillSelectField(locator, label, value) {
    await locator.click();
    const listbox = await this.listBox(label);
    const optionLocator = listbox.locator(`text="${value}"`);
    await expect(optionLocator).toBeVisible();
    await optionLocator.click();
    const selectedValue = await locator.innerText();
    console.log(selectedValue);
    console.log(value)
    expect(selectedValue).toBe(value);
  }

  // check the Radio Field
  async fillRadioField(locator, value, label) {
    const radiolocator = await locator.getByText(value);
    const isChecked = await radiolocator.isChecked();
    console.log(`radio - ${label}`, isChecked);
    if (!isChecked) {
      await radiolocator.check();
      await expect(radiolocator).toBeChecked();
    }
  }

  async fillCheckboxField(locator, displayDependencylabel, value) {

  }

}
