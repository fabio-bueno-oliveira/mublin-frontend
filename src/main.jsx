import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { Store } from './store';
import {IKContext} from 'imagekitio-react'
import App from './App.jsx'
import './global/styles.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={Store}>
      <IKContext
        publicKey="public_vFOVSJ4ZRbnv5fT4XZFbo82R2DE="
        urlEndpoint="https://ik.imagekit.io/mublin"
        transformationPosition="path"
        authenticationEndpoint="https://mublin.herokuapp.com/imagekit"
      >
        <App />
      </IKContext>
    </Provider>
  </React.StrictMode>,
)
