import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

test('renders a simple component', () => {
  const { getByText } = render(<Text>Hola UdecFit</Text>);
  expect(getByText('Hola UdecFit')).toBeTruthy();
});
