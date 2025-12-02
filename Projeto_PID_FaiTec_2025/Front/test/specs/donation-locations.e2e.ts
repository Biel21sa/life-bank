import { expect } from '@wdio/globals'
import { describe, it, beforeEach } from 'mocha'
import LoginPage from '../pageobjects/login.page.js'
import DonationLocationListPage from '../pageobjects/donation-location-list.page.js'

describe('LifeBank - Locais de Doação', () => {
    beforeEach(async () => {
        await LoginPage.open()
        await LoginPage.login('admin@lifebank.com', 'admin123')
        await DonationLocationListPage.open()
    })

    it('deve exibir página de locais de doação', async () => {
        await expect(DonationLocationListPage.pageTitle).toBeDisplayed()
        await expect(DonationLocationListPage.locationTable).toBeDisplayed()
    })

    it('deve exibir botão de criar local', async () => {
        await expect(DonationLocationListPage.createLocationButton).toBeDisplayed()
    })

    it('deve permitir pesquisar locais', async () => {
        if (await DonationLocationListPage.searchInput.isExisting()) {
            await DonationLocationListPage.searchInput.setValue('hospital')
            await browser.pause(1000)
            await expect(DonationLocationListPage.searchInput).toHaveValue('hospital')
        }
    })

    it('deve exibir locais na tabela', async () => {
        const rows = await DonationLocationListPage.locationRows
        await expect(rows.length).toBeGreaterThan(0)
    })

    it('deve navegar para criação de local', async () => {
        if (await DonationLocationListPage.createLocationButton.isExisting()) {
            await DonationLocationListPage.createLocationButton.click()
            await expect(browser).toHaveUrl(expect.stringContaining('/donation-locations/create'))
        }
    })
})