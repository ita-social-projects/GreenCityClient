import {UserComponent} from './component/user/user.component';
import {SignUpComponent} from './component/user/auth/sign-up/sign-up.component';
import {AuthComponent} from './component/user/auth/auth.component';
import {SignInComponent} from './component/user/auth/sign-in/sign-in.component';
import {SubmitEmailComponent} from './component/user/auth/submit-email/submit-email.component';
import {MapComponent} from './component/user/map/map.component';
import {AdminComponent} from './component/admin/admin.component';

export var router = [
  {
    path: '', component: UserComponent, children: [
      {
        path: 'auth', component: AuthComponent, children: [
          {path: '', component: SignInComponent},
          {path: 'sign-up', component: SignUpComponent},
          {path: 'submit-email', component: SubmitEmailComponent}
        ]
      },
      {
        path: '', component: MapComponent
      },
      {
        path: 'admin', component: AdminComponent
      }
    ]

  }
];
