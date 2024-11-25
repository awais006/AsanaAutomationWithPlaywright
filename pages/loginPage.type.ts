import { Page, Locator, chromium } from '@playwright/test';
import * as config from '../config.json';

export class LoginPage {
  private page: Page;
  private userEmail: Locator;
  private continueButton: Locator;
  private password: Locator;
  private loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userEmail = this.page.locator('//input[@type="email"]');
    this.continueButton = this.page.locator('//div[@role="button" and text()="Continue"]');
    this.password = this.page.locator('//input[@type="password"]');
    this.loginButton = this.page.locator('//div[@role="button" and text()="Log in"]');
  }

  public static async initialize(): Promise<LoginPage> {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(config.baseUrl);
    return new LoginPage(page);
  }
  
  public async login(email: string, password: string): Promise<void> {
    await this.userEmail.fill(email);
    await this.continueButton.click();
    await this.password.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('**/home/**');
    await this.page.locator('.HomePageContent-content');
  }
  
  public getPage(): Page {
    return this.page;
  }

  public async closeBrowser(): Promise<void> {
    await this.page.context().browser()?.close();
  }
}
