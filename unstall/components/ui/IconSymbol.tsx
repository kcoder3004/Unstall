// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'clock': 'schedule',
  'person': 'person',
  'bullseye': 'bullseye-arrow',
  'gear': 'settings',
  'calendar': 'event',
  'waving-hand': 'hand-wave', // Use MaterialCommunityIcons "hand-wave"
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: keyof typeof MAPPING;
  size?: number;
  color: string;
  style?: any;
}) {
  if (name === 'bullseye') {
    return <MaterialCommunityIcons name="bullseye-arrow" size={size} color={color} style={style} />;
  }
  if (name === 'waving-hand') {
    return <MaterialCommunityIcons name="hand-wave" size={size} color={color} style={style} />;
  }
  return <MaterialIcons name={MAPPING[name]} size={size} color={color} style={style} />;
}
