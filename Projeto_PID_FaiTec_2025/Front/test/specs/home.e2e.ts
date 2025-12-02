import { expect, $, browser } from '@wdio/globals'
import { describe, it, beforeEach } from 'mocha'
import LoginPage from '../pageobjects/login.page.js'
import HomePage from '../pageobjects/home.page.js'

describe('LifeBank - Tela Home', () => {
    beforeEach(async () => {
        await LoginPage.open()
        await LoginPage.login('admin@lifebank.com', 'admin123')
        await HomePage.open()
    })

    it('deve exibir elementos principais da home', async () => {
        await expect(HomePage.heroTitle).toHaveText('Life Bank')
        await expect(HomePage.heroSubtitle).toBeDisplayed()
        await expect(HomePage.statsSection).toBeDisplayed()
    })

    it('deve exibir cards de estatísticas', async () => {
        const statCards = await HomePage.statCards
        await expect(statCards).toHaveLength(4)
        
        for (const card of statCards) {
            await expect(card).toBeDisplayed()
        }
    })

    it('deve exibir cards de navegação', async () => {
        const navCards = await HomePage.navigationCards
        await expect(navCards).toHaveLength(2)
        
        for (const card of navCards) {
            await expect(card).toBeDisplayed()
        }
    })

    it('deve navegar para usuários ao clicar no botão', async () => {
        const usersCard = await $('.nav-card.primary-card')
        await usersCard.click()
        await expect(browser).toHaveUrl(expect.stringContaining('/users'))
    })

    it('deve navegar para locais de doação ao clicar no botão', async () => {
        const locationsCard = await $('.nav-card.success-card')
        await locationsCard.click()
        await expect(browser).toHaveUrl(expect.stringContaining('/donation-locations'))
    })
})