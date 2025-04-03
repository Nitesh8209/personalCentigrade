import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { ProjectsPage } from '../../pages/projectsPage';
import { getData } from '../utils/apiHelper';
import API_ENDPOINTS from '../../api/apiEndpoints';
import { publishProjectData } from '../data/IntegrationtestData';
import path from 'path';
import { findByText, interactWithField } from '../utils/projectHelper';
import { ProjectDetailsPage } from '../../pages/ProjectdetailsPage';
const fs = require('fs');

test.describe('Add data for publishing the project', () => {
  const { newEmail, projectId } = getData('Integration');
  const authStoragePath = path.join(__dirname, '..', 'data', 'auth-admin.json');
  test.use({ storageState: authStoragePath });
  const outputPath = path.join(__dirname, '..', 'data', 'form-data.json');
  const jsonData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  const topics = jsonData.topics;
  // const labelToClick = topics[0].label;
  // const step_group = topics[0].step_groups[0].steps[0].label;
  // const section = topics[0].step_groups[0].steps[0].sections[0];
  // const field_groups = section.field_groups[1];
  // const fields = field_groups.fields[2];
  // const fieldLabel = fields.label;
  // const fieldName = fields.name;
  // const fieldType = fields.type;
  // const componentType = fields.component;
  // const helper_text = fields.helper_text;


  test.beforeEach(async ({ page, baseURL }) => {
    // Initialize browser and login
    console.log(topics.length);
    const loginPage = new LoginPage(page, baseURL);

    await loginPage.navigate();


    const projectsPage = new ProjectsPage(page, baseURL);
    await projectsPage.viewProject();

    // Wait for responses related to project and modular benefits
    const [projectResponse, mbpResponse] = await Promise.all([
      page.waitForResponse(response =>
        response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}`) &&
        response.status() === 200
      ),
      page.waitForResponse(response =>
        response.url().includes(`${API_ENDPOINTS.createProject}/${projectId}/modular-benefit-project`) &&
        response.status() === 200
      )
    ]);

    // Verify responses for project and modular benefit endpoints
    expect(projectResponse.status()).toBe(200);
    expect(mbpResponse.status()).toBe(200);
    await expect(page).toHaveURL(`${baseURL}/projects/${projectId}/overview`);

    const projectTitle = await projectsPage.projectTitle();
    expect(projectTitle).toBe('Automationproject3');


    const topic = topics[0];
    if (topic) {
      // console.log(`\n--- Topic ${topicIndex + 1}: "${topic.label}" ---`);
      expect(topic.name).toBeDefined();
      expect(topic.label).toBeDefined();
      expect(topic.step_groups).toBeDefined();
      expect(Array.isArray(topic.step_groups)).toBeTruthy();

      // Validate step_groups
      console.log(`Step Groups count: ${topic.step_groups.length}`);
      expect(topic.step_groups.length).toBeGreaterThan(0);
      await expect(page.locator(`text="${topic.label}"`)).toBeVisible();
      await page.click(`text="${topic.label}"`);
    }
  });


    // Disable specific UI elements
    // await page.addStyleTag({
    //   content: '#zsfeedbackwidgetdiv { pointer-events: none; }'
    // });

    const topic = topics[0];
    if (topic) {
      // console.log(`\n--- Topic ${topicIndex + 1}: "${topic.label}" ---`);
      // expect(topic.name).toBeDefined();
      // expect(topic.label).toBeDefined();
      // expect(topic.step_groups).toBeDefined();
      // expect(Array.isArray(topic.step_groups)).toBeTruthy();

      // // Validate step_groups
      // console.log(`Step Groups count: ${topic.step_groups.length}`);
      // expect(topic.step_groups.length).toBeGreaterThan(0);
      // await expect(page.locator(`text="${topic.label}"`)).toBeVisible();
      // await page.click(`text="${topic.label}"`);

      for (let stepGroupIndex = 0; stepGroupIndex< topic.step_groups.length; stepGroupIndex++) {

        const stepGroup = topic.step_groups[stepGroupIndex];
        console.log(`\nStep Group ${stepGroupIndex + 1}: "${stepGroup.label || 'Unnamed'}"`);

        // Validate step_group properties
        expect(stepGroup.steps).toBeDefined();
        expect(Array.isArray(stepGroup.steps)).toBeTruthy();

        // Validate steps
        console.log(`Steps count: ${stepGroup.steps.length}`);
        expect(stepGroup.steps.length).toBeGreaterThan(0);

        for (let stepIndex = 0; stepIndex < stepGroup.steps.length; stepIndex++) {
          const step = stepGroup.steps[stepIndex];
          console.log(`\nStep ${stepIndex + 1}: "${step.label || 'Unnamed'}"`);

          // Validate step properties
          expect(step.name).toBeDefined();
          expect(step.label).toBeDefined();
          expect(step.sections).toBeDefined();
          expect(Array.isArray(step.sections)).toBeTruthy();

         
         
       test(`Add data in form ${step.label}`, async ({ page }) => {

        const projectPage = new ProjectDetailsPage(page);

          // Validate sections
          console.log(`Sections count: ${step.sections.length}`);
          expect(step.sections.length).toBeGreaterThan(0);

          const label = await findByText(page, step.label);
          await expect(label).toBeVisible({timeout: 10000});
          await label.click();
          await page.waitForTimeout(5000);

          expect(await projectPage.stepTitle(step.label)).toBeVisible();
          expect(await projectPage.stepDescription()).toBeVisible();
          expect(await projectPage.stepDescription()).toHaveText(step.description);

          for (let sectionIndex = 0; sectionIndex < step.sections.length; sectionIndex++) {
            const section = step.sections[sectionIndex];
            console.log(`\nSection ${sectionIndex + 1}:`);

            // Validate section properties
            expect(section.name).toBeDefined();
            expect(section.field_groups).toBeDefined();
            // expect(Array.isArray(section.field_groups)).toBeTruthy();

            // Validate field_groups
            // console.log(`Field Groups count: ${section.field_groups.length}`);
            // expect(section.field_groups.length).toBeGreaterThan(0);

            if (section.field_groups != null) {
              for (let fieldGroupIndex = 0; fieldGroupIndex < section.field_groups.length; fieldGroupIndex++) {
                const fieldGroup = section.field_groups[fieldGroupIndex];

                console.log(`\nField Group ${fieldGroupIndex + 1}:`);

                // Validate field_group properties
                await expect(fieldGroup.name).toBeDefined();
                await expect(fieldGroup.label).toBeDefined();
                await expect(fieldGroup.fields).toBeDefined();
                // expect(Array.isArray(fieldGroup.fields)).toBeTruthy();

                // Validate fields
                // console.log(`Fields count: ${fieldGroup.fields.length}`);
                // expect(fieldGroup.fields.length).toBeGreaterThan(0);

                expect(await projectPage.formGrouplabel(fieldGroup.label)).toBeVisible();

                if (fieldGroup.fields != null) {
                  for (let fieldIndex = 0; fieldIndex < fieldGroup.fields.length; fieldIndex++) {
                    const field = fieldGroup.fields[fieldIndex];

                    console.log(`Field ${fieldIndex + 1}: "${field.label || 'Unnamed'}"`);

                    
                    if(field.display_dependencies == null ){
                      const labelName = await projectPage.fieldLabelName(field.label);
                      await expect(labelName).toBeVisible({ timeout: 10000 });
                      const fieldlocator = await interactWithField(page, field.type, field.name, field.label, field.component)
                      await expect(fieldlocator).toBeVisible({ timeout: 10000 });
                      await fieldlocator.fill('123');
                    }

                    // Validate required field properties
                    await expect(field.label).toBeDefined();
                    expect(field.name).toBeDefined();
                    expect(field.type).toBeDefined();
                    expect(field.component).toBeDefined();
                  }
                }

              }
            }


          }
        })
        }
      }
    };

    //   console.log(topics.length);
    //   console.log(topics[0].step_groups[0].steps[0].sections[0].field_groups[1].fields.length)
    //   await page.click(`text="${labelToClick}"`);
    //   await page.click(`text="${step_group}"`);
    //   console.log(fieldLabel);
    //   await expect(await page.getByText(`${fieldLabel}`)).toBeVisible({timeout: 10000});
    //   const field = await interactWithField(page, fieldType, fieldName, fieldLabel)
    //   await expect(field).toBeVisible({timeout: 10000});
    //   await field.fill('123')
    //   const tagName = await field.evaluate(el => el.tagName.toLowerCase())

    //   if (componentType === 'text-input') {
    //     // const inputType = await page.getAttribute(page.getByLabel(`${field_label}`), 'type');
    //     expect(field).toHaveAttribute('type', 'text');
    //     expect(tagName).toBe('input');
    //   }else if(componentType === 'media-carousel'){
    //     expect(field).toHaveAttribute('type', 'file');
    //     expect(tagName).toBe('input');
    //   }else if(componentType === 'year-input'){
    //     expect(field).toHaveAttribute('data-scope', 'number-input');
    //     expect(field).toHaveAttribute('type', 'text');
    //     expect(tagName).toBe('input');
    //    } else{
    //     expect(tagName).toBe(componentType);
    //   }

    //   if(!!helper_text){
    //     const helperText = field.locator('..').locator('.helper-text');
    //     expect(helperText).toBeVisible();
    //     expect(helperText).toHaveText(helper_text);
    //   }
    //   await page.pause();



});
