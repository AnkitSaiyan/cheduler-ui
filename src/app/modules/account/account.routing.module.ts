import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './pages/account.component';
import {PrivacyComponent} from "./components/privacy/privacy.component";
import {ProfileComponent} from "./components/profile/profile.component";

const profileRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'privacy',
        component: PrivacyComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(profileRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
