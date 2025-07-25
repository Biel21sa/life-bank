import { Routes } from '@angular/router';
import { Index } from './components/index';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Dashboard } from './components/account/dashboard/dashboard';
import { Main } from './components/account/main/main';

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
        path: "main",
        component: Main,
        children: [
            {
                path: "",
                component: Dashboard
            }
        ]
    },
    
];
