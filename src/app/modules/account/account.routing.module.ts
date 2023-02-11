import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './pages/account.component';
import {PrivacyComponent} from "./components/privacy/privacy.component";

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
        component: AccountComponent
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
