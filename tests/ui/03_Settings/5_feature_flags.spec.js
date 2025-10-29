import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { Credentials, featureFlagsTestData, projectPublishCredentials } from "../../data/testData";
import { FeatureFlags } from "../../../pages/feature_Flags";
import { verifyFeatureFlagByDefaultFunctionality, verifyFeatureFlagFunctionality } from "../../utils/featureFlag";


test.describe('Feature Flags - Jedi Panel', { tag: '@UI' }, () => {

    // Test fixtures and page objects
    let page;
    let loginPage;
    let projectsPage;
    let featureFlags;

    test.beforeAll(async ({ browser, baseURL }) => {
        // Initialize browser context and page
        const context = await browser.newContext();
        page = await context.newPage();

        // Initialize page objects
        loginPage = new LoginPage(page, baseURL);
        projectsPage = new ProjectsPage(page, baseURL);
        featureFlags = new FeatureFlags(page, baseURL);

        // Perform login sequence
        await loginPage.navigate();
        await loginPage.login(Credentials.username, Credentials.password);

        // Wait for successful navigation to projects page
        await page.waitForURL('**/projects');
        await projectsPage.selectOrg(projectPublishCredentials.organizationName);
        await expect(await page.locator('circle').nth(1)).not.toBeVisible();

        // Ensure Jedi panel is accessible for settings navigation
        const jediPanel = await projectsPage.jediPanel();
        if (!(await jediPanel.isVisible())) {
            const jediPanelTrigger = await projectsPage.jediPanelTrigger();
            await expect(jediPanelTrigger).toBeVisible();
            await jediPanelTrigger.click();
        }
    });

    // Cleanup after all tests
    test.afterAll(async () => {
        await page.close();
    });

    /**
     * Validates that the feature flags section and its core components
     * are properly rendered in the Settings page
     */
    test('Should display feature flags section with all required components', async () => {
        // Navigate to feature flags section
        const featureFlagsSection = await featureFlags.FeatureFlagsSection();

        // Validate main section visibility
        await expect(featureFlagsSection).toBeVisible();

        // Validate section header components
        await expect(await featureFlags.FeatureFlagsSectionHeader()).toBeVisible();
        await expect(await featureFlags.FeatureFlagsSectionHeaderSpan()).toBeVisible();
        await expect(await featureFlags.FeatureFlagsSectionHeaderResetButton()).toBeVisible();
    });

    /**
     * Dynamic test generation for each feature flag
     * Creates individual test cases for each feature flag defined in featureFlagsTestData
     */
    featureFlagsTestData.forEach(({ label, helperText, checked }) => {

        test(`Should display feature flag "${label}" with correct properties`, async () => {
            // Get feature flag UI components
            const switchContainer = await featureFlags.switchContainer(label);
            const switchLabel = await featureFlags.switchLabel(label);
            const switchHelperText = await featureFlags.switchHelperText(label);
            const switchControl = await featureFlags.switchControl(label);

            // Validate component visibility
            await expect(switchContainer).toBeVisible();
            await expect(switchControl).toBeVisible();
            await expect(switchLabel).toBeVisible();
            await expect(switchHelperText).toBeVisible();

            // Validate text content
            await expect(switchLabel).toHaveText(label);
            await expect(switchHelperText).toHaveText(helperText);

            // Validate initial state matches configuration
            if (checked) {
                await expect(switchControl).toBeChecked();
            } else {
                await expect(switchControl).not.toBeChecked();
            }
        });

        test(`Should allow toggling feature flag "${label}" and reset to original state`, async () => {
            const switchControl = await featureFlags.switchControl(label);
            const resetButton = await featureFlags.FeatureFlagsSectionHeaderResetButton();

            if (checked) {

                // Verify initial checked state
                await expect(switchControl).toBeChecked();

                // Click to uncheck and verify state change
                await switchControl.click();
                await expect(switchControl).not.toBeChecked();

                // Click to check again and verify state change
                await switchControl.click();
                await expect(switchControl).toBeChecked();

                // Test reset functionality
                await switchControl.click(); // Uncheck to create a change
                await expect(resetButton).toBeVisible();
                await resetButton.click();
                await expect(switchControl).toBeChecked(); // Should reset to original checked state

            } else {
                // Verify initial unchecked state
                await expect(switchControl).not.toBeChecked();

                // Click to check and verify state change
                await switchControl.click();
                await expect(switchControl).toBeChecked();

                // Click to uncheck again and verify state change
                await switchControl.click();
                await expect(switchControl).not.toBeChecked();

                // Test reset functionality
                await switchControl.click(); // Check to create a change
                await expect(resetButton).toBeVisible();
                await resetButton.click();
                await expect(switchControl).not.toBeChecked(); // Should reset to original unchecked state
            }
        });

        test(`should functional test feature flag "${label}" effect on application behavior`, async () => {
            const switchControl = await featureFlags.switchControl(label);

            // Verify default functionality when feature flag is on/off
            await verifyFeatureFlagByDefaultFunctionality(label, page);

            // Toggle the feature flag
            await switchControl.click();

            // Run the corresponding functional test
            await verifyFeatureFlagFunctionality(label, page);

            await switchControl.click();

            //verify the default functionality again
            await verifyFeatureFlagByDefaultFunctionality(label, page);
        });

    });

    /**
     * Validates that the reset button properly restores all feature flags
     * to their original configuration state
     */
    test('Should reset all feature flags to original state when reset button is clicked', async () => {
        const resetButton = await featureFlags.FeatureFlagsSectionHeaderResetButton();

        // Make changes to multiple feature flags
        for (const { label } of featureFlagsTestData) {
            const switchControl = await featureFlags.switchControl(label);
            await switchControl.click(); // Toggle each flag
        }

        // Click reset button
        await expect(resetButton).toBeVisible();
        await resetButton.click();

        // Verify all flags are restored to original state
        for (const { label, checked } of featureFlagsTestData) {
            const switchControl = await featureFlags.switchControl(label);

            if (checked) {
                await expect(switchControl).toBeChecked();
            } else {
                await expect(switchControl).not.toBeChecked();
            }
        }
    });

});