import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';

export const keycloakAuth = {
  clientId: Constants.expoConfig?.extra?.REACT_APP_KEYCLOAK_CLIENT_ID,
  redirectUri: AuthSession.makeRedirectUri({
    scheme: `${Constants.expoConfig?.scheme}`,
    path: `${Constants.expoConfig?.extra?.REACT_APP_KEYCLOAK_REDIRECT_VIEW}`,
  }),
  keycloakIssuer: Constants.expoConfig?.extra?.REACT_APP_KEYCLOAK_ISSUER,
};
