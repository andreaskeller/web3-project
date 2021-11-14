import abi from "lib/BestYouTubeVideos.json";
import { ethers } from "ethers";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Home() {
  const [allVideos, setAllVideos] = useState([]);
  const contractABI = abi.abi;
  const contractAddress = "0xdB2b5164dFcc4F53E7b3db1B3b9bC4902EDb3fCc";
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState("");
  const [videoLink, setVideoLink] = useState("");
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
        getAllVideos();
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
      getAllVideos();
    } catch (error) {
      console.log(error);
    }
  }

  async function getAllVideos() {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const videos = await contract.getAllVideos();

        console.log(videos);

        setAllVideos(
          videos.map((video) => ({
            address: video.sender,
            timestamp: new Date(video.timestamp * 1000),
            link: video.link,
          }))
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addVideo() {
    setError("");

    try {
      if (!videoLink.includes("youtube")) {
        return setError(
          "You need to provide a YouTube link, e.g. https://www.youtube.com/watch?v=a0osIaAOFSE"
        );
      }

      const strippedVideoLink = videoLink.includes("&")
        ? videoLink.substring(0, videoLink.indexOf("&"))
        : videoLink;

      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await contract.getTotalVideos();
        console.log("Retrieved total videos count...", count.toNumber());

        const txn = await contract.addVideo(strippedVideoLink, {
          gasLimit: 300000,
        });
        console.log("Mining...", txn.hash);
        setMining(true);

        await txn.wait();
        setMining(false);
        console.log("Mined -- ", txn.hash);

        count = await contract.getTotalVideos();
        console.log("Retrieved total videos count...", count.toNumber());

        setVideoLink("");
        // getAllVideos();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setVideoLink(e.target.value);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    let contract;

    const onNewVideoAdded = (from, timestamp, videoLink) => {
      console.log("NewVideoAdded", from, timestamp, videoLink);
      setAllVideos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          link: videoLink,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      contract = new ethers.Contract(contractAddress, contractABI, signer);
      contract.on("NewVideoAdded", onNewVideoAdded);
    }

    return () => {
      if (contract) {
        contract.off("NewVideoAdded", onNewVideoAdded);
      }
    };
  }, []);

  return (
    <div className="my-16 px-4">
      <div className="flex flex-col justify-center max-w-2xl mx-auto">
        <div className="text-center text-2xl font-semibold">
          Best YouTube videos
        </div>

        <div className="text-center text-gray-400 mt-4">
          Send me your best YouTube videos!
        </div>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        <input
          className="mt-4 p-2 border border-gray-200 hover:border-gray-400 focused:border-gray-400"
          type="text"
          onChange={handleChange}
          value={videoLink}
        />

        <button
          className="cursor-pointer mt-4 p-2 border-0 rounded-md bg-gray-100"
          onClick={addVideo}
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
              Saving video ...
            </>
          ) : (
            "Add your favorite video"
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

        <div className="mt-8 space-y-6 w-full">
          {allVideos
            .filter(({ link }) => link?.includes("youtube"))
            .reverse()
            .map(({ link, address, timestamp }, index) => {
              return (
                <div key={index}>
                  <div className="flex justify-between">
                    {format(timestamp, "P")}{" "}
                    <div>
                      {address.substring(0, 6)}...
                      {address.substring(address.length - 4, address.length)}
                    </div>
                  </div>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${link.substring(
                        link.indexOf("v=") + 2
                      )}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
