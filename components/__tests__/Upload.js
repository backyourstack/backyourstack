import { render } from '@testing-library/react';
import React from 'react';

import Upload from '../Upload';

test('Upload should render', () => {
  const { asFragment } = render(<Upload />);
  expect(asFragment()).toMatchSnapshot();
});

test('Upload should render with feedbackPosition', () => {
  const { asFragment } = render(<Upload feedbackPosition="inside" />);
  expect(asFragment()).toMatchSnapshot();
});

test('Upload should render with style', () => {
  const { asFragment } = render(<Upload style={{ border: '1px solid red' }} />);
  expect(asFragment()).toMatchSnapshot();
});
