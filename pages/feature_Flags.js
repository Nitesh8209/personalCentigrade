export class FeatureFlags{
    constructor(page, baseURL){
        this.page = page;
        this.baseURL = baseURL;
    }

    async FeatureFlagsSection(){
        return await this.page.locator('.jedi-panel-section', { hasText: 'Feature flags'})
    }

    async FeatureFlagsSectionHeader(){
        return await (await this.FeatureFlagsSection()).locator('.jedi-panel-section-header')
    }

    async FeatureFlagsSectionHeaderSpan(){
        return await (await this.FeatureFlagsSectionHeader()).locator('span');
    }

    async FeatureFlagsSectionHeaderResetButton(){
        return await (await this.FeatureFlagsSectionHeader()).locator('button');
    }

    async switchContainer(label){
        return await (await this.FeatureFlagsSection(label)).locator('.switch-container', {hasText: label});
    }

    async switchControl(label){
        return await (await this.switchContainer(label)).locator('.switch-control');
    }

    async switchLabel(label){
        return await (await this.switchContainer(label)).locator('.label');
    }

    async switchHelperText(label){
        return await (await this.switchContainer(label)).locator('.switch-helper-text');
    }

}


