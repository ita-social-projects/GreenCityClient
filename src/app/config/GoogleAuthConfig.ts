import {AuthServiceConfig, GoogleLoginProvider} from "angularx-social-login";


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("17831249917-phesm9osa6t74f2rd2hueo2lkjcp3ku4.apps.googleusercontent.com")
  }
]);

export function provideConfig() {
  return config;
}
