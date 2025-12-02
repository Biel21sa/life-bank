import { $, $$ } from '@wdio/globals'
import Page from './page.js';

class UserListPage extends Page {
    public get pageTitle () {
        return $('h1, h2');
    }

    public get createUserButton () {
        return $('button[routerlink="/users/create"]');
    }

    public get userTable () {
        return $('table, mat-table');
    }

    public get searchInput () {
        return $('input[placeholder*="Pesquisar"], input[placeholder*="Buscar"]');
    }

    public get userRows () {
        return $$('tr, mat-row');
    }

    public get editButtons () {
        return $$('button[title*="Editar"], button[aria-label*="edit"]');
    }

    public get deleteButtons () {
        return $$('button[title*="Excluir"], button[aria-label*="delete"]');
    }

    public open () {
        return super.open('users');
    }
}

export default new UserListPage();