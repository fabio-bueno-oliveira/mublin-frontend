import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Store } from './store'
import {IKContext} from 'imagekitio-react'
import App from './App.jsx'
import './global/styles.scss'

const loggedUser = JSON.parse(localStorage.getItem('user'))

// Imagekit Image Upload Authenticator
const publicKey = "public_vFOVSJ4ZRbnv5fT4XZFbo82R2DE="
const urlEndpoint = "https://ik.imagekit.io/mublin"
const authenticator = async () => {
  try {
    const headers = {
      'Authorization': `Bearer ${loggedUser?.token}`,
      'CustomHeader': 'CustomValue'
    };
    const response = await fetch("https://mublin.herokuapp.com/imagekit", {
        headers
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={Store}>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        transformationPosition="path"
        authenticator={authenticator}
      >
        <App />
      </IKContext>
    </Provider>
  // </React.StrictMode>,
)
