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
    if (component === COMPONENT_TYPES.MEDIA_CAROUSEL || component === COMPONENT_TYPES.FILE_UPLOAD_MULTIPLE || component === COMPONENT_TYPES.FILE_UPLOAD) {
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

    if (component === COMPONENT_TYPES.RADIOYN || component === COMPONENT_TYPES.RADIO || component === COMPONENT_TYPES.RADIOIDK) {
      return this.page.getByRole('radiogroup', { name: fieldLabel });
    }

    if (component === COMPONENT_TYPES.TEXT_INPUT_MULTIPLE) {
      return this.page.locator('label').getByText(fieldLabel, { exact: true }).locator('..').locator('..');
    }

    if (component === COMPONENT_TYPES.TEXT_INPUT) {
      return this.page.locator('.input').getByLabel(fieldLabel, { exact: true });;
    }

    if (component === COMPONENT_TYPES.TEXTAREA) {
      return this.page.getByLabel(fieldLabel, { exact: true });
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
    return this.page.getByText(label, { exact: true });
  }

  async findStep(step) {
    return this.page.locator('.nav-menu').getByRole('link', { name: step, exact: true });
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
    if (expectedHref) {
      await expect(breadcrumb).toHaveAttribute('href', expectedHref);
    } else {
      await expect(breadcrumb).toHaveText(expectedText);
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
    return this.page.getByRole('button', { name: 'Save' , exact: true });
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
        const indicator = await locator.locator('.select-indicator');
        const listbox = await this.listBox(field.label);
        if (!(await listbox.isVisible())) {
        await indicator.click();
        }
        for (const option of field.options) {
          const selectedValuesText = await locator.textContent();
          if (selectedValuesText.includes(option)) continue;
          const optionLocator = listbox.locator(`text="${option}"`);
          await expect(optionLocator).toBeVisible();
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
    }
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
    }
  }

  //Validate the Warning Banner in Data Grid 
  async validateDataGridWarningBanner(locator) {
    const banner = await locator.locator('..').locator('..').locator('.banner');
    await expect(banner).toBeVisible();

    const bannerHeading = await banner.getByRole('heading', { name: 'Period not defined' });
    expect(bannerHeading).toBeVisible();
    expect(bannerHeading).toHaveText('Period not defined');

    const bannerContent = await banner.locator('.banner-content > div');
    await expect(bannerContent).toBeVisible();
    await expect(bannerContent).toHaveText('To enter data, use "Crediting start year" and "Crediting end year" in Tier 0 - Project details to define the period');

    const bannerLink = await banner.getByRole('link', { name: 'Go to Project details' });
    await expect(bannerLink).toBeVisible();
    await expect(bannerLink).toHaveAttribute('href', /\/projects\/\d+\/project-details/);

  }

  // Validating the Data Grid Fields 
  async validateDataGridFields(locator, field) {
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
    // Click to open dropdown
    await locator.click();
    const listBox = await this.listBox(label);

    // If dropdown isn't visible after first click, try clicking again
    if (!(await listBox.isVisible())) {
      await locator.click();
    }
    await expect(listBox).toBeVisible();

    const options = await listBox.getByRole('option').allInnerTexts();
    const normalizedExpectedOptions = expectedOptions.map(option =>
      option.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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
    const radiolocator = locator.getByText('Yes');
    await radiolocator.check();
    await expect(radiolocator).toBeChecked();
    await radiolocator.uncheck();
    await expect(radiolocator).not.toBeChecked();
    await radiolocator.check();
  }

  async validateRadioField(locator, options) {
    for (const option of options) {
      const radioLocator = locator.getByText(option, { exact: true });
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
  await radiolocatorIDK.uncheck();
  await expect(radiolocatorIDK).not.toBeChecked();

    // Recheck "Yes" to ensure behavior
    await locator.getByText("Yes").check();
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

  async validateLabel(field) {

    // Validate field attributes
    switch (field.component) {
      case COMPONENT_TYPES.TEXT_INPUT:
        return this.page.locator('.input').locator('label').getByText(field.label, { exact: true });

      case COMPONENT_TYPES.SELECT:
        return this.page.locator('.select').locator('label').getByText(field.label, { exact: true });

      default:
        return this.page.locator('label').getByText(field.label, { exact: true });

    }
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

  async checkStepVisibility(stepElement, step, test) {
    if (! await stepElement.isVisible()) {
        test.skip(true, `Step '${step.label}' is not visible - skipping validation`);
    }
  }

  async checkValidateField(step, testInfo, test) {
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
      testInfo.annotations.push({
        type: "skip Reason",
        description: `In this Step ${step.label} not filed available other than file-upload - skipping validation`
      }),
        test.skip('Skipping this test as the Step is not visible');
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

    const dependencyFieldLocator = await this.getLocator(dependencyField.name, dependencyField.label, dependencyField.type, dependencyField.component);
    await expect(dependencyFieldLocator).toBeVisible();

    // Fill the display dependencies field
    await this.FillDisplayDependenciesField(inputLocator, dependencyField, field);

    if(isNewlyVisible){
      await this.navigateToFieldContext(topic, step);
    }

    selectedFields.push({
      name: field.display_dependencies[0]?.field,
      value: field.display_dependencies[0]?.pattern,
    })

    await this.handleDisplayDependencies(
      step,
      dependencyField,
      formData,
      selectedFields,
      topic
    );

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
        await expect(await this.successMessageHeader()).toBeVisible();
        await expect(saveButton).toBeDisabled();
      }
      
      await topicElement.click();
    };

    const stepElement = await this.findStep(step.label);
    const stepState = await stepElement.getAttribute('class');
    if (!stepState?.includes('active')) {
      await stepElement.click();
    }
  }

}
