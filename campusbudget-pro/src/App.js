import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App(
) {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) setUser(user);
  });

  return (
    <div className="App">
      {user ? <Dashboard /> : <Auth setUser={setUser} />}
    </div>
  );
}

export default App;
