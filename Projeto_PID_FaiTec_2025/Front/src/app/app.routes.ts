import { Routes } from '@angular/router';
import { SignInComponent } from './views/account/sign-in/sign-in.component';

import { MyProfileComponent } from './views/account/my-profile/my-profile.component';
import { MainComponent } from './views/app/main/main.component';
import { HomeComponent } from './views/app/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { authenticationGuard } from './services/security/guard/authentication.guard';
import { UserListComponent } from './views/app/user/user-list/user-list.component';
import { UserEditComponent } from './views/app/user/user-edit/user-edit.component';
import { UserDetailComponent } from './views/app/user/user-detail/user-detail.component';
import { UserCreateComponent } from './views/app/user/user-create/user-create.component';
import { DonationLocationListComponent } from './views/app/donation-location/donation-location-list/donation-location-list.component';
import { DonationLocationEditComponent } from './views/app/donation-location/donation-location-edit/donation-location-edit.component';
import { DonationLocationDetailComponent } from './views/app/donation-location/donation-location-detail/donation-location-detail.component';
import { DonationLocationCreateComponent } from './views/app/donation-location/donation-location-create/donation-location-create.component';

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
                path: 'donation-location',
                children: [
                    {
                        path: 'list',
                        component: DonationLocationListComponent
                    },
                    {
                        path: 'edit/:id',
                        component: DonationLocationEditComponent
                    },
                    {
                        path: 'detail/:id',
                        component: DonationLocationDetailComponent
                    },
                    {
                        path: 'create',
                        component: DonationLocationCreateComponent
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
