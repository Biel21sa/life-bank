import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import SecurePage from '../pageobjects/secure.page.js'

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open()

        await LoginPage.login('tomsmith', 'SuperSecretPassword!')
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveText(
            expect.stringContaining('You logged into a secure area!'))
        await expect(SecurePage.flashAlert).toMatchElementSnapshot('flashAlert')
    })

    it('should not login with invalid credentials and show error message', async () => {
        await LoginPage.open()
        await LoginPage.login('invalidUser', 'WrongPassword')

        await expect(LoginPage.errorMessage).toBeExisting()
        await expect(LoginPage.errorMessage).toHaveText(
            expect.stringContaining('Your username is invalid!'))
    })

    it('should redirect to secure page after successful login', async () => {
        await LoginPage.open()
        await LoginPage.login('tomsmith', 'SuperSecretPassword!')
    
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveText(
            expect.stringContaining('You logged into a secure area!'))
    })    
})
