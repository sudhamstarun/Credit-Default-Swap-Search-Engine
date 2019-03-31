import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'source-sans-pro';
import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import MainView from './components/MainView';

ReactDOM.render( <
    MainView / > ,
    document.getElementById('main-view')
);
