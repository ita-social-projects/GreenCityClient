import {AuthServiceConfig, GoogleLoginProvider} from 'angularx-social-login';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('17831249917-e96sv9o6q5tp4shpem2dc5fbpr1b7p33.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}
