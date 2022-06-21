import React from 'react';
import './App.css';
import { HomePage } from './pages/home-page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletPage } from './pages/wallet-page';
import { BlockchainPage } from './pages/blockchain-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="wallet" element={<WalletPage />} />
          <Route path="blockchain" element={<BlockchainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
