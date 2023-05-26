import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import logo from './assets/sparky-dash-high-five.gif';
import { getFirebaseToken, onForegroundMessage, signInWithGoogle } from './firebase';

export default function App() {
  const [showNotificationBanner, setShowNotificationBanner] = useState(Notification.permission === 'default');

  useEffect(() => {
    onForegroundMessage()
      .then((payload) => {
        console.log('Received foreground message: ', payload);
        const { notification: { title, body } } = payload;
        toast(<ToastifyNotification title={title} body={body} />);
      })
      .catch(err => console.log('An error occured while retrieving foreground message. ', err));
  }, []);

  const handleGetFirebaseToken = () => {
    getFirebaseToken()
      .then((firebaseToken) => {
        console.log('Firebase token: ', firebaseToken);
        if (firebaseToken) {
          toast(<ToastifyNotification title="Permission granted" body="You can now receive push notifications." />);
          setShowNotificationBanner(false);
        }
      })
      .catch((err) => console.error('An error occured while retrieving firebase token. ', err))
  }

  const handleSignInWithGoogle = () => {
    signInWithGoogle()
      .then((result) => {
        console.log('Google sign in result: ', result);
        console.log('Access token: ', result.user.accessToken);
        toast(<ToastifyNotification title="Sign in successful" body="You are now signed in with Google." />);
      })
      .catch((err) => console.error('An error occured while signing in with Google. ', err))
  }


  const ToastifyNotification = ({ title, body }) => (
    <div className="push-notification">
      <h2 className="push-notification-title">{title}</h2>
      <p className="push-notification-text">{body}</p>
    </div>
  );

  return (
    <div className="app">
      {showNotificationBanner && <div className="notification-banner">
        <span>The app needs permission to</span>
        <a
          href="#"
          className="notification-banner-link"
          onClick={handleGetFirebaseToken}
        >
          enable push notifications.
        </a>
      </div>}

      <img src={logo} className="app-logo" alt="logo" />

      <button
        className="btn-primary"
        onClick={handleGetFirebaseToken}
      >
        Get Firebase Token
      </button>
      <span className="app-divider">or</span>
      <button
        className="btn-primary"
        onClick={handleSignInWithGoogle}
      >
        Sign in with Google
      </button>

      <ToastContainer hideProgressBar />
    </div>
  );
}
