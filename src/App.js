import { useState, useEffect } from "react";
import styles from "./App.module.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [dollar, setDollar] = useState(0);
  const [coinPrice, setCoinPrice] = useState("");
  const [result, setResult] = useState(0);
  const [coinName, setCoinName] = useState("");
  const [coinID, setCoinID] = useState("");

  //api를 json으로 변환
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
      });
  }, []);
  // onChange 속성
  const onChange = (e) => {
    setInputValue(e.target.value);
  };
  //onSubmit 속성
  const onSubmit = (e) => {
    e.preventDefault();
    if (inputValue === "") {
      return;
    }
    setDollar(Number(inputValue));
  };
  const onSelect = (e) => {
    const id = e.target.value;
    setCoinID(id);
    console.log(id);
    if (id) {
      const selectedCoin = coins.find((coin) => coin.id === id);
      setCoinPrice(selectedCoin.quotes.USD.price.toString());
      setCoinName(selectedCoin.name);
    } else {
      setCoinPrice("");
      setCoinName("");
      setResult(0);
    }
  };

  useEffect(() => {
    const price = Number(coinPrice);
    if (dollar > 0 && price > 0) {
      const coinCount = dollar / price;
      setResult(coinCount);
    }
  }, [dollar, coinPrice]);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>The Coins! ({coins.length})</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.input}
          type="number"
          value={inputValue}
          onChange={onChange}
          placeholder="당신이 가진 달러를 입력"
        ></input>
        <div>
          <div>
            <h2>당신이 가진 달러: {dollar > 0 ? `$${dollar}` : null}</h2>
            {result > 0 && (
              <h3 className={styles.result}>
                당신은 {result.toFixed(6)}개의 {coinName}코인을 가질 수
                있습니다.
              </h3>
            )}
          </div>
          {loading ? (
            <strong>Loading...</strong>
          ) : (
            <select
              className={styles.select}
              value={coinID}
              onChange={onSelect}
            >
              <option value="">-- 코인을 선택하세요 --</option>
              {coins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol}): ${coin.quotes.USD.price} USD
                </option>
              ))}
            </select>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
