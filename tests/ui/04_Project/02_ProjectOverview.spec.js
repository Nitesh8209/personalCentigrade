const { test, expect } = require('@playwright/test');
const { ValidTestData } = require('../../data/SignUpData');
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { project } from "../../data/projectData";
import { getData } from "../../utils/apiHelper";
import { safeExpect } from "../../utils/authHelper";

test.describe('Project Overview Page', () => {
  const { newEmail } = getData('UI');
  let page;
  let projectsPage;

  test.beforeAll(async ({ browser, baseURL }) => {

    // Initialize browser context and page objects
    const context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page, baseURL);
    projectsPage = new ProjectsPage(page, baseURL);

    // Perform login and navigate to the project
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
    await page.waitForURL('**/projects');
    await projectsPage.viewProject();
    await page.waitForURL('**/projects/**/overview');

    // Validate project title
    const projectTitle = await projectsPage.porjectTitle();
    await expect(projectTitle).toBe(project.uiProjectName);
  });

  test('Verify left sidebar and project overview sections on the project overview page', async ({ page, baseURL }) => {
    const errors = [];

    // project overview
    await safeExpect('Left Sidebar',
      async () => {
        await expect(await projectsPage.leftSideBar()).toBeVisible();
        await expect(await projectsPage.leftSideBarHeading()).toBeVisible();
        await expect(await projectsPage.leftSideBarHeading()).toHaveText('Project Outline');
      },
      errors
    )

    await safeExpect('Project overview',
      async () => {
        await expect(await projectsPage.projectOverview()).toBeVisible();
        await expect(await projectsPage.projectOverview()).toHaveText('Project overview');
        await expect(await projectsPage.projectOverviewicon()).toBeVisible();
      },
      errors
    )

    await safeExpect('Supporting documents',
      async () => {
        await expect(await projectsPage.Supportingdocuments()).toBeVisible();
        await expect(await projectsPage.Supportingdocuments()).toHaveText('Supporting documents');
        await expect(await projectsPage.Supportingdocumentsicon()).toBeVisible();

      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  });

  test('Verify project overview page layout, breadcrumbs, and content header', async ({ page, baseURL }) => {
    const errors = [];

    await safeExpect('Project overview page breadcrumbs',
      async () => {
        await expect(await projectsPage.projectBreadcrumbs()).toBeVisible({ timeout: 20000 });
        await expect(await projectsPage.projectBreadcrumbsSeparator()).toBeVisible();
        await expect(await projectsPage.projectBreadcrumbfirst()).toBeVisible();
        await expect(await projectsPage.projectBreadcrumbsecond()).toBeVisible();
        await expect(await projectsPage.projectBreadcrumbfirst()).toHaveText('Projects')
        await expect(await projectsPage.projectBreadcrumbsecond()).toHaveText(project.uiProjectName)
      },
      errors
    )

    await safeExpect('Project overview page Content Header project name',
      async () => {
        await expect(await projectsPage.projectOverviewContent()).toBeVisible();
        await expect(await projectsPage.overviewHeader()).toBeVisible();
        await expect(await projectsPage.overviewtitle()).toBeVisible();
        await expect(await projectsPage.overviewtitle()).toHaveText(project.uiProjectName)
      },
      errors
    )

    await safeExpect('Project overview page Buttons',
      async () => {
        await expect(await projectsPage.previewButton()).toBeVisible();
        await expect(await projectsPage.publishButton()).toBeVisible();
        await expect(await projectsPage.previewButton()).toBeEnabled();
        await expect(await projectsPage.publishButton()).toBeDisabled();
      },
      errors
    )

    await safeExpect('Project overview page header description',
      async () => {
        await expect(await projectsPage.projectOverviewDescription()).toBeVisible();
        await expect(await projectsPage.projectOverviewDescription()).toHaveText('Use the project outline on the left to explore, navigate, and fill out different sections related to your project');
      },
      errors
    )

    //   // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify functionality of Learn More accordion (Expansion and Collapse)', async ({ page, baseURL }) => {
    const errors = [];

    await safeExpect('Project overview page Accordian label and indicator',
      async () => {
        await expect(await projectsPage.projectOverviewAccordion()).toBeVisible({ timeout: 20000 });
        await expect(await projectsPage.projectOverviewAccordionLabel()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionLabel()).toHaveText('Learn more about the Centigrade Framework');
        await expect(await projectsPage.projectOverviewAccordionIndicator()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionIndicator()).toHaveAttribute('data-state', expect.stringContaining('closed'));
        await expect(await projectsPage.projectOverviewAccordionItemContent()).not.toBeVisible();
      },
      errors
    );

    const Accordianindicator = await projectsPage.projectOverviewAccordionIndicator();
    await safeExpect('Verify accordion expands',
      async () => {
        await Accordianindicator.click();
        await expect(await projectsPage.projectOverviewAccordionItemContent()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordion()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionLabel()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionLabel()).toHaveText('Learn more about the Centigrade Framework');
        await expect(await projectsPage.projectOverviewAccordionIndicator()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionIndicator()).toHaveAttribute('data-state', expect.stringContaining('open'));
      },
      errors
    )

    await safeExpect('Again click on Accordian label and indicator and collapses accordion',
      async () => {
        await Accordianindicator.click();
        await expect(await projectsPage.projectOverviewAccordionItemContent()).not.toBeVisible();
        await expect(await projectsPage.projectOverviewAccordion()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionLabel()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionLabel()).toHaveText('Learn more about the Centigrade Framework');
        await expect(await projectsPage.projectOverviewAccordionIndicator()).toBeVisible();
        await expect(await projectsPage.projectOverviewAccordionIndicator()).toHaveAttribute('data-state', expect.stringContaining('Closed'));
      },
      errors
    )

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  });


  test('Verify content inside Learn More accordion on Project Overview page', async ({ page, baseURL }) => {
    const errors = [];

    const Accordianindicator = await projectsPage.projectOverviewAccordionIndicator();
    await safeExpect('Verify the content of the accordion after expansion - guide header',
      async () => {
        await Accordianindicator.click();
        await expect(await projectsPage.projectOverviewguideheader()).toBeVisible();
        await expect(await projectsPage.projectOverviewguideheaderHeading()).toBeVisible();
        await expect(await projectsPage.projectOverviewguideheaderHeading()).toHaveText('How it works');
        await expect(await projectsPage.projectOverviewguideheadercontent()).toBeVisible();
        await expect(await projectsPage.projectOverviewguideheadercontent()).toHaveText('The data frameworks used on Centigrade have been developed in close cooperation with the Rocky Mountain Institute (RMI). They are open source and have been reviewed by over 30 civil society and academic institutions.');
      },
      errors
    )

    await safeExpect('Verify the content of the accordion after expansion - Step 1',
      async () => {
        await expect(await projectsPage.projectOverviewguidecontent()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep1()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep1num()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep1num()).toHaveText('Step 1');
        await expect(await projectsPage.projectOverviewguidecontentstep1heading()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep1heading()).toHaveText('Enter project data');
        await expect(await projectsPage.projectOverviewguidecontentstep1content()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep1content()).toHaveText('Start with basic project details in Tier 0. Add more information like forecast, baseline, actuals, monitoring data and more in Tier 1 or Tier 2.');
      },
      errors
    )

    await safeExpect('Verify the content of the accordion after expansion - Step 2',
      async () => {
        await expect(await projectsPage.projectOverviewguidecontentstep2()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep2num()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep2num()).toHaveText('Step 2');
        await expect(await projectsPage.projectOverviewguidecontentstep2heading()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep2heading()).toHaveText('Make your project public');
        await expect(await projectsPage.projectOverviewguidecontentstep2content()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep2content()).toHaveText('Complete at least Tier 0 to publish your project on Centigrade’s platform and share it with others');
      },
      errors
    )

    await safeExpect('Verify the content of the accordion after expansion - Step 3',
      async () => {
        await expect(await projectsPage.projectOverviewguidecontentstep3()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep3num()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep3num()).toHaveText('Step 3');
        await expect(await projectsPage.projectOverviewguidecontentstep3heading()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep3heading()).toHaveText('Differentiate your project');
        await expect(await projectsPage.projectOverviewguidecontentstep3content()).toBeVisible();
        await expect(await projectsPage.projectOverviewguidecontentstep3content()).toHaveText('Use Tier 3, Community impacts, and Ecological impacts to showcase what sets your project apart and its benefits to the community and environment');
      },
      errors
    )

    //   // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  });

  test('Verify tier progress and visibility of cards on Project Overview page', async ({ page, baseURL }) => {
    const errors = [];

    await safeExpect('Verify tier progress section on Project Overview page',
      async () => {
        await expect(await projectsPage.projectOverviewtierprogress()).toBeVisible({ timeout: 20000 });
        await expect(await projectsPage.projectOverviewtierprogressheading()).toBeVisible();
        await expect(await projectsPage.projectOverviewtierprogressheading()).toHaveText('Track your progress');
      },
      errors
    )

    await safeExpect('Verify visibility of tier cards on Project Overview page',
      async () => {
        await expect(await projectsPage.projectOverviewTier0Card()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier1Card()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier2Card()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier3Card()).toBeVisible();
      },
      errors
    )

    //   // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify Tier 0 - Provenance data progress card content', async ({ page, baseURL }) => {
    const errors = [];

    await safeExpect('Verify Tier 0 card title and description',
      async () => {
        await expect(await projectsPage.projectOverviewTier0Cardheader()).toBeVisible({ timeout: 20000 });
        await expect(await projectsPage.projectOverviewTier0Cardheading()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0Cardheading()).toHaveText('Tier 0 - Provenance data');
        await expect(await projectsPage.projectOverviewTier0Cardheadercontent()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0Cardheadercontent()).toHaveText('Complete all items in Tier 0 - Provenance to publish your project');
      },
      errors
    )

    await safeExpect('Verify progress bar visibility and progress',
      async () => {
        await expect(await projectsPage.projectOverviewTier0Cardprogressbarcontainer()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0Cardprogressbar()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0CardprogressbarText()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier0CardprogressbarText()).toHaveText(/Your progress:/);
      },
      errors
    )

    //   // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify Tier 1 - Forecast data progress card content', async ({ page, baseURL }) => {
    const errors = [];

    await safeExpect('Verify Tier 1 card title and description',
      async () => {
        await expect(await projectsPage.projectOverviewTier1Cardheader()).toBeVisible({ timeout: 20000 });
        await expect(await projectsPage.projectOverviewTier1Cardheading()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier1Cardheading()).toHaveText('Tier 1 - Forecast data');
        await expect(await projectsPage.projectOverviewTier1Cardheadercontent()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier1Cardheadercontent()).toHaveText('Add data about your baseline, assumption and forecasts');
      },
      errors
    )

    await safeExpect('Verify progress bar visibility and progress',
      async () => {
        await expect(await projectsPage.projectOverviewTier1Cardprogressbarcontainer()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier1Cardprogressbar()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier1CardprogressbarText()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier1CardprogressbarText()).toHaveText(/Your progress:/);
      },
      errors
    )

    //   // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify Tier 2 - Actuals data progress card content', async ({ page, baseURL }) => {
    const errors = [];

    await safeExpect('Verify Tier 2 card title and description',
      async () => {
        await expect(await projectsPage.projectOverviewTier2Cardheader()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier2Cardheading()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier2Cardheading()).toHaveText('Tier 2 - Actuals data');
        await expect(await projectsPage.projectOverviewTier2Cardheadercontent()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier2Cardheadercontent()).toHaveText('Add data about actuals, monitoring, and upload workbooks');
      },
      errors
    )

    await safeExpect('Verify progress bar visibility and progress',
      async () => {
        await expect(await projectsPage.projectOverviewTier2Cardprogressbarcontainer()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier2Cardprogressbar()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier2CardprogressbarText()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier2CardprogressbarText()).toHaveText(/Your progress:/);
      },
      errors
    )

    //   // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify Tier 3 - Differentiators data progress card content', async ({ page, baseURL }) => {
    const errors = [];

    await safeExpect('Verify Tier 3 card title and description',
      async () => {
        await expect(await projectsPage.projectOverviewTier3Cardheader()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier3Cardheading()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier3Cardheading()).toHaveText('Tier 3 - Differentiators');
        await expect(await projectsPage.projectOverviewTier3Cardheadercontent()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier3Cardheadercontent()).toHaveText('Highlight key differentiators and social impacts of your project');
      },
      errors
    )

    await safeExpect('Verify progress bar visibility and progress',
      async () => {
        await expect(await projectsPage.projectOverviewTier3Cardprogressbarcontainer()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier3Cardprogressbar()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier3CardprogressbarText()).toBeVisible();
        await expect(await projectsPage.projectOverviewTier3CardprogressbarText()).toHaveText(/Your progress:/);
      },
      errors
    )

    //   // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify Help & Support section visibility and content', async ({ page, baseURL }) => {
    const errors = [];

    // Verify the support section is visible
    await safeExpect('Verify support section visibility', async () => {
      await expect(await projectsPage.projectOverviewsupportSection()).toBeVisible();
    }, errors);

    // Verify the heading text
    await safeExpect('Verify support heading text', async () => {
      await expect(await projectsPage.projectOverviewsupportText()).toBeVisible();
      await expect(await projectsPage.projectOverviewsupportHeading()).toBeVisible();
      await expect(await projectsPage.projectOverviewsupportHeading()).toHaveText('Still have questions?');
    }, errors);

    // Verify the paragraph text
    await safeExpect('Verify support paragraph text', async () => {
      await expect(await projectsPage.projectOverviewsupportParagraph()).toBeVisible();
      await expect(await projectsPage.projectOverviewsupportParagraph()).toHaveText('Read our FAQ section or reach out to our support team.');
    }, errors);

    // Verify the Help & Support button is visible and contains the correct text
    await safeExpect('Verify Help & Support button text and visibility', async () => {
      await expect(await projectsPage.projectOverviewhelpButton()).toBeVisible();
      await expect(await projectsPage.projectOverviewhelpButton()).toHaveText('Help & Support');
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }
  });

});