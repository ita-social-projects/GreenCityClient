import { AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('405144744881-dv60fllbgotq2d939787iilo205ccb3b.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}
