import React, { createContext } from 'react';
import './App.css';
import { HomePage } from './pages/home-page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletPage } from './pages/wallet-page';
import { BlockchainPage } from './pages/blockchain-page';
import { ApiService } from './services/api-service';
import { WalletStore } from './stores/wallet-store';

const apiService = new ApiService();

const contextValue = {
  walletStore: new WalletStore(apiService),
};
export const StoreContext = createContext(contextValue);

function App() {
  return (
    <StoreContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="wallet" element={<WalletPage />} />
            <Route path="blockchain" element={<BlockchainPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreContext.Provider>
  );
}

export default App;
