// import { test, expect } from '@playwright/test';
// import LoginPage from '../../pages/loginPage';

// test.describe('Login Page UI Tests', () => {
//   test('should log in successfully with valid credentials', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await page.goto('https://devfoundry.centigrade.earth');
//     await loginPage.enterUsername('prithika.sujith@kreeti.com');
//     await loginPage.enterPassword('Welcome@123');
//     await loginPage.submitLogin();
//     expect(await page.url()).toBe('https://devfoundry.centigrade.earth/projects');
//   });

//   test('should show an error message with invalid credentials', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await page.goto('https://devfoundry.centigrade.earth/login');
//     await loginPage.enterUsername('invalid_user');
//     await loginPage.enterPassword('wrong_password');
//     await loginPage.submitLogin();
//     expect(await page.textContent('.error')).toContain('Invalid credentials');
//   });

//   test('should have a visible "Forgot Password" link', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await page.goto('https://devfoundry.centigrade.earth/login');
//     expect(await page.isVisible('a.forgot-password')).toBe(true);
//   });
// });



// Validate field label
                      // if (field.label == "Other carbon removal process ") continue;
                      // if (field.label == "Other storage type") continue;
                      // if (field.display_dependencies[0]?.field == "locationDetailsType-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.pattern == "Grouped project") continue;
                      // // if (field.display_dependencies[0]?.pattern == "Carbon removal") continue;
                      // if (field.display_dependencies[0]?.field == "baselineComparisonPlan-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.field == "endangeredSpeciesConditional-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.field == "uncertaintyActualsConditional-nameValue-nameValue") continue;

                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "socioParentConditional-nameValue-nameValue") continue;
                      // // below condition fix if above condition fix 

                      // if (field.display_dependencies[0]?.field == "stakeholderEngagementImpact-nameValue-nameValue") continue;
                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "genderIndicator-nameValue-nameValue") continue;
                      // // below condition fix if above condition fix 
                      // if (field.display_dependencies[0]?.field == "womenConsultation-nameValue-nameValue") continue;

                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "monetaryBenefitConditional-nameValue-nameValue") continue;

                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "socioParentConditional-nameValue-nameValue") continue;

                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "indigenousContractUpdates-nameValue-nameValue") continue;

                      // // in the Ecological impacts
                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "ecoParentConditional-nameValue-nameValue") continue;
                      // // below condition fix if above condition fix 
                      // if (field.display_dependencies[0]?.field == "airMonitoringPollutants-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.field == "airPollutionMonitoring-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.field == "indoorAirDetails-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.field == "airDetails-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.field == "airVerification-nameValue-nameValue") continue;

                      // if (field.display_dependencies[0]?.field == "waterVWBConditional-nameValue-nameValue") continue;
                      // if (field.display_dependencies[0]?.field == "waterVerification-nameValue-nameValue") continue;

                      // // in the Ecological impacts
                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "speciesTrackingConditional-nameValue-nameValue") continue;
                      // // below condition fix if above condition fix 
                      // if (field.display_dependencies[0]?.field == "speciesSelected-nameValue-nameValue") continue;

                      // // in the Ecological impacts
                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "waterQualityImprovement-nameValue-nameValue") continue;
                      // // below condition fix if above condition fix 
                      // if (field.display_dependencies[0]?.field == "speciesSelected-nameValue-nameValue") continue;

                      // // this parent field is not present
                      // if (field.display_dependencies[0]?.field == "waterEnhancement-nameValue-nameValue") continue;