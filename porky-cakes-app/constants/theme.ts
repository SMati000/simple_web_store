import { Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

const tintColorLight = '#e64980';
const tintColorDark = '#e64980';

export const Colors = {
  light: {
    text: '#11181C',
    text2: '#31373bff',
    background: '#fff',
    background2: '#cf97adff',
    background3: '#edededff',
    tint: tintColorLight,
    icon: '#fcc2d7',
    tabIconDefault: '#e9adc3ff',
    tabIconSelected: '#e64980',
  },
  dark: {
    text: '#ffffffff',
    text2: '#c3c3c3ff',
    background: '#30374a',
    background2: '#cf97adff',
    background3: '#222937ff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#bb8498ff',
    tabIconSelected: '#ac3c63ff',
  },
};

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? 'light'];
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
