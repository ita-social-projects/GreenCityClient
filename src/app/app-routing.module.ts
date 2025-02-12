import { ConfirmRestorePasswordGuard } from './shared/guards/route-guards/confirm-restore-password.guard';
import { ConfirmRestorePasswordComponent } from '@global-auth/index';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NonAdminGuard } from 'src/app/shared/guards/non-admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'ubs',
        loadChildren: () => import('./ubs/ubs/ubs-order.module').then((mod) => mod.UbsOrderModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'greenCity'
      },
      {
        path: 'greenCity',
        loadChildren: () => import('./greencity/greencity.module').then((mod) => mod.GreencityModule),
        canActivate: [NonAdminGuard]
      },
      {
        path: 'auth/restore',
        component: ConfirmRestorePasswordComponent,
        canActivate: [ConfirmRestorePasswordGuard, NonAdminGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
