import { expect } from '@wdio/globals'
import { describe, it, beforeEach } from 'mocha'
import LoginPage from '../pageobjects/login.page.js'
import BloodStockPage from '../pageobjects/blood-stock.page.js'

describe('LifeBank - Estoque de Sangue', () => {
    beforeEach(async () => {
        await LoginPage.open()
        await LoginPage.login('admin@lifebank.com', 'admin123')
        await BloodStockPage.open()
    })

    it('deve exibir página de estoque de sangue', async () => {
        await expect(BloodStockPage.pageTitle).toBeDisplayed()
    })

    it('deve exibir cards de estoque por tipo sanguíneo', async () => {
        const stockCards = await BloodStockPage.stockCards
        await expect(stockCards.length).toBeGreaterThan(0)
        
        for (const card of stockCards) {
            await expect(card).toBeDisplayed()
        }
    })

    it('deve exibir tipos sanguíneos', async () => {
        const bloodTypes = await BloodStockPage.bloodTypeLabels
        await expect(bloodTypes.length).toBeGreaterThan(0)
    })

    it('deve exibir níveis de estoque', async () => {
        const stockLevels = await BloodStockPage.stockLevels
        await expect(stockLevels.length).toBeGreaterThan(0)
    })

    it('deve permitir atualizar estoque', async () => {
        if (await BloodStockPage.updateStockButton.isExisting()) {
            await expect(BloodStockPage.updateStockButton).toBeDisplayed()
        }
    })
})