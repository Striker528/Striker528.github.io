import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import reportWebVitals from './reportWebVitals';
//https://reactrouter.com/docs/en/v6/getting-started/overview
import { BrowserRouter } from 'react-router-dom';
//contextProviders has all the hooks the App needs to be wrapped in
import ContextProviders from './context';
//import AuthProvider from './context/AuthProvider';
//import NotificationProvider from './context/NotificationProvider';
//import ThemeProvider from './context/ThemeProvider';

//k/*
const root = ReactDOM.createRoot(document.getElementById('root'));
///*
root.render(
  <BrowserRouter>
    <ContextProviders>
      <App/>
    </ContextProviders>
  </BrowserRouter>
);
//*/
/*
root.render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <React.StrictMode>
            <App/>
          </React.StrictMode>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
)
*/

//ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
