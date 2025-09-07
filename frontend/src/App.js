import React from 'react';
import { FruitProvider } from './context/FruitContext';
import FruitInventory from './components/FruitInventory';

function App() {
  return (
    <div className="App">
      <FruitProvider>
        <FruitInventory />
      </FruitProvider>
    </div>
  );
}

export default App;