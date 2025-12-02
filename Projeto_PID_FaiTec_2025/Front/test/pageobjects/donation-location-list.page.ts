import { $, $$ } from '@wdio/globals'
import Page from './page.js';

class DonationLocationListPage extends Page {
    public get pageTitle () {
        return $('h1, h2');
    }

    public get createLocationButton () {
        return $('button[routerlink*="create"]');
    }

    public get locationTable () {
        return $('table, mat-table');
    }

    public get locationRows () {
        return $$('tr, mat-row');
    }

    public get searchInput () {
        return $('input[placeholder*="Pesquisar"], input[placeholder*="Buscar"]');
    }

    public open () {
        return super.open('donation-locations');
    }
}

export default new DonationLocationListPage();