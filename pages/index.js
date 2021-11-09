import { ethers } from "ethers";

export default function Home() {
  const sendMessage = () => {};

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
          Send message
        </button>
      </div>
    </div>
  );
}
