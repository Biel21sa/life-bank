import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputEmail () {
        return $('input[formcontrolname="email"]');
    }

    public get inputPassword () {
        return $('input[formcontrolname="password"]');
    }

    public get btnLogin () {
        return $('.login-button');
    }

    public get errorMessage () {
        return $('.error-message');
    }

    public get logoSection () {
        return $('.logo-section');
    }

    public get welcomeMessage () {
        return $('.welcome-message h2');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (email: string, password: string) {
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(password);
        await this.btnLogin.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('sign-in');
    }
}

export default new LoginPage();