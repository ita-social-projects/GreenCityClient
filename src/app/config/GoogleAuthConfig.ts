import { AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('129513550972-eu9ej46rviv1ac8q14at62t2k5qon1pu.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}
