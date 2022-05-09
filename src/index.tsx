/*
  Modul: index.tsx
  Autor: Hůlek Matěj
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { rootReducer } from './reducers';

export const store = createStore(
  rootReducer
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);