import Enzyme, { shallow, mount, render } from 'enzyme';
import React from 'react';
import App from '../components/App';
import renderer from 'react-test-renderer'

// describe what we are testing
describe('App startup', () => {
  it('should render without throwing an error', () => {
    const render = renderer.create(<App />).toJSON();
    expect(render).toMatchSnapshot();
  })
})