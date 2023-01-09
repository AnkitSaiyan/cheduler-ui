import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: async () => (await import('./core/auth/auth.module')).AuthModule
  },
  {
    path: '',
    loadChildren: async () => (await import('./core/core.module')).CoreModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
