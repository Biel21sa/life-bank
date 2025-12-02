import { expect, browser } from '@wdio/globals'
import { describe, it, beforeEach } from 'mocha'
import LoginPage from '../pageobjects/login.page.js'
import UserListPage from '../pageobjects/user-list.page.js'

describe('LifeBank - Gerenciamento de Usuários', () => {
    beforeEach(async () => {
        await LoginPage.open()
        await LoginPage.login('admin@lifebank.com', 'admin123')
        await UserListPage.open()
    })

    it('deve exibir página de lista de usuários', async () => {
        await expect(UserListPage.pageTitle).toBeDisplayed()
        await expect(UserListPage.userTable).toBeDisplayed()
    })

    it('deve exibir botão de criar usuário', async () => {
        await expect(UserListPage.createUserButton).toBeDisplayed()
    })

    it('deve permitir pesquisar usuários', async () => {
        if (await UserListPage.searchInput.isExisting()) {
            await UserListPage.searchInput.setValue('test')
            await expect(UserListPage.searchInput).toHaveValue('test')
        }
    })

    it('deve exibir linhas de usuários na tabela', async () => {
        const rows = await UserListPage.userRows
        await expect(rows.length).toBeGreaterThan(0)
    })

    it('deve navegar para criação de usuário', async () => {
        if (await UserListPage.createUserButton.isExisting()) {
            await UserListPage.createUserButton.click()
            await expect(browser).toHaveUrl(expect.stringContaining('/users/create'))
        }
    })
})