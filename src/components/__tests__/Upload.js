import React from 'react';
import Upload from '../Upload';
import renderer from 'react-test-renderer';

test('Upload should render', () => {
  const component = renderer.create(<Upload />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Upload should render with feedbackPosition', () => {
  const component = renderer.create(<Upload feedbackPosition="inside" />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Upload should render with style', () => {
  const component = renderer.create(
    <Upload style={{ border: '1px solid red' }} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
