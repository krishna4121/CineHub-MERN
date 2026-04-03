import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter  } from 'react-router-dom';
import  MovieProvider  from './Context/MovieContext';
import UserProvider from './Context/UserContext';
import LoadingProvider from './Context/LoagindContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <MovieProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </MovieProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);


