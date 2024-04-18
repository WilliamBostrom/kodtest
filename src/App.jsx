import React, { useState, useEffect } from "react";
import "./App.css";

function page() {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "https://infra.devskills.app/api/accounting/transactions"
      );
      if (!response.ok) {
        throw new Error("Failed");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      account_id: accountId,
      amount: parseFloat(amount),
    };

    try {
      const response = await fetch(
        "https://infra.devskills.app/api/accounting/accounts/0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      await fetchTransactions();

      setAccountId("");
      setAmount("");
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleAccountIdChange = (e) => {
    setAccountId(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <section className="app">
      <div className="transactions">
        {" "}
        <h2>Submit new transaction</h2>
        <SubmittingForm
          accountId={accountId}
          amount={amount}
          onAccountIdChange={handleAccountIdChange}
          onAmountChange={handleAmountChange}
          onSubmit={handleSubmit}
        />
      </div>
      <div className="transactions">
        <h2>Transactions list</h2>
        {transactions.map((transaction, index) => (
          <TransactionItem key={index} transaction={transaction} />
        ))}
      </div>
    </section>
  );
}

function SubmittingForm({
  accountId,
  amount,
  onAccountIdChange,
  onAmountChange,
  onSubmit,
}) {
  return (
    <aside>
      <form className="transaction-form" onSubmit={onSubmit}>
        <label>
          <span>Account id:</span>
          <input
            type="text"
            value={accountId}
            onChange={onAccountIdChange}
            data-type="account-id"
          />
        </label>
        <label>
          <span>Amount:</span>
          <input
            type="text"
            value={amount}
            onChange={onAmountChange}
            data-type="amount"
          />
        </label>
        <button type="submit" className="btn" data-type="transaction-submit">
          Submit
        </button>
      </form>
    </aside>
  );
}

function TransactionItem({ transaction }) {
  return (
    <div
      className="transaction-list"
      data-type="transaction"
      data-account-id={transaction.account_id}
      data-amount={transaction.amount}
      data-balance="${current-account-balance}"
    >
      <p>
        Transferred ${transaction.amount} from account ${transaction.account_id}
        .
      </p>
    </div>
  );
}

export default App;
