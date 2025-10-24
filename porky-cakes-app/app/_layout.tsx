import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter  } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Provider, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { store } from '@/redux/store';
import Login from '@/app/auth/login';
import Logout from '@/app/auth/logout';
import { requestPermissions } from '@/utils/notifications';
import logger from '@/utils/logger';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function AppRoot() {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function RootLayout() {
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');

  const colorScheme = useColorScheme();

  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
  logger.debug("authIsAuthenticated: ", isAuthenticated)

  
  useEffect(() => {
    const init = async () => {
      const state = await requestPermissions();
      logger.debug("Permisos para enviar notificationes: ", state)
    }

    init();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={{
          header: () => {
            return (
              <View style={{
                backgroundColor: Colors[colorScheme ?? 'light'].background2,
                paddingTop: insets.top,
                paddingBottom: 8,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <TouchableOpacity
                  onPress={() => router.canGoBack() && router.back()}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: insets.top + screenWidth*0.035,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                  }}
                >
                  <IconSymbol size={28} name="arrow-back" color={Colors[colorScheme ?? 'light'].text} />
                </TouchableOpacity>

                <Image
                  source={require('@/assets/images/logo.png')}
                  style={{ 
                    height: screenWidth*0.16,
                    width: screenWidth*0.4
                  }}
                  resizeMode="contain"
                />

                { 
                  isAuthenticated ? 
                  <Logout 
                    left={screenWidth - 55} 
                    top={insets.top + screenWidth * 0.035}
                  /> : 
                  <Login 
                    left={screenWidth - 55} 
                    top={insets.top + screenWidth * 0.035}
                  />
                }
              </View>
            );
          }
        }}
      >
        {/* <Stack.Screen name='auth/login' options={{headerShown: false}}/> */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
