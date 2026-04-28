// import { ethers } from "ethers";
// import { ChatAppAddress, ChatAppABI } from "../Context/constants";

// const LOCAL_CHAIN_ID_HEX = "0x539"; // 1337

// const ensureLocalNetwork = async () => {
//   const chainId = await window.ethereum.request({ method: "eth_chainId" });
//   if (chainId === LOCAL_CHAIN_ID_HEX) return true;

//   try {
//     await window.ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: LOCAL_CHAIN_ID_HEX }],
//     });
//     return true;
//   } catch (switchError) {
//     if (switchError?.code !== 4902) return false;

//     await window.ethereum.request({
//       method: "wallet_addEthereumChain",
//       params: [
//         {
//           chainId: LOCAL_CHAIN_ID_HEX,
//           chainName: "Localhost 8545",
//           rpcUrls: ["http://127.0.0.1:8545"],
//           nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
//         },
//       ],
//     });
//     return true;
//   }
// };

// // check wallet
// export const ChechIfWalletConnected = async () => {
//   try {
//     if (!window.ethereum) return null;

//     const accounts = await window.ethereum.request({
//       method: "eth_accounts",
//     });

//     return accounts[0] ?? null;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// // connect wallet
// export const connectWallet = async () => {
//   try {
//     if (!window.ethereum) return null;

//     const chainReady = await ensureLocalNetwork();
//     if (!chainReady) return null;

//     const accounts = await window.ethereum.request({
//       method: "eth_requestAccounts",
//     });

//     return accounts[0];
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// // contract helper
// const fetchContract = async (signer) =>
//   new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

// export const connectingWithContract = async () => {
//   try {
//     if (!window.ethereum) {
//       alert("Please install MetaMask");
//       return null;
//     }

//     const chainReady = await ensureLocalNetwork();
//     if (!chainReady) {
//       alert("Please switch MetaMask to Localhost 8545 (chainId 1337)");
//       return null;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const code = await provider.getCode(ChatAppAddress);

//     // Prevent transactions to an EOA/wrong address when network/address mismatch happens.
//     if (!code || code === "0x") {
//       alert("Contract not found on this network. Deploy and update Context/constants.js");
//       return null;
//     }

//     const contract = await fetchContract(signer);
//     return contract;
//   } catch (error) {
//     console.log("connectingWithContract error:", error);
//     return null;
//   }
// };

// // time convert
// export const converTime = (time) => {
//   const newTimer = new Date(Number(time) * 1000);
  
//   // Pad single digit numbers with leading zero
//   const pad = (num) => String(num).padStart(2, '0');
  
//   const realTime = 
//     pad(newTimer.getHours()) +
//     ":" +
//     pad(newTimer.getMinutes()) +
//     ":" +
//     pad(newTimer.getSeconds()) +
//     " Date: " +
//     pad(newTimer.getDate()) +
//     "/" +
//     pad(newTimer.getMonth() + 1) +
//     "/" +
//     newTimer.getFullYear();
    
//   return realTime;
// };


import { ethers } from "ethers";
import { ChatAppAddress, ChatAppABI } from "../Context/constants";

const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"; // 11155111 = Sepolia

const ensureSepoliaNetwork = async () => {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId === SEPOLIA_CHAIN_ID_HEX) return true;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
    return true;
  } catch (switchError) {
    if (switchError?.code !== 4902) return false;

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: "Sepolia Test Network",
          rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/YoxxIaNRJnO3xmp5y0cP1"],
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        },
      ],
    });
    return true;
  }
};

// check wallet
export const ChechIfWalletConnected = async () => {
  try {
    if (!window.ethereum) return null;
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    return accounts[0] ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// connect wallet
export const connectWallet = async () => {
  try {
    if (!window.ethereum) return null;
    const chainReady = await ensureSepoliaNetwork();
    if (!chainReady) return null;
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// contract helper
export const connectingWithContract = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return null;
    }

    const chainReady = await ensureSepoliaNetwork();
    if (!chainReady) {
      alert("Please switch MetaMask to Sepolia network");
      return null;
    }

    // ✅ Alchemy for reading — no rate limit
    const alchemyProvider = new ethers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/YoxxIaNRJnO3xmp5y0cP1"
    );

    // ✅ Check contract exists on Sepolia
    const code = await alchemyProvider.getCode(ChatAppAddress);
    if (!code || code === "0x") {
      alert("Contract not found on Sepolia. Run: npx hardhat run scripts/deploy.js --network sepolia");
      return null;
    }

    // ✅ MetaMask only for signing
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();

    const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
    return contract;

  } catch (error) {
    console.log("connectingWithContract error:", error);
    return null;
  }
};

// time convert
export const converTime = (time) => {
  const newTimer = new Date(Number(time) * 1000);
  const pad = (num) => String(num).padStart(2, "0");
  return (
    pad(newTimer.getHours()) + ":" +
    pad(newTimer.getMinutes()) + ":" +
    pad(newTimer.getSeconds()) +
    " Date: " +
    pad(newTimer.getDate()) + "/" +
    pad(newTimer.getMonth() + 1) + "/" +
    newTimer.getFullYear()
  );
};