// retoolDownloader.js
import { readFileSync } from 'fs';

class RetoolDownloader {
  constructor(page, email, password) {
    this.page = page;
    this.email = email;
    this.password = password;
  }

  async login() {
    try {
      // Navigate to Retool login page
      await this.page.goto('https://centigrade.retool.com/auth/login');

      // Click "Sign in with Google" button
      await this.page.click('text="Sign in with Google"');

      // Handle Google login
      await this.page.waitForSelector('input[type="email"]');
      await this.page.fill('input[type="email"]', this.email);
      await this.page.click('button:has-text("Next")');

      // Enter password
      await this.page.waitForSelector('input[type="password"]');
      await this.page.fill('input[type="password"]', this.password);
      await this.page.click('button:has-text("Next")');


      // Wait for redirect to apps page
      await this.page.waitForURL('https://centigrade.retool.com');

      console.log('Successfully logged into Retool');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async downloadData() {
    try {
      // Go to specific Retool app
      await this.page.goto('https://centigrade.retool.com/apps/bb770758-1882-11ef-9765-7b21ca44a8d2/export%20tools/engineering%20exports');

      // Wait for app to load
      await this.page.waitForLoadState('networkidle');

      // Click download button
      await this.page.getByTestId('MethodologySelectConfig--0').getByTestId('Widgets::SelectInput_input').click();
      await this.page.getByTestId('ListBox::ListBoxItem::6').getByText('QA-ACR1.3-cgV1.0.0').click();
      await this.page.getByRole('button', { name: 'download form-config QA-ACR1.' }).click();

    } catch (error) {
      console.error('Error downloading data:', error);
      throw error;
    }
  }
}

export default RetoolDownloader;

