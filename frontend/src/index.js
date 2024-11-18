import './styles/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { StateProvider } from "./contexts/pomodoro-clock/stateProvider";
import reducer, { initialState } from "./components/pomodoro-clock/reducer";



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StateProvider reducer={reducer} initialState={initialState}>
        <App />
      </StateProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);