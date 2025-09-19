import { test, expect } from '@playwright/test';
import path from 'path';
import { AiSummary } from '../../../pages/aiSummary';
import { LoginPage } from "../../../pages/loginPage";
import { project } from '../../data/projectData';
import { ProjectsPage } from "../../../pages/projectsPage";
import fs from 'fs';
import { safeExpect } from '../../utils/authHelper';

test.describe('AiSummary After Publish', { tag: '@UI' }, () => {

  const authStoragePath = path.join(__dirname, "..",
    "..",
    "data",
    "project-Publish-auth.json");
  test.use({ storageState: authStoragePath });

  let page;
  let aiSummary;

  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    await loginPage.navigate();
    await page.waitForURL("**/projects");

    await projectsPage.viewProjectByName(project.uiProjectName);
    await page.waitForURL(`**/overview`);

    aiSummary = new AiSummary(page);
    const aiSummaryNavigation = await aiSummary.aiSummaryNavigation();
    await aiSummaryNavigation.click();
  })

  test.afterAll(async () => {
    await page.close();
  });

  test('AI Summary Page Heading - After Publish', async () => {
    const aiSummaries = await aiSummary.aiSummaries();
    await expect(aiSummaries).toBeVisible();

    const contentHeader = await aiSummary.contentHeader();
    await expect(contentHeader).toBeVisible();
    await expect(contentHeader).toHaveText('AI summaries');

    const contentDescription = await aiSummary.contentDiscription();
    await expect(contentDescription).toBeVisible();
    await expect(contentDescription).toHaveText('Refine and control AI-generated summaries for buyers reviewing your project');
  });

  const aiSummaryDataPath = path.join(__dirname, '..', '..', 'data', 'aiSummary.json');
  const aiSummaryData = JSON.parse(fs.readFileSync(aiSummaryDataPath, 'utf-8'));

  // Iterate through each topic in the AI summary data
   aiSummaryData.topics.forEach((summary) => {
    test.describe(`AI Summary - ${summary.label}`, () => {
      test(`Verify Topic Heading - ${summary.label}`, async () => {
        const topicHeading = await aiSummary.topicHeading(summary.label);
        await expect(topicHeading).toBeVisible();
        await expect(topicHeading).toHaveText(summary.label);
      });

      // Dynamically generate tests for each step group
      summary.step_groups.forEach((stepGroup) => {
        test.describe(`Step Group - ${stepGroup.label}`, () => {
          test(`Verify Step Group Heading - ${stepGroup.label}`, async () => {
            const stepGroupHeading = await aiSummary.stepGroupHeading(stepGroup.label);
            await expect(stepGroupHeading).toBeVisible();
            await expect(stepGroupHeading).toHaveText(stepGroup.label);
          });

          // Dynamically generate tests for each step
          stepGroup.steps.forEach((step) => {
            test(`Verify Step - ${step.label}`, async () => {
              const errors = [];

              const stepLabel = await aiSummary.stepLabel(step.label);
              const stepAccordion = await aiSummary.stepAccordion(step.label);
              await safeExpect('Step label and accordion should be visible', async () => {
                await expect(stepAccordion).toBeVisible();
                await expect(stepLabel).toBeVisible();
                await expect(stepLabel).toHaveText(step.label);
              }, errors);

              await safeExpect('Accordion item badge should be visible', async () => {
                const stepAccordionButton = await aiSummary.stepAccordionButton(step.label);
                await expect(stepAccordionButton).toBeEnabled();
                await stepAccordionButton.click();
                const accordionItemContent = await aiSummary.accordionItemContent(step.label);
                await expect(accordionItemContent).toBeVisible();
                const accordionItemContentText = await accordionItemContent.textContent();
                console.log(`Accordion content for step "${step.label}": ${accordionItemContentText}`);
                const stepAccordionThumbsRating = await aiSummary.stepAccordionThumbsRating(step.label);
                await expect(stepAccordionThumbsRating).toBeVisible();
                const stepAccordionViewProjectButton = await aiSummary.stepAccordionViewProjectButton(step.label);
                await expect(stepAccordionViewProjectButton).toBeVisible();

                const [newPage] = await Promise.all([
                  page.context().waitForEvent('page'),
                  stepAccordionViewProjectButton.click(), // triggers new tab
                ]);

                await newPage.waitForLoadState();

                // Assert the URL
                expect(newPage.url()).toContain(`/${(summary.name).toLowerCase()}/${stepGroup.name}/${step.name}`);

                const buyerAiSummary = new AiSummary(newPage);
                const buyerAiSummaryContent = await buyerAiSummary.buyerAiSummaryContent(accordionItemContentText);
                await expect(buyerAiSummaryContent).toBeVisible();

                await newPage.close();
              }, errors);

              if (errors.length > 0) {
                throw new Error(`Test failed with the following errors: ${errors.join(', ')}`);
              }
            });
          });
        });
      });
    });
  });
});