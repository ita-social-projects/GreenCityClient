import { GoogleOAuthProvider } from 'google-oauth-gsi';
import { environment } from '@environment/environment';

export const googleProvider = new GoogleOAuthProvider({
  clientId: environment.googleClientId,
  onScriptLoadError: () => console.error('Error loading GoogleOAuth scripts'),
  onScriptLoadSuccess: () => console.log('GoogleOAuth scripts are loaded successfully')
});
