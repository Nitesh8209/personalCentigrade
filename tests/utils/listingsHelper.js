import { expect } from '@playwright/test';
import { safeExpect } from './authHelper';

// Validates the header section of the listings page
export const validatePageHeader = async (listingPage, errors) => {

  // Verify the main content container is visible
  await safeExpect(`Page content should be visible`, async () => {
    await expect(await listingPage.pageContent()).toBeVisible();
  }, errors);

  // Verify the buyer project header section is visible
  await safeExpect(`Buyer project header should be visible`, async () => {
    await expect(await listingPage.buyerProjectHeader()).toBeVisible();
  }, errors);

  // Verify the main heading text is visible and contains the expected content
  await safeExpect(`Heading should be visible and correct`, async () => {
    await expect(await listingPage.heading()).toBeVisible();
    await expect(await listingPage.heading()).toHaveText('All published projects');
  }, errors);

  // Verify the heading base (subtitle) is visible and contains the expected content
  await safeExpect(`Heading base should be visible and correct`, async () => {
    await expect(await listingPage.headingBase()).toBeVisible();
    await expect(await listingPage.headingBase()).toHaveText('A directory of publicly available projects on Centigrade sorted by last published date');
  }, errors);

  // Verify the header notice section and its components are visible and correct
  await safeExpect(`Listings page Header Notice should be visible`, async () => {
    await expect(await listingPage.buyerProjectHeaderNotice()).toBeVisible();
    await expect(await listingPage.buyerProjectHeaderNoticeText()).toBeVisible();
    await expect(await listingPage.buyerProjectHeaderNoticeText()).toHaveText('Did you know? Our open source data frameworks are co-developed with');
    await expect(await listingPage.buyerProjectHeaderNoticeRMIIcon()).toBeVisible();
    await expect(await listingPage.buyerProjectHeaderNoticeRMIIconText()).toBeVisible();
  }, errors);
}

// Validates the project listings section of the listings page
export const validateListingsProject = async (listingPage, errors) => {

  // Verify the project list container and all list items are visible
  await safeExpect(`Project list should be visible`, async () => {
    await expect(await listingPage.projectList()).toBeVisible();
    const items = await (await listingPage.projectListItem()).all();
    for (const item of items) {
      await expect(item).toBeVisible();
    }
  }, errors);

  // Verify the project with the specified name is visible
  await safeExpect(`Publish Project should be visible`, async () => {
    await expect(await listingPage.firstprojectListItem()).toBeVisible();
  }, errors);

  // Verify the project image is visible
  await safeExpect(`Project image should be visible`, async () => {
    await expect(await listingPage.projectItemImg()).toBeVisible();
  }, errors);

  // Verify the project card content and its main components are visible
  await safeExpect(`Project card Content should be visible`, async () => {
    await expect(await listingPage.projectItemCardContent()).toBeVisible();
    await expect(await listingPage.projectItemCardContentMain()).toBeVisible();
    await expect(await listingPage.projectItemCardContentMainOrg()).toBeVisible();
    await expect(await listingPage.projectItemCardContentMainTitle()).toBeVisible();
    await expect(await listingPage.projectItemCardContentMainText()).toBeVisible();
  }, errors);

  // Verify the project card footer elements for status, credit issuer, and type are visible
  await safeExpect(`Project card Content status, Credit issuer, Type should be visible`, async () => {
    await expect(await listingPage.projectItemCardContentFooter()).toBeVisible();
    await expect(await listingPage.projectItemCardContentFooterStatus()).toBeVisible();
    await expect(await listingPage.projectItemCardContentFooterStatus()).toHaveText('Status');
    await expect(await listingPage.projectItemCardContentFootercreditIssuer()).toBeVisible();
    await expect(await listingPage.projectItemCardContentFootercreditIssuer()).toHaveText('Credit issuer');
    await expect(await listingPage.projectItemCardContentFooterType()).toBeVisible();
    await expect(await listingPage.projectItemCardContentFooterType()).toHaveText('Type');
  }, errors);

  // Verify the project card details section and its main components are visible
  await safeExpect(`Project card details project scale and Location should be visible`, async () => {
    await expect(await listingPage.projectItemCardDetails()).toBeVisible();
    await expect(await listingPage.projectItemCardDetailsProjectScale()).toBeVisible();
    await expect(await listingPage.projectItemCardDetailsProjectScale()).toHaveText('Project scale');
    await expect(await listingPage.projectItemCardDetailsLocation()).toBeVisible();
  }, errors);

}