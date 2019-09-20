import {AuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('129513550972-ffqpdq6e5basbn9pcdvroqf20ffcg09f.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}
