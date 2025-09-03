import { Routes } from '@angular/router';
import { SignInComponent } from './views/account/sign-in/sign-in.component';

import { MyProfileComponent } from './views/account/my-profile/my-profile.component';
import { HelpComponent } from './views/app/help/help.component';
import { MainComponent } from './views/app/main/main.component';
import { HomeComponent } from './views/app/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { authenticationGuard } from './services/security/guard/authentication.guard';
import { UserListComponent } from './views/app/user/user-list/user-list.component';
import { UserEditComponent } from './views/app/user/user-edit/user-edit.component';
import { UserDetailComponent } from './views/app/user/user-detail/user-detail.component';
import { UserCreateComponent } from './views/app/user/user-create/user-create.component';

export const routes: Routes = [
    {
        path: 'account/sign-in',
        component: SignInComponent
    },

    {
        path: '',
        component: MainComponent,
        canActivate: [authenticationGuard],
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'account/my-profile',
                component: MyProfileComponent
            },
            {
                path: 'help',
                component: HelpComponent
            },
            {
                path: 'main',
                component: MainComponent
            },
            {
                path: 'user',
                children: [
                    {
                        path: 'list',
                        component: UserListComponent
                    },
                    {
                        path: 'edit/:id',
                        component: UserEditComponent
                    },
                    {
                        path: 'detail/:id',
                        component: UserDetailComponent
                    },
                    {
                        path: 'create',
                        component: UserCreateComponent
                    },
                ]
            },
            {
                path: '**',
                component: NotFoundComponent
            }
        ]
    },


];
