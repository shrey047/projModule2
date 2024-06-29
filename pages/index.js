import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [contractAddress, setContractAddress] = useState(undefined);

  const contractABI = atm_abi.abi;
  const deployedContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(new ethers.providers.Web3Provider(window.ethereum));
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.send("eth_requestAccounts");
    setAccount(accounts[0]);

    // Once wallet is set, get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(deployedContractAddress, contractABI, signer);
    setATM(atmContract);

    // Fetch initial balance and contract address
    getBalance();
    fetchContractAddress();
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const updateBalance = async (newBalance) => {
    if (atm) {
      await atm.updateBalance(newBalance);
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      await atm.withdrawAll();
      getBalance();
    }
  };

  const fetchContractAddress = async () => {
    if (atm) {
      const address = await atm.getContractAddress();
      setContractAddress(address);
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p style={styles.paragraph}>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return <button style={styles.button} onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    return (
      <div>
        <p style={styles.paragraph}>Connected Account: {account}</p>
        <p style={styles.paragraph}>Contract Address: {contractAddress}</p>
        <p style={styles.paragraph}>Current Balance: {balance} ETH</p>
        <button style={styles.button} onClick={() => updateBalance(10)}>Set Balance to 10 ETH</button>
        <button style={styles.button} onClick={withdraw}>Withdraw All ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  const styles = {
    container: {
      textAlign: "center",
      backgroundColor: "#f0f0f0",
      minHeight: "100vh",
      color: "#333",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      fontSize: "2.5em",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    paragraph: {
      fontSize: "1.2em",
      margin: "10px 0",
    },
    button: {
      margin: "5px",
      padding: "10px 20px",
      backgroundColor: "#6200ea",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1em",
    },
    buttonHover: {
      backgroundColor: "#3700b3",
    },
  };

  return (
    <main style={styles.container}>
      <header><h1 style={styles.header}>Welcome to Your Ethereum ATM!</h1></header>
      {initUser()}
    </main>
  );
}
