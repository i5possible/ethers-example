import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [balance, setBalance] = useState('');
  const [provider, setProvider] = useState();

  const updateWalletInfo = useCallback(async () => {
    try {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const address = await provider.getSigner().getAddress();
      const bigNumber = await provider.getBalance(address);
      console.log(provider);
      console.log(address);
      console.log(bigNumber);
      setProvider(provider);
      setAccount(address);
      setBalance(ethers.utils.formatUnits(bigNumber, 'ether'));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleDisconnectWallet = useCallback(async () => {
    setProvider(null);
    setAccount('');
    setBalance('');
    setWalletConnected(false);
  }, []);

  const handleChainChanged = useCallback(async (chainId) => {
    window.location.reload();
  }, []);

  const handleAccountsChanged = useCallback(
    (accounts) => {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        setWalletConnected(true);
      }
    },
    [account]
  );

  // isConnected? ethereum, provider : null
  useEffect(() => {
    setWalletConnected(window.ethereum && window.ethereum.selectedAddress);
  }, []);

  useEffect(() => {
    if (walletConnected) {
      updateWalletInfo();
    }
  }, [walletConnected, updateWalletInfo]);

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }
    window.ethereum.on('accountsChanged', updateWalletInfo);
    window.ethereum.on('disconnect', handleDisconnectWallet);
    window.ethereum.on('chainChanged', handleChainChanged);
  }, [updateWalletInfo, handleDisconnectWallet, handleChainChanged]);

  useEffect(() => {
    if (!provider) {
      return;
    }
    // Force page refreshes on network changes
    provider.on('network', (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network
      if (oldNetwork) {
        window.location.reload();
      }
    });
  }, [provider]);

  const handleConnect = () => {
    // use eth_requestAccounts to get the accounts
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch(() => {
        console.log('Failed to connect to wallet!');
      });
  };

  const handleOnChange = (e) => {
    setSendTo(e.target.value);
  };

  const handleOnSend = async () => {
    const amount = ethers.utils.parseEther('1');
    const signer = provider.getSigner();
    console.log(`signerAddress`, await signer.getAddress());
    window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{ from: account, to: sendTo, value: amount.toHexString() }],
    });
    // This is eth_sendRawTransaction which is not supported by the test chain
    // signer.sendTransaction({
    //   to: sendTo,
    //   value: amount,
    // });
  };

  console.log(account);
  console.log(balance);

  return (
    <div className="App">
      <div className="body">
        <p>Connect to Ethereum and show the wallet info</p>
        <button className="btn" onClick={handleConnect}>
          Connect to wallet
        </button>
        {walletConnected && <p>Account: {account}</p>}
        {walletConnected && <p>Balance: {balance} ETH</p>}
        <input
          className="input"
          value={sendTo}
          onChange={handleOnChange}></input>
        <button className="btn" onClick={handleOnSend}>
          Send 1 ETH
        </button>
      </div>
    </div>
  );
}

export default App;
