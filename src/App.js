import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, Switch } from "react-router-dom";
import { GlobalState } from "./Globalstate";
import AppContainer from "./AppContainer";
import Dashboard from "./Pages/Dashboard";
import Deposit from "./Pages/Deposit";
import DepositComplete from "./Pages/DepositComplete";
import Withdrwal from "./Pages/Withdrwal";
import WithdrawalComplete from "./Pages/WithdrawalComplete";
import Kyc from "./Pages/Kyc";
import Support from "./Pages/Support";
import Referral from "./Pages/Referral";
import Cryptoexchange from "./Pages/Cryptoexchange";
import Seettings from "./Pages/Seettings";
import Subscribe from "./Pages/Subscribe";
import MyInvestment from "./Pages/MyInvestment";
import TransactionHistory from "./Pages/TransactionHistory";


import "./App.css"


function App() {

  return (
    <GlobalState>
      {/* <ToastContainer className="foo" /> */}
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<AppContainer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/confirmdeposit" element={<DepositComplete />} />
          <Route path="/settings" element={<Seettings />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/myinvestment" element={<MyInvestment />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/withdrawal" element={<Withdrwal />} />
          <Route path="/confirmwithdrawal" element={<WithdrawalComplete />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/support" element={<Support />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/cryptoexchange" element={<Cryptoexchange />} />



        </Routes>
      </BrowserRouter>
    </GlobalState>
  );
}

export default App;
