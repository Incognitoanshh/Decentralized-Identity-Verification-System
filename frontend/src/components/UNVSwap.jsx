import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Token List
const tokens = [
  { name: "Ethereum", symbol: "ETH", address: ethers.constants.AddressZero }, // ETH address is zero address
  {
    name: "Tether",
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48",
  },
  {
    name: "Dai",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
];

// Uniswap Router Details
const UNISWAP_ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function approve(address spender, uint256 amount) external returns (bool)",
];
const UNISWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router Address

const UNVSwap = () => {
  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState(tokens[1]);
  const [amount, setAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState("0");

  useEffect(() => {
    fetchConversionRate();
    fetchBalance();
  }, [sellToken, buyToken]);

  // Fetch conversion rate using CoinGecko API
  const fetchConversionRate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${sellToken.name.toLowerCase()},${buyToken.name.toLowerCase()}&vs_currencies=usd`
      );
      const data = await response.json();
      setConversionRate(
        data[sellToken.name.toLowerCase()]?.usd /
          data[buyToken.name.toLowerCase()]?.usd
      );
    } catch (error) {
      console.error("Error fetching price:", error);
    }
    setLoading(false);
  };

  // Fetch user balance for the selected sell token
  const fetchBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      if (sellToken.symbol === "ETH") {
        const balance = await provider.getBalance(userAddress);
        setUserBalance(ethers.utils.formatEther(balance));
      } else {
        const tokenContract = new ethers.Contract(
          sellToken.address,
          ["function balanceOf(address owner) view returns (uint256)"],
          signer
        );
        const balance = await tokenContract.balanceOf(userAddress);
        setUserBalance(ethers.utils.formatUnits(balance, 18)); // Assuming 18 decimals
      }
    }
  };

  // Approve token if required
  const approveToken = async (tokenAddress, amount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) external returns (bool)",
      ],
      signer
    );

    const tx = await tokenContract.approve(
      UNISWAP_ROUTER_ADDRESS,
      ethers.utils.parseUnits(amount, 18)
    );
    await tx.wait();
    console.log("Token approved!");
  };

  // Swap function
  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Enter a valid amount to swap");
      return;
    }

    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const router = new ethers.Contract(
        UNISWAP_ROUTER_ADDRESS,
        UNISWAP_ROUTER_ABI,
        signer
      );
      const userAddress = await signer.getAddress();

      if (sellToken.symbol === "ETH") {
        // Swap ETH for Token
        const tx = await router.swapExactETHForTokens(
          0, // Minimum amount of tokens to receive (slippage tolerance)
          [ethers.constants.AddressZero, buyToken.address], // Path: ETH -> Target Token
          userAddress, // Recipient
          Math.floor(Date.now() / 1000) + 60 * 20, // Deadline
          { value: ethers.utils.parseEther(amount) } // Amount of ETH to send
        );
        await tx.wait();
      } else {
        // Approve token
        await approveToken(sellToken.address, amount);

        // Swap Token for Token
        const tx = await router.swapExactTokensForTokens(
          ethers.utils.parseUnits(amount, 18), // Sell token amount
          0, // Minimum buy token amount (slippage tolerance)
          [sellToken.address, buyToken.address], // Path: Sell -> Buy
          userAddress, // Recipient
          Math.floor(Date.now() / 1000) + 60 * 20 // Deadline
        );
        await tx.wait();
      }

      alert("Swap successful!");
      fetchBalance(); // Refresh user balance after swap
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Check console for details.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg w-1/2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Swap Tokens</h1>

      {/* Sell Token */}
      <div className="mb-4">
        <label className="block text-gray-400">Sell</label>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 bg-gray-800 w-full text-white rounded-lg"
        />
        <select
          className="p-3 bg-gray-700 w-full mt-2 text-white rounded-lg"
          value={sellToken.symbol}
          onChange={(e) =>
            setSellToken(tokens.find((t) => t.symbol === e.target.value))
          }
        >
          {tokens.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Buy Token */}
      <div className="mb-4">
        <label className="block text-gray-400">Buy</label>
        <div className="p-3 bg-gray-800 w-full text-white rounded-lg">
          {amount && conversionRate
            ? (amount * conversionRate).toFixed(4)
            : "0"}{" "}
          {buyToken.symbol}
        </div>
        <select
          className="p-3 bg-gray-700 w-full mt-2 text-white rounded-lg"
          value={buyToken.symbol}
          onChange={(e) =>
            setBuyToken(tokens.find((t) => t.symbol === e.target.value))
          }
        >
          {tokens.map((token) => (
            <option key={token.symbol} value={token.symbol}>
              {token.name} ({token.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        className={`w-full p-3 mt-4 rounded-lg font-bold ${
          parseFloat(amount) > parseFloat(userBalance)
            ? "bg-red-600"
            : "bg-blue-600 hover:bg-blue-800"
        }`}
        disabled={parseFloat(amount) > parseFloat(userBalance) || loading}
      >
        {loading
          ? "Swapping..."
          : parseFloat(amount) > parseFloat(userBalance)
          ? "Insufficient Balance"
          : "Swap"}
      </button>

      {/* User Balance */}
      <p className="text-gray-400 text-sm mt-2">
        Your {sellToken.symbol} Balance: {userBalance}
      </p>
    </div>
  );
};

export default UNVSwap;
