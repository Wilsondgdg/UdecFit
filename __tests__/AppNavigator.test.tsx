import React from 'react';

// Usa require solo una vez si lo necesitas, pero en este caso no es necesario volver a importar React.
// Puedes mantener solo las siguientes líneas:
const nativeStack = require('@react-navigation/native-stack');
const AdminMock = require('./screens/AdminPanel').default;

/**
 * Tests for src/AppNavigator.tsx
 *
 * Strategy:
 * - Mock @react-navigation/native to render children directly.
 * - Mock @react-navigation/native-stack with a shared array (__registeredScreens)
 *   and recorded navigator props (__navigatorProps) so tests can inspect registered screens
 *   and navigator configuration without needing the real navigation implementation.
 * - Mock the screen components and TabNavigator so the AppNavigator import succeeds.
 *
 * Each test resets the module registry so requiring ./AppNavigator re-executes
 * the file and repopulates the mocked registration arrays.
 */

jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const __registeredScreens: Array<any> = [];
  let __navigatorProps: any = null;

  function createNativeStackNavigator() {
    return {
      Navigator: (props: any) => {
        __navigatorProps = props;
        return React.createElement(React.Fragment, null, props.children);
      },
      Screen: (props: any) => {
        __registeredScreens.push(props);
        return null;
      },
    };
  }

  return {
    createNativeStackNavigator,
    __registeredScreens,
    get __navigatorProps() {
      return __navigatorProps;
    },
    __reset() {
      __registeredScreens.length = 0;
      __navigatorProps = null;
    },
  };
});

// Mock screens and TabNavigator
const makeMockComponent = (name: string) => {
  const Comp = () => React.createElement('div', null);
  (Comp as any).displayName = name;
  return Comp;
};

jest.mock('./screens/LoginScreen', () => ({
  __esModule: true,
  default: makeMockComponent('LoginScreenMock'),
}));
jest.mock('./screens/RegisterScreen', () => ({
  __esModule: true,
  default: makeMockComponent('RegisterScreenMock'),
}));
jest.mock('./navigation/TabNavigator', () => ({
  __esModule: true,
  default: makeMockComponent('TabNavigatorMock'),
}));
jest.mock('./screens/AdminPanel', () => ({
  __esModule: true,
  default: makeMockComponent('AdminPanelMock'),
}));
jest.mock('./screens/EditarPerfilScreen', () => ({
  __esModule: true,
  default: makeMockComponent('EditarPerfilMock'),
}));

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.resetModules();
    if (nativeStack && typeof nativeStack.__reset === 'function') {
      nativeStack.__reset();
    }
  });

  it('registers the expected stack screens', () => {
    require('./AppNavigator');

    const screens = nativeStack.__registeredScreens;
    expect(Array.isArray(screens)).toBe(true);

    const names = screens.map((s: any) => s.name);
    expect(names).toEqual(
      expect.arrayContaining(['Login', 'Registro', 'Inicio', 'Admin', 'EditarPerfil'])
    );
  });

  it('uses the AdminPanel component for the "Admin" screen', () => {
    require('./AppNavigator');

    const screens = nativeStack.__registeredScreens;
    const adminEntry = screens.find((s: any) => s.name === 'Admin');

    expect(adminEntry).toBeDefined();
    expect(adminEntry.component).toBe(AdminMock);
  });

  it('sets initialRouteName to "Login" on the stack navigator', () => {
    require('./AppNavigator');

    const navProps = nativeStack.__navigatorProps;
    expect(navProps).toBeDefined();
    expect(navProps.initialRouteName).toBe('Login');
  });
});
