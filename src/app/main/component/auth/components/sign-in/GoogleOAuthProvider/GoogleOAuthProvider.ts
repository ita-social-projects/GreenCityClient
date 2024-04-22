import { GoogleOAuthProvider } from 'google-oauth-gsi';

export const googleProvider = new GoogleOAuthProvider({
  clientId: '129513550972-pg3ueh62gbde1jukmr49vem2rclde123.apps.googleusercontent.com',
  onScriptLoadError: () => console.log('onScriptLoadError'),
  onScriptLoadSuccess: () => console.log('onScriptLoadSuccess')
});
