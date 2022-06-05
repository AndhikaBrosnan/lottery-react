import React, { useState, useEffect } from "react";
import lottery from "./lottery";
import web3 from "./web3";

const App = () => {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState("");
  const [balance, setBalance] = useState("");

  const [inputAmt, setInputAmt] = useState("");
  const [message, setMessage] = useState("");

  useEffect(async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  }, []);

  const onChangeInputForm = (value) => {
    setInputAmt(value);
  };

  const onHandleSubmitForm = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting for transaction process");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(inputAmt, "ether"),
    });

    setMessage("You have been entered");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        Currently there are {players.length} players to compete to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <form onSubmit={onHandleSubmitForm}>
        <h2>Test your luck!</h2>
        Amount of ether you want to enter:{" "}
        <input
          onChange={(e) => onChangeInputForm(e.target.value)}
          value={inputAmt}
          placeholder="enter ether amount"
        />
        <button>Enter</button>
      </form>

      <h1>{message}</h1>
    </div>
  );
};
export default App;
