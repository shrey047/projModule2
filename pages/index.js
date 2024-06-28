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
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(deployedContractAddress, contractABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const updateBalance = async (newBalance) => {
    if (atm) {
      let tx = await atm.updateBalance(newBalance);
      await tx.wait();
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
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p style={styles.paragraph}>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button style={styles.button} onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    if (contractAddress === undefined) {
      fetchContractAddress();
    }

    return (
      <div>
        <p style={styles.paragraph}>Your Account: {account}</p>
        <p style={styles.paragraph}>Your Balance: {balance}</p>
        <p style={styles.paragraph}>Contract Address: {contractAddress}</p>
        <button style={styles.button} onClick={deposit}>Deposit 1 ETH</button>
        <button style={styles.button} onClick={withdraw}>Withdraw 1 ETH</button>
        <button style={styles.button} onClick={() => updateBalance(20)}>Set Balance to 20 ETH</button>
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
      <header><h1 style={styles.header}>Welcome to Shrey's ATM!</h1></header>
      {initUser()}
    </main>
  );
}
