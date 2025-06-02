import { environment } from '@environment/environment';
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
      /* eslint-disable indent */
      ...(environment.enableUBS
        ? [
            {
              path: 'ubs',
              loadChildren: () => import('./ubs/ubs/ubs-order.module').then((mod) => mod.UbsOrderModule)
            }
          ]
        : []),
      ...(environment.enableGreenCity
        ? [
            {
              path: 'greenCity',
              loadChildren: () => import('./greencity/greencity.module').then((mod) => mod.GreencityModule),
              canActivate: [NonAdminGuard]
            }
          ]
        : []),
      {
        path: '',
        pathMatch: 'full',
        redirectTo: environment.enableUBS ? 'ubs' : environment.enableGreenCity ? 'greenCity' : 'auth/restore'
      },
      {
        path: 'auth/restore',
        component: ConfirmRestorePasswordComponent,
        canActivate: [ConfirmRestorePasswordGuard, NonAdminGuard]
      }
    ]
  },
  {
    path: 'db-display',
    loadChildren: () => import('./ubs/ubs-db-display/ubs-db-display.module').then((m) => m.UbsDbDisplayModule)
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
