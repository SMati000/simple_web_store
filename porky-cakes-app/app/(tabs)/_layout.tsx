import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSelector } from "react-redux";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pcRoles = useSelector((state: any) => state.user.pcRoles);
  const customerHasAccess = pcRoles.some((role: string) => ['pc_customer'].includes(role));
  const adminHasAccess = pcRoles.some((role: string) => ['pc_admin'].includes(role));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        tabBarInactiveTintColor:  Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: {backgroundColor: Colors[colorScheme ?? 'light'].background},
        tabBarButton: HapticTab,
        headerShown: false
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="home" color={color} />,
        }}
      />
        <Tabs.Screen
          name="carrito"
          options={{
            title: 'Carrito',
            href: customerHasAccess ? undefined : null,
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="shopping-cart" color={color} />,
          }}
        />
        <Tabs.Screen
          name="productoForm"
          options={{
            title: 'Productos',
            href: adminHasAccess ? undefined : null,
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="upload" color={color} />,
          }}
        />
    </Tabs>
  );
}
