import { test } from '@playwright/test'
import { LoginPage } from '../pages/loginPage.type';
import * as projectsData from '../test-data/test-data.json';
import * as config from '../config.json';
import { log } from 'console';

let loginPage: LoginPage;

test('successful login test', async() => {
    //let loginPage: LoginPage;

    const email = config.email!;
    const password = config.password!;
    loginPage = await LoginPage.initialize();
    await loginPage.fillEmailAddressAndClickContinue(email);
    await loginPage.fillPasswordAndClickLogin(password);
    await loginPage.verifyHomePageIsOpened();   
});

test('enter invalid email test', async() => {
    //let loginPage: LoginPage;

    const email = config.invalidEmail!;
    loginPage = await LoginPage.initialize();
    await loginPage.fillEmailAddressAndClickContinue(email);
    await loginPage.verifyInvalidEmailErrorMessageIsVisible();
});

test('enter invalid password test', async() => {
    //let loginPage: LoginPage;

    const email = config.email!;
    const password = config.invalidPassword!;
    loginPage = await LoginPage.initialize();
    await loginPage.fillEmailAddressAndClickContinue(email);
    
    await loginPage.verifyEnterPasswordPageIsOpened();
    
    await loginPage.fillPasswordAndClickLogin(password);

    await loginPage.verifyInvalidPasswordErrorMessageIsVisible();
});

test('enter new email address test', async() => {
    //let loginPage: LoginPage;

    const email = config.newemail!;
    loginPage = await LoginPage.initialize();
    await loginPage.fillEmailAddressAndClickContinue(email);
    
    await loginPage.verifySignupPageIsOpened();
});

test.afterEach(async() => {
    await loginPage.closeBrowser();
});