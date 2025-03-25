import { expect } from "@playwright/test";
import { safeExpect } from "./authHelper";
import * as fs from "fs";

export const validateListingProjectHeader = async (projectHeader, errors) => {

  await safeExpect(`Project Header should be visible`, async () => {
    await expect(await projectHeader.pageHeader()).toBeVisible();
  }, errors);

  await safeExpect(`Project Tag should be visible`, async () => {
    await expect(await projectHeader.projectTag()).toBeVisible();
    await expect(await projectHeader.projectTag()).toHaveText(ValidTestData.organizationName);
  }, errors);

  await safeExpect(`Project Title should be visible`, async () => {
    await expect(await projectHeader.projectTitle()).toBeVisible();
    await expect(await projectHeader.projectTitle()).toHaveText(project.uiProjectName);
  }, errors);

  await safeExpect(`Get in touch button should be visible`, async () => {
    await expect(await projectHeader.getInTouch()).toBeVisible();
    await expect(await projectHeader.getInTouch()).toBeEnabled();
  }, errors);

  await safeExpect(`Project Details should be visible`, async () => {
    await projectHeader.validateProjectDetailsList(0, 'METHODOLOGY');
    await projectHeader.validateProjectDetailsList(1, 'TYPE');
    await projectHeader.validateProjectDetailsList(2, 'LOCATION');
    await projectHeader.validateProjectDetailsList(3, 'CREDIT ISSUER');
  }, errors);

}


export const validateGetInTouchModal = async (projectHeader, errors) => {

  await safeExpect(`Get In Touch Modal should be visible`, async () => {
    await expect(await projectHeader.getInTouchModal()).toBeVisible();
  }, errors);

  await safeExpect(`Modal Header should be visible`, async () => {
    await expect(await projectHeader.modalHeader()).toBeVisible();
    await expect(await projectHeader.modalHeader()).toHaveText('Get in touch');
  }, errors);

  await safeExpect(`Get In Touch Form should be visible`, async () => {
    await expect(await projectHeader.getInTouchForm()).toBeVisible();
    await expect(await projectHeader.getInTouchFormPeragraph()).toBeVisible();
    await expect(await projectHeader.getInTouchFormPeragraph()).toHaveText('Interested in this project? Reach out to the project developer with a message.');
    await expect(await projectHeader.getInTouchFormLabel()).toBeVisible();
    await expect(await projectHeader.getInTouchFormLabel()).toHaveText('Your message');
    await expect(await projectHeader.getInTouchFormInput()).toBeVisible();
    await expect(await projectHeader.getInTouchFormInput()).toBeEnabled();
  }, errors);

  await safeExpect(`Modal Cancel Button should be visible`, async () => {
    await expect(await projectHeader.modalCancelButton()).toBeVisible();
    await expect(await projectHeader.modalCancelButton()).toBeEnabled();
    await expect(await projectHeader.modalCancelButton()).toHaveText('Cancel');
  }, errors);

  await safeExpect(`Modal Send Button should be visible`, async () => {
    await expect(await projectHeader.modalSendButton()).toBeVisible();
    await expect(await projectHeader.modalSendButton()).toBeEnabled();
    await expect(await projectHeader.modalSendButton()).toHaveText('Send');
  }, errors);

}

export const validateTopicVisiblity = async (projectListings, topic, errors) => {

  await safeExpect(`Topic '${topic.label}' visibility`, async () => {
    await expect(await projectListings.topicName(topic.label)).toBeVisible({ timeout: 20 * 1000 });
    await expect(await projectListings.topicName(topic.label)).toBeEnabled();
  }, errors);

  await safeExpect(`validate Topic Active class`, async () => {
    const topicLabel = await projectListings.topicName(topic.label);
    await topicLabel.click();
    await expect(topicLabel).toHaveClass(/active/);
  }, errors);

}

export const validateStepGroupVisiblity = async (projectListings, stepGroup, errors) => {
  await safeExpect(`Step Group '${stepGroup.label}' visibility`, async () => {
    await expect(await projectListings.stepGroup(stepGroup.label)).toBeVisible();
    await expect(await projectListings.stepGroup(stepGroup.label)).toBeEnabled();
  }, errors);

}

export const hasValidStepFields = async (step) => {
  return step.sections?.some(section =>
    section?.field_groups?.some(fieldGroup =>
      fieldGroup?.fields &&
      fieldGroup.fields.length > 0 &&
      fieldGroup.fields.some(field => field !== null)
    )
  );
}

export const navigateToStep = async (step, projectListings,errors) => {
  await safeExpect(`Step ${step.label} should be visible and click`, async () => {
    const stepElement = await projectListings.stepLabel(step.label);
    await expect(stepElement).toBeVisible();
    await stepElement.click();
  }, errors);
}

export const validateSectionLabelVisibility = async (section, projectListings, errors) => {
  await safeExpect(`Section '${section.label}' visibility`, async () => {
    const sectionElement = await projectListings.sectionLabel(section.id);
    await expect(sectionElement).toBeVisible();
    await expect(sectionElement).toHaveText(section.label);
  }, errors);

  await safeExpect(`Section '${section.label}' visibility in main Content`, async () => {
    await expect(await projectListings.contentSectionLabel(section.id)).toBeVisible();
    await expect(await projectListings.contentSectionLabel(section.id)).toHaveText(section.label);
  }, errors);
}

export const validateFieldGroupVisibility = async (fieldGroup, projectListings, errors) => {
  await safeExpect(`Field Group '${fieldGroup.label}' visibility`, async () => {
    await expect(await projectListings.fieldGroupLabel(fieldGroup.id)).toBeVisible();
    await expect(await projectListings.fieldGroupLabel(fieldGroup.id)).toHaveText(fieldGroup.label);
  }, errors);

  await safeExpect(`Field Group '${fieldGroup.label}' visibility in main content`, async () => {
    await expect(await projectListings.contentFieldGroupLabel(fieldGroup.label)).toBeVisible();
    await expect(await projectListings.contentFieldGroupLabel(fieldGroup.label)).toHaveText(fieldGroup.label);
  }, errors);
}




export const setupPage = async (page, loginPage = null, credentials = null, listingPage, baseURL) => {  
  
  if (loginPage && credentials) {
    await loginPage.navigate();
    await page.waitForURL('**/projects');
    await listingPage.navigateToListings();
  }
  
  await listingPage.navigateToListingsProject(baseURL);
}

