import { Routes } from '@angular/router';
import { Index } from './components/index';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Database } from './components/account/database/database';
import { Home } from './components/account/home/home';
import { Menu } from './components/account/menu/menu';
import { Charts } from './components/account/charts/charts';

export const routes: Routes = [
    {
        path: "",
        component: Index
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "signup",
        component: Signup
    },
    {
        path: "home",
        component: Home,
        children: [
            {
                path: "",
                component: Menu
            },
            {
                path: "charts",
                component: Charts
            },
            {
                path: "database",
                component: Database
            }
            
        ]
    },
    
];
