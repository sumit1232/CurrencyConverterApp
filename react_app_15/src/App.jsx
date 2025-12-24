import { useEffect, useState } from "react";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState("0.00");
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://api.frankfurter.app/latest"
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        if (!data.rates) {
          throw new Error("Invalid API response");
        }

        // Frankfurter does not include base currency in rates
        setRates({ USD: 1, ...data.rates });
      } catch (err) {
        setError("Failed to fetch exchange rates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Convert currency
  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      const converted =
        (Number(amount) / rates[fromCurrency]) *
        rates[toCurrency];

      setResult(converted.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency((prev) => {
      setToCurrency(prev);
      return toCurrency;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          Currency Converter 💱
        </h1>

        {loading && (
          <p className="text-center text-gray-500">
            Loading exchange rates...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-medium">
            {error}
          </p>
        )}

        {!loading && !error && Object.keys(rates).length > 0 && (
          <>
            {/* Amount */}
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Amount
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* From */}
            <div className="mb-4">
              <label className="block font-medium mb-1">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="border p-2 rounded w-full"
              >
                {Object.keys(rates).map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <div className="flex justify-center mb-4">
              <button
                onClick={swapCurrencies}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                🔄 Swap
              </button>
            </div>

            {/* To */}
            <div className="mb-4">
              <label className="block font-medium mb-1">
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="border p-2 rounded w-full"
              >
                {Object.keys(rates).map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </div>

            {/* Result */}
            <div className="bg-gray-100 p-3 rounded text-center">
              <p className="text-lg font-semibold">
                {amount} {fromCurrency} =
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {result} {toCurrency}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
