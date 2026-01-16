import { expect } from "@playwright/test";

export async function openCreateProjectModal(projectsPage) {
  const btn = await projectsPage.createProjectButton();
  await btn.click();
}

export async function openProjectOverview(projectsPage, projectName) {
  await projectsPage.viewProjectByName(projectName);
  await expect(await projectsPage.overviewProject()).toBeVisible({ timeout: 20000 });
}

export async function openAddRemoveFrameworksModal(frameworksPage) {
  if (!(await frameworksPage.frameworkSelectMenu.isVisible())) {
    await frameworksPage.frameworkSelectButton.click();
  }
  await expect(frameworksPage.frameworkSelectMenu).toBeVisible();
  await frameworksPage.menuItemByName("Add or remove frameworks").click();
  await expect(frameworksPage.dialog).toBeVisible({ timeout: 10000 });
}