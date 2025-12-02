import { expect, browser } from '@wdio/globals'
import { describe, it, beforeEach } from 'mocha'
import LoginPage from '../pageobjects/login.page.js'
import HomePage from '../pageobjects/home.page.js'

describe('LifeBank - Tela de Login', () => {
    beforeEach(async () => {
        await LoginPage.open()
    })

    it('deve exibir elementos da tela de login', async () => {
        await expect(LoginPage.logoSection).toBeDisplayed()
        await expect(LoginPage.welcomeMessage).toHaveText('Bem-vindo!')
        await expect(LoginPage.inputEmail).toBeDisplayed()
        await expect(LoginPage.inputPassword).toBeDisplayed()
        await expect(LoginPage.btnLogin).toBeDisplayed()
    })

    it('deve fazer login com credenciais válidas', async () => {
        await LoginPage.login('admin@lifebank.com', 'admin123')
        await expect(HomePage.heroTitle).toHaveText('Life Bank')
        await expect(browser).toHaveUrl(expect.stringContaining('/home'))
    })

    it('deve mostrar erro com credenciais inválidas', async () => {
        await LoginPage.login('invalid@email.com', 'wrongpassword')
        await expect(LoginPage.errorMessage).toBeDisplayed()
        await expect(LoginPage.errorMessage).toHaveText(
            expect.stringContaining('Email e/ou senha incorretos'))
    })

    it('deve desabilitar botão login com campos vazios', async () => {
        await expect(LoginPage.btnLogin).toHaveAttribute('disabled')
    })
})