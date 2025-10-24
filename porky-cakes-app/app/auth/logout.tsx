import { TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useDispatch, useSelector } from 'react-redux';

import * as WebBrowser from 'expo-web-browser';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { keycloakAuth } from '@/constants/idp';
import { clearUser } from '@/redux/userSlice';
import logger from '@/utils/logger';

WebBrowser.maybeCompleteAuthSession();

export async function handleLogout(idToken: string) {
  if(idToken) {
    const logoutUrl =
    `${keycloakAuth.keycloakIssuer}/protocol/openid-connect/logout` +
    `?post_logout_redirect_uri=${encodeURIComponent(keycloakAuth.redirectUri)}&id_token_hint=${idToken}`;

    await WebBrowser.openBrowserAsync(logoutUrl);
  }
}

export default function logout({left, top}: LogoutProps) {
  const colorScheme = useColorScheme();
  
  const dispatch = useDispatch();  
  const idToken = useSelector((state: any) => state.user.idToken);

  const logout = () => {
    dispatch(clearUser());
    handleLogout(idToken)
    logger.debug("Logged out")
  }

  return (
    <TouchableOpacity
      onPress={() => logout()}
      style={{
        position: 'absolute',
        left: left,
        top: top,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
      }}
    >
      <IconSymbol size={28} name="logout" color={Colors[colorScheme ?? 'light'].text} />
    </TouchableOpacity>
  );
};

interface LogoutProps {
  left: number;
  top: number;
}
