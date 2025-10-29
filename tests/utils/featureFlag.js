import { expect } from "@playwright/test";
import { AiSummary } from "../../pages/aiSummary";
import { featureFlagTestProjectGuid } from "../data/testData";
import { AiSearch } from "../../pages/aiSearch";
import { ProjectsPage } from "../../pages/projectsPage";

export async function verifyFeatureFlagByDefaultFunctionality(label, page) {
  const superUserPage = await page.locator('iframe').contentFrame();
  const currentUrl = page.url();

  switch (label) {
    case 'project.ai_summaries': {
      const aiSummary = new AiSummary(superUserPage || page);
      const targetUrl = `/projects/${featureFlagTestProjectGuid}/overview`;
      if (!currentUrl.includes(targetUrl)) {
        await page.goto(targetUrl);
      }
      await expect(await aiSummary.aiSummaryNavigation()).toBeVisible();
      break;
    }

    case 'metrics.pd_dashboard':
      const viewAnalytics = await superUserPage.getByRole('button', { name: 'View analytics' });
      const banner = await superUserPage.locator('.banner-primary');
      await expect(viewAnalytics).not.toBeVisible();
      await page.goto(`/projects/${featureFlagTestProjectGuid}/overview`);
      await expect(banner).not.toBeVisible();
      await page.goBack();
      break;

    case 'project.ai_search': {
      const aiSearch = new AiSearch(superUserPage || page);
      const targetUrl = `/listings/projects/${featureFlagTestProjectGuid}/overview`;
      if (!currentUrl.includes(targetUrl)) {
        await page.goto(targetUrl);
      }
      await expect(await aiSearch.AiSearchOverview()).toBeVisible();
      break;
    }
     
    case 'project.credit_inventory':
      const creditInventory = await superUserPage.locator('.menu-item.nav-link').filter({hasText: 'Credit inventory'});
      const transactions = await superUserPage.locator('.menu-item.nav-link').filter({hasText: 'Transactions'});
       const targetUrl = `/projects/${featureFlagTestProjectGuid}/overview`;
      if (!currentUrl.includes(targetUrl)) {
        await page.goto(targetUrl);
      }
      await expect(creditInventory).toBeVisible();
      await expect(transactions).toBeVisible();
      break;
      
    case 'rfp.feature':
      const projectsPage = new ProjectsPage(superUserPage);
      await expect(await projectsPage.rfpsButton()).not.toBeVisible();
      await expect(await projectsPage.listingsRfpsButton()).not.toBeVisible();
      break;  

    default:
      console.log(`No specific functional test defined for feature flag: ${label}`);
  }
}


export async function verifyFeatureFlagFunctionality(label, page) {
    const superUserPage = await page.locator('iframe').contentFrame();
  switch (label) {
    case 'project.ai_summaries':
        const aiSummary = new AiSummary(superUserPage);
        await expect(await aiSummary.aiSummaryNavigation()).not.toBeVisible();
        await expect(await aiSummary.aiSummaryModal()).not.toBeVisible();
      break;

    case 'metrics.pd_dashboard':
      const viewAnalytics = await superUserPage.getByRole('button', { name: 'View analytics' });
      const banner = await superUserPage.locator('.banner-primary');
      await expect(viewAnalytics).toBeVisible();
      await page.goto(`/projects/${featureFlagTestProjectGuid}/overview`);
      await expect(banner).toBeVisible();
      await page.goBack();
      break;

    case 'project.ai_search':
      const aiSearch = new AiSearch(superUserPage);
      await expect(await aiSearch.AiSearchOverview()).not.toBeVisible();
      break;
     
    case 'project.credit_inventory':
      const creditInventory = await superUserPage.locator('.menu-item.nav-link').filter({hasText: 'Credit inventory'});
      const transactions = await superUserPage.locator('.menu-item.nav-link').filter({hasText: 'Transactions'});
      await expect(creditInventory).not.toBeVisible();
      await expect(transactions).not.toBeVisible();
      break;
      
    case 'rfp.feature':
      const projectsPage = new ProjectsPage(superUserPage);
      await expect(await projectsPage.rfpsButton()).toBeVisible();
      await expect(await projectsPage.listingsRfpsButton()).toBeVisible();
      break;

    default:
      console.log(`No specific functional test defined for feature flag: ${label}`);
  }
}
