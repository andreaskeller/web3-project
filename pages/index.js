import abi from "lib/WavePortal.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  const contractABI = abi.abi;
  const contractAddress = "0xcE7940e770eB705D89ff5d0520E13f30de20FadA";
  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState(false);

  async function checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function connectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendMessage() {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total message count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);
        setMining(true);

        await waveTxn.wait();
        setMining(false);
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="flex justify-center w-full mt-16">
      <div className="flex flex-col justify-center max-w-2xl">
        <div className="text-center text-2xl font-semibold">👋 Hey there!</div>

        <div className="text-center text-gray-400 mt-4">
          I am Andreas and I'm learning how to build a web3 app. Connect your
          Ethereum wallet and send me a message!
        </div>

        <button
          className="cursor-pointer mt-4 p-2 border-0 rounded-md bg-gray-100"
          onClick={sendMessage}
        >
          {mining ? (
            <>
              <svg
                className="animate-spin inline -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>{" "}
              Saving message ...
            </>
          ) : (
            "Send message"
          )}
        </button>

        {!currentAccount && (
          <button
            className="cursor-pointer mt-4 p-2 border-0 rounded-md bg-gray-100"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
