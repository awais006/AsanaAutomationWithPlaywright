import { Page, expect } from '@playwright/test';

export class HomePage {
  private page: Page;
  private projectInSidebar: String;
  private cardByColumnAndTaskName: String;
  private tagsByColumnAndTaskName: String;

  constructor(page: Page) {
    this.page = page;
    this.projectInSidebar = "//div[@class='SidebarProjectsSectionProjectList-projects']//a[contains(@aria-label, 'project_name, Project')]";
    this.cardByColumnAndTaskName = "//h3[contains(text(), 'column_name')]//ancestor::div[@class = 'BoardColumn BoardBody-column']//span[contains(@class, 'BoardCard-taskName') and contains(text(), 'task_name')]";
    this.tagsByColumnAndTaskName = "//h3[contains(text(), 'column_name')]//ancestor::div[@class = 'BoardColumn BoardBody-column']//span[contains(@class, 'BoardCard-taskName') and contains(text(), 'task_name')]//ancestor::div[@class='BoardCardLayout-contentAboveSubtasks']//div[@class='BoardCardLayout-customPropertiesAndTags']//span";
  }

  public async VerifyTaskInsideTheProject(column: string, project: string, task:string) {
    const normalizedColumnName = await this.NormalizeColumnName(column);

    const cardByColumnAndTaskNameLocator = this.page.locator(this.cardByColumnAndTaskName.replace('column_name', normalizedColumnName).replace('task_name', task));
    let errorMessage:string = `"${ task }" task is not present in "${ column }" column under "${ project }" project`;
    await expect(cardByColumnAndTaskNameLocator, errorMessage).toBeVisible();
  }

  public async VerifyTagsUnderTaskInsideTheProject(column: string, project: string, task:string, tags:string[]) {
    const normalizedColumnName = await this.NormalizeColumnName(column);
    
    const tagsByColumnAndTaskNameLocator = this.page.locator(this.tagsByColumnAndTaskName.replace('column_name', normalizedColumnName).replace('task_name', task));
    const tagsListActual = await tagsByColumnAndTaskNameLocator.allTextContents();

    const expectedColumnsSortedList = tags.sort();
    const actualColumnsSortedList = tagsListActual.sort();
    let errorMessage:string = `Tags for "${task}" task under "${column}" column inside "${project}" project are not as expected.`;
    
    await expect(expectedColumnsSortedList, errorMessage).toEqual(actualColumnsSortedList);   
  }

  public async OpenProjectFromSidebar(project: string) {
    const projectInSidebarLocator = this.page.locator(this.projectInSidebar.replace('project_name', project));
    await projectInSidebarLocator.click();
  }

  public async NormalizeColumnName(column:string) {
    if(column == 'Next steps')
    {
        column = 'Next';        
    }
    if(column == 'New Requests')
    {
        column = 'Requests';        
    }
    if(column == 'In Progress')
    {
        column = 'Progress';        
    }

    return column;
  } 

}