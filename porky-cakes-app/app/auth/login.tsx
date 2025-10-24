import React, { useEffect } from 'react';
import { TouchableOpacity, ToastAndroid } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setAuthLoading } from '@/redux/userSlice';
import { keycloakAuth } from '@/constants/idp';
import { postExpoToken } from '@/api/notificationApi';
import logger from '@/utils/logger';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: `${keycloakAuth.keycloakIssuer}/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakAuth.keycloakIssuer}/protocol/openid-connect/token`,
  revocationEndpoint: `${keycloakAuth.keycloakIssuer}/protocol/openid-connect/revoke`,
  userInfoEndpoint: `${keycloakAuth.keycloakIssuer}/protocol/openid-connect/userinfo`,
};

function useKeycloakLogin() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: keycloakAuth.clientId,
      redirectUri: keycloakAuth.redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: 'id_token token',
      usePKCE: false,
      extraParams: {
        nonce: Math.random().toString(36).substring(2, 15),
      },
    },
    discovery
  );

  return { request, response, promptAsync };
}


export default function Login({ left, top }: LoginProps) {
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  const { request, response, promptAsync } = useKeycloakLogin()

  useEffect(() => {
    if (!response) return;
    
    dispatch(setAuthLoading(true))

    if (response?.type !== 'success') {
      dispatch(clearUser());
      ToastAndroid.showWithGravity('Lo sentimos, ha ocurrido un error', ToastAndroid.LONG, ToastAndroid.BOTTOM);
      return;
    }

    const { id_token, access_token } = response.params;

    if (access_token) {
      const decoded = decodeToken(access_token);

      if (!validToken(decoded)) {
        logger.debug("invalid token")
        dispatch(clearUser());
        return;
      }

      const name = decoded.name;
      const email = decoded.email;
      const pcRoles = decoded.pc_roles;

      dispatch(setUser({ name, email, pcRoles, accessToken: access_token, idToken: id_token }));
    
      postExpoToken(access_token)
    }
  }, [response]);

  return (
    <TouchableOpacity
      onPress={() => promptAsync()}
      style={{
        position: 'absolute',
        left: left,
        top: top,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
      }}
    >
      <IconSymbol size={28} name="login" color={Colors[colorScheme ?? 'light'].text} />
    </TouchableOpacity>
  );
}

interface LoginProps {
  left: number;
  top: number;
}

export const decodeToken = (token: string) => {
  if (!token) return null;
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};

export const validToken = (token: any) => {
  const expectedIssuer = Constants.expoConfig?.extra?.REACT_APP_KEYCLOAK_ISSUER;
  return token?.iss === expectedIssuer && Date.now() <= token?.exp * 1000;
};
