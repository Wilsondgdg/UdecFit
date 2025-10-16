export const NativeModules = {};
export const Platform = { OS: 'test', select: objs => objs.test || objs.default };
export const BackHandler = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

export const Dimensions = {
  get: jest.fn().mockReturnValue({ width: 320, height: 640 }),
};

export const StyleSheet = {
  create: styles => styles,
  flatten: styles => styles, // 👈 esta línea arregla el error
};

export const View = 'View';
export const Text = 'Text';
export const TouchableOpacity = 'TouchableOpacity';
export const ScrollView = 'ScrollView';
export const Image = 'Image';
export const SafeAreaView = 'SafeAreaView';

export default {
  NativeModules,
  Platform,
  BackHandler,
  Dimensions,
  StyleSheet,
};
