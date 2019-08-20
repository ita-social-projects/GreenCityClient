import {UserComponent} from "./component/user/user.component";
import {SignUpComponent} from "./component/user/auth/sign-up/sign-up.component";
import {AuthComponent} from "./component/user/auth/auth.component";
import {SignInComponent} from "./component/user/auth/sign-in/sign-in.component";

export var router = [
  {
    path: '', component: UserComponent, children: [
      {
        path: 'auth', component: AuthComponent, children: [
          {path: '', component: SignInComponent},
          {path: 'sing-up', component: SignUpComponent}
        ]
      }
    ]

  }
];
