import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const CryptoPriceTable = () => {
  const [coins, setCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const start = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.coinlore.com/api/tickers/");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.data) {
          throw new Error("Invalid data format received from API");
        }

        setCoins(data.data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Failed to fetch cryptocurrency data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const currentCoins = coins.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(coins.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 space-y-4 text-sm">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Mobile Card Component
  const MobileCard = ({ coin, index }) => (
    <div
      className={`${
        index % 2 === 0 ? "bg-gray-300" : "bg-white"
      } border-b border-gray-200 p-2`}
    >
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-start flex-col gap-1">
          <span className="text-black font-bold">💰 Coin</span>
          <span>{coin.name}</span>
        </div>
        <div className="flex items-start flex-col gap-1">
          <span className="text-black font-bold">📄 Code</span>
          <span>{coin.symbol}</span>
        </div>
        <div className="flex items-start flex-col gap-1 justify-end">
          <span className="text-black font-bold">🤑 Price</span>
          <span>
            $
            {Number(coin.price_usd).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </span>
        </div>
        <div className="flex items-start flex-col gap-1 justify-end">
          <span className="text-black font-bold">📉 Total Supply</span>
          <span>
            {Number(coin.tsupply).toLocaleString()} {coin.symbol}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl">
      {/* Mobile View (< md screens) */}
      <div className="md:hidden bg-white rounded-md">
        {currentCoins.map((coin, index) => (
          <MobileCard key={coin.id} coin={coin} index={index} />
        ))}
      </div>

      {/* Desktop View (md and above screens) */}
      <div className="hidden md:block bg-white rounded-t-xl shadow-md overflow-hidden">
        <div className="rounded-t-xl overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-black w-1/4 first:rounded-tl-xl">
                  💰 Coin
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black w-1/4">
                  📄 Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black w-1/4">
                  🤑 Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black w-1/4 last:rounded-tr-xl">
                  📉 Total Supply
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCoins.map((coin, index) => (
                <tr
                  key={coin.id}
                  className={index % 2 === 0 ? "bg-gray-300" : "bg-white"}
                >
                  <td className="px-6 py-2 text-sm text-gray-900">
                    {coin.name}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-900">
                    {coin.symbol}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-900">
                    $
                    {Number(coin.price_usd).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-900">
                    {Number(coin.tsupply).toLocaleString()} {coin.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination Controls */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-gray-200  md:rounded-b-xl bg-white">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`text-sm px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
            currentPage === 1 ? "invisible" : ""
          }`}
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="text-sm px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CryptoPriceTable;
