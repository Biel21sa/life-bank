import { $, $$ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get heroTitle () {
        return $('.hero-content h1');
    }

    public get heroSubtitle () {
        return $('.hero-subtitle');
    }

    public get statsSection () {
        return $('.stats-section');
    }

    public get usersButton () {
        return $('button[ng-reflect-router-link="/users"]');
    }

    public get donationLocationsButton () {
        return $('button[ng-reflect-router-link="/donation-locations"]');
    }

    public get statCards () {
        return $$('.stat-card');
    }

    public get navigationCards () {
        return $$('.nav-card');
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('home');
    }
}

export default new HomePage();