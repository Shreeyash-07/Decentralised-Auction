import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import NewAuction from "./components/NewAuction";
import Show from "./components/Show";
import MyBids from "./components/MyBids";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auction/newAuction" element={<NewAuction />} />
        <Route path="/auction/:auctionId" element={<Show />} />
        <Route path="/mybids" element={<MyBids />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
