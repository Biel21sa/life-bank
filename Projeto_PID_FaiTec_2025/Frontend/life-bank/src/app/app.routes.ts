import { Routes } from '@angular/router';
import { Index } from './components/index';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Database } from './components/account/database/database';
import { Home } from './components/account/home/home';
import { Menu } from './components/account/menu/menu';
import { Charts } from './components/account/charts/charts';
import { Profile } from './components/account/profile/profile';
import { MenuUser } from './components/account/menu-user/menu-user';
import { Clinics } from './components/account/clinics/clinics';
import { NotFound } from './components/not-found/not-found';

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
            },
            {
                path: "profile",
                component: Profile
            },
            {
                path: "user", 
                component: MenuUser
                /*ESTA ROTA SERA REMOVIDA. Ela apenas foi feita para desenvolvimento
                da tela e subistituira a rota vazia quando o usuário for cliente*/
            },
            {
                path: "clinics",
                component: Clinics
            }
            
        ]
    },
    {
        path: '**',
        component: NotFound        
    }
    
];
