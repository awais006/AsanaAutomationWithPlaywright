import { test } from '@playwright/test'
import { ProjectDetails } from '../models/projectDetails.type';
import { LoginPage } from '../pages/loginPage.type';
import { HomePage } from '../pages/homePage.type';
import * as projectsData from '../test-data/test-data.json';
import * as config from '../config.json';

const projectList: ProjectDetails[] = projectsData.projects;

test.describe('Verify Projects in Columns with Tags', () => {
    let loginPage: LoginPage;
  
    test.beforeAll(async () => {
      const email = config.email!;
      const password = config.password!;
      loginPage = await LoginPage.initialize();
      await loginPage.login(email, password);
    });

    projectList.forEach((project) => {
        test(`Verify project: ${project.project}, task: ${project.task} in column: ${project.column}`, async () => {
          const homePage = await new HomePage(loginPage.getPage());

          const { column, project: projectName, task, tags } = project;

          await homePage.OpenProjectFromSidebar(projectName);
          await homePage.VerifyTaskInsideTheProject(column, projectName, task);
          await homePage.VerifyTagsUnderTaskInsideTheProject(column, projectName, task, tags);
        });
    });

    test.afterAll(async () => {
        await loginPage.closeBrowser();
    });
});
