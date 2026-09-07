import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function AppComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      setLoading(false);
      // Hide splash screen when app is ready
      SplashScreen.hide();
    });

    return () => unsubscribe();
  }, []);

  // Handle app lifecycle
  useEffect(() => {
    const pauseListener = App.addListener('pause', () => {
      console.log('App paused');
    });

    const resumeListener = App.addListener('resume', () => {
      console.log('App resumed');
    });

    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      }
    });

    return () => {
      pauseListener.remove();
      resumeListener.remove();
      backButtonListener.remove();
    };
  }, []);

  if (loading) {
    return <div className="App loading">Loading...</div>;
  }

  return (
    <div className="App">
      {user ? <Dashboard /> : <Auth setUser={setUser} />}
    </div>
  );
}

export default AppComponent;
