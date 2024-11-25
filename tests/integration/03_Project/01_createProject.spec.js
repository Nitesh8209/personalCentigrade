// import {test, expect} from '@playwright/test';
// import { ProjectsPage } from "../../../pages/projectsPage"
// import { LoginPage } from "../../../pages/loginPage"
// import { ValidTestData } from '../../data/SignUpData';
// import API_ENDPOINTS from '../../../api/apiEndpoints';
// import { getData } from '../../utils/apiHelper';

// test.describe('Project Tests', ()=>{
//   let page;
//   let projectsPage;
//   const { newEmail } = getData('Integration');

//   test.beforeAll(async()=>{

//     // Initialize browser and login
//     page = await browser.newPage();
//     projectsPage = new ProjectsPage(page);
//     const loginPage = new LoginPage(page);
    
//     await loginPage.navigate();
//     await loginPage.enterEmail(newEmail);
//     await loginPage.enterPassword(ValidTestData.newPassword);
//     await loginPage.submit();
//     await page.waitForLoadState('networkidle');
//   })

//   test.afterAll(async () => {
//     // Cleanup
//     await page.close();
//   });
 
//   test('create project', async({page})=>{
//     const projectName = 'Automationproject';
//     await projectsPage.createProject(projectName);
    
//      // Wait for and validate project creation response
//     const projectResponse = await page.waitForResponse(
//       response => response.url().includes(API_ENDPOINTS.createProject)
//     );
//     expect(projectResponse.status()).toBe(201);
//     const projectResponseBody = await projectResponse.json();

//     // Wait for and validate modular benefit project response
//     const mbpResponse = await page.waitForResponse(
//       response => response.url().includes(`${API_ENDPOINTS.createProject}/${projectResponseBody.id}/modular-benefit-project`)
//     );
//     expect(mbpResponse.status()).toBe(201);
//     const mbpResponseBody = await mbpResponse.json();

//     // Wait for and validate project configuration response
//     const configResponse = await page.waitForResponse(
//       response => response.url().includes(`${modularbenefitproject}/${mbpResponseBody.id}/config/1`)
//     )
//     expect(configResponse.status()).toBe(200);

//     // Validate project title and URL
//     const porjectTitle = await projectsPage.porjectTitle();
//     expect(page).toHaveURL(`https://devfoundry.centigrade.earth/projects/${projectResponseBody.id}/overview`);
//     expect(porjectTitle).toBe('Automationproject');
//   })

// })