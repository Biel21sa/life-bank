import { $, $$ } from '@wdio/globals'
import Page from './page.js';

class BloodStockPage extends Page {
    public get pageTitle () {
        return $('h1, h2');
    }

    public get stockCards () {
        return $$('.stock-card, mat-card');
    }

    public get bloodTypeLabels () {
        return $$('.blood-type');
    }

    public get stockLevels () {
        return $$('.stock-level, .quantity');
    }

    public get updateStockButton () {
        return $('button[title*="Atualizar"], button[title*="Update"]');
    }

    public open () {
        return super.open('blood-stock');
    }
}

export default new BloodStockPage();