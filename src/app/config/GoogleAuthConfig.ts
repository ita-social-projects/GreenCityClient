import {AuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('17831249917-sng59tads44s38b7c3g7ktmp7c95m494.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}
