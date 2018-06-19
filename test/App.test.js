import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  ReactDOM.unmountComponentAtNode(div);
});