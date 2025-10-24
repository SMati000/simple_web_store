// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/** Material icon name, see https://icons.expo.fyi/ */
type IconSymbolProps = {
  name: ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
