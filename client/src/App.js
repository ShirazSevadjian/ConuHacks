import './App.css';

import { useState, useEffect } from 'react';
import Main from "./pages/Main";
import logo from "./logo.png";

const App = () => {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSplash(false)
    }, 3000);
  }, []);

  if (splash) return <Splash />
  return <Main />
}

const Splash = () => {
  return (
    <div className='splash'>
      <img className='img' src={logo} />
    </div>
  );
};

export default App;
