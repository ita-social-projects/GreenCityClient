import { GoogleOAuthProvider } from 'google-oauth-gsi';
import { environment } from '@environment/environment';

export const googleProvider = new GoogleOAuthProvider({
  clientId: environment.googleClientId
});
