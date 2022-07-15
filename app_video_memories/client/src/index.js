//place where we initalize redux

import React from 'react';
import ReactDOM from 'react-dom';
//Provider will keep track of the store which is the global state
//and that allows us to access that store from anywhere inside of that app
//don't have to be in a parent or child component 
import { Provider } from 'react-redux';
//can't use createStore anymore, have to use configureStore
//import { configureStore, applyMiddleware, compose } from 'redux';
//import { applyMiddleware, compose } from 'redux';
//import { createStore, applyMiddleware, compose } from 'redux';

//https://youtu.be/GpAAQnrxiGQ
//npm install --save redux react-redux @reduxjs/toolkit
import { configureStore } from '@reduxjs/toolkit';

//import thunk from 'redux-thunk';
import reducers from './reducers';

import App from './App';


//https://youtu.be/GpAAQnrxiGQ
//const store = configureStore(reducers, compose(applyMiddleware(thunk)))
//const store = createStore(reducers, compose(applyMiddleware(thunk)))
//const store = configureStore(reducers, compose(applyMiddleware(thunk)))
//https://stackoverflow.com/questions/69502147/changing-from-redux-to-redux-toolkit
///*
const store = configureStore({
    reducer: { reduc: reducers }
});
//*/

///*
ReactDOM.render(
    //wrap out application in a provider component
    <Provider store = {store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
//*/
//connecting to the div with an id of root
//ReactDOM.render(<App />, document.getElementById('root'));