import { Page, Locator, chromium, expect } from '@playwright/test';
import * as config from '../config.json';

export class LoginPage {
  private page: Page;
  private userEmail: Locator;
  private continueButton: Locator;
  private password: Locator;
  private loginButton: Locator;
  private invalidEmailError: Locator;
  private invalidPasswordError: Locator;
  private signupMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userEmail = this.page.locator('//input[@type="email"]');
    this.continueButton = this.page.locator('//div[@role="button" and text()="Continue"]');
    this.password = this.page.locator('//input[@type="password"]');
    this.loginButton = this.page.locator('//div[@role="button" and text()="Log in"]');
    this.invalidEmailError = this.page.locator('//div[@role="alert" and text()="Please enter a valid email address."]');
    this.invalidPasswordError = this.page.locator('//div[@role="alert"]//p[text()="The username or password is not correct."]');
    this.signupMessage = this.page.locator('//span[text()="To get started, please sign up"]');
  }

  public static async initialize(): Promise<LoginPage> {
    const browser = await chromium.launch({ headless: false});
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

  public async fillEmailAddressAndClickContinue(email: string): Promise<void> {
    await this.userEmail.fill(email);
    await this.continueButton.click();
  }
  
  public async fillPasswordAndClickLogin(password: string): Promise<void> {
    await this.password.fill(password);
    await this.loginButton.click();
  }

  public async verifyInvalidEmailErrorMessageIsVisible() {
    await expect(this.invalidEmailError, "Invalid Email Error is not visible on Enter Email page when Invalid email is entered").toBeVisible();
  }

  public async verifyInvalidPasswordErrorMessageIsVisible() {
    await expect(this.invalidPasswordError, "Password Error is not visible on Enter Password page when Invalid password is entered").toBeVisible();
  }

  public async verifyEnterPasswordPageIsOpened() {
    await expect(this.password, "Password field is not visible on Enter Password page").toBeVisible();
  }

  public async verifySignupPageIsOpened() {
    await expect(this.signupMessage, "Sign up message is not visible on Sign up page").toBeVisible();
  }

  public async verifyHomePageIsOpened() {
    await this.page.waitForURL('**/home/**');
    await expect(this.page.locator('.HomePageContent-content'), "Home page heading is not present.").toBeVisible();
  }

  public getPage(): Page {
    return this.page;
  }

  public async closeBrowser(): Promise<void> {
    await this.page.context().browser()?.close();
  }
}
