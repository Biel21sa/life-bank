import { Routes } from '@angular/router';
import { SignInComponent } from './views/account/sign-in/sign-in.component';
import { MyProfileComponent } from './views/account/my-profile/my-profile.component';
import { MainComponent } from './views/app/main/main.component';
import { HomeComponent } from './views/app/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { authenticationGuard } from './services/security/guard/authentication.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserListComponent } from './views/app/user/user-list/user-list.component';
import { UserEditComponent } from './views/app/user/user-edit/user-edit.component';
import { UserDetailComponent } from './views/app/user/user-detail/user-detail.component';
import { UserCreateComponent } from './views/app/user/user-create/user-create.component';
import { DonationLocationListComponent } from './views/app/donation-location/donation-location-list/donation-location-list.component';
import { DonationLocationEditComponent } from './views/app/donation-location/donation-location-edit/donation-location-edit.component';
import { DonationLocationDetailComponent } from './views/app/donation-location/donation-location-detail/donation-location-detail.component';
import { DonationLocationCreateComponent } from './views/app/donation-location/donation-location-create/donation-location-create.component';
import { RoleHomeComponent } from './views/app/role-home/role-home.component';
import { UserHomeComponent } from './views/app/user-home/user-home.component';
import { ClinicHomeComponent } from './views/app/clinic-home/clinic-home.component';
import { AdminHomeComponent } from './views/app/admin-home/admin-home.component';
import { AdministratorGuard } from './guards/administrator.guard';
import { DonorListComponent } from './views/app/donor/donor-list/donor-list.component';
import { DonorCreateComponent } from './views/app/donor/donor-create/donor-create.component';
import { DonorEditComponent } from './views/app/donor/donor-edit/donor-edit.component';
import { DonorDetailComponent } from './views/app/donor/donor-detail/donor-detail.component';
import { ClinicListComponent } from './views/app/clinic/clinic-list/clinic-list.component';
import { ClinicCreateComponent } from './views/app/clinic/clinic-create/clinic-create.component';
import { ClinicEditComponent } from './views/app/clinic/clinic-edit/clinic-edit.component';
import { ClinicDetailComponent } from './views/app/clinic/clinic-detail/clinic-detail.component';
import { DonationCreateComponent } from './views/app/donation-create/donation-create.component';
import { DonationHistoryComponent } from './views/app/donation-history/donation-history.component';
import { DonationDetailComponent } from './views/app/donation-detail/donation-detail.component';

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
                component: RoleHomeComponent
            },
            {
                path: 'system-home',
                component: HomeComponent,
                canActivate: [AdminGuard]
            },
            {
                path: 'admin-home',
                component: AdminHomeComponent
            },
            {
                path: 'clinic-home',
                component: ClinicHomeComponent
            },
            {
                path: 'user-home',
                component: UserHomeComponent
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
                canActivate: [AdminGuard],
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
                path: 'donor',
                canActivate: [AdministratorGuard],
                children: [
                    {
                        path: 'list',
                        component: DonorListComponent
                    },
                    {
                        path: 'create',
                        component: DonorCreateComponent
                    },
                    {
                        path: 'edit/:id',
                        component: DonorEditComponent
                    },
                    {
                        path: 'detail/:id',
                        component: DonorDetailComponent
                    }
                ]
            },
            {
                path: 'clinic',
                canActivate: [AdministratorGuard],
                children: [
                    {
                        path: 'list',
                        component: ClinicListComponent
                    },
                    {
                        path: 'create',
                        component: ClinicCreateComponent
                    },
                    {
                        path: 'edit/:id',
                        component: ClinicEditComponent
                    },
                    {
                        path: 'detail/:id',
                        component: ClinicDetailComponent
                    }
                ]
            },
            {
                path: 'donation-create',
                component: DonationCreateComponent,
                canActivate: [AdministratorGuard]
            },
            {
                path: 'donation-history',
                component: DonationHistoryComponent,
                canActivate: [AdministratorGuard]
            },
            {
                path: 'donation-detail/:id',
                component: DonationDetailComponent,
                canActivate: [AdministratorGuard]
            },
            {
                path: 'donation-location',
                canActivate: [AdminGuard],
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
