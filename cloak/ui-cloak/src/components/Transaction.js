import React, { useState } from "react";
import Send from "./SendFunds";
import Receive from "./Receive";
import Withdraw from "./Withdraw";

const Transaction = ({ setShow }) => {
  const [showSend, setShowSend] = useState(true);
  const [buttonStatus, setButtonStatus] = useState({
    transfer: true,
    Receive: false,
    withdraw: false,
  });

  const handleTransferClick = () => {
    setButtonStatus({
      Receive: false,
      withdraw: false,
      transfer: true,
    });
    setShow("transfer");
  };

  const handleReceiveClick = () => {
    setButtonStatus({
      Receive: true,
      withdraw: false,
      transfer: false,
    });
    setShow("receive");
  };

  const handleWithdrawClick = () => {
    setButtonStatus({
      withdraw: true,
      Receive: false,
      transfer: false,
    });
    setShow("withdraw");
  };

  return (
    <div
      className="flex max-w-[500px] flex-col items-start justify-start backdrop-blur-[50px]
      hover:backdrop-blur-lg sm:px-8"
    >
      <div
        className="montserrat-subheading border-bgGray mx-auto flex
        max-w-[500px] pb-2 text-[1.4rem] font-extrabold"
      >
        <button
          onClick={handleTransferClick}
          className={`border-b-2  border-black px-6 py-1 text-left
        ${
          buttonStatus.transfer
            ? "border-b-2 border-orange-800 bg-[#FFF7F7] text-orange-500 shadow-xl shadow-gray-300"
            : "text-gray-900"
        }`}
        >
          Transfer
        </button>
        <button
          onClick={handleReceiveClick}
          className={`border-b-2  border-black px-6 py-1 text-left
          ${
            buttonStatus.Receive
              ? "border-b-2 border-orange-800 bg-[#FFF7F7] text-orange-500 shadow-xl shadow-gray-300"
              : "text-gray-900"
          }`}
        >
          Receive
        </button>
        <button
          onClick={handleWithdrawClick}
          className={`border-b-2  border-black px-6 py-1 text-left
          ${
            buttonStatus.withdraw
              ? "border-b-2 border-orange-800 bg-[#FFF7F7] text-orange-500 shadow-xl shadow-gray-300"
              : "text-gray-900"
          }`}
        >
          Withdraw
        </button>
      </div>
      {/* below buttons */}
      <div className="mx-auto w-[87%] py-1 xl:w-[400px]">
        {buttonStatus.transfer ? (
          <Send />
        ) : buttonStatus.Receive ? (
          <Receive />
        ) : (
          <Withdraw />
        )}
      </div>
    </div>
  );
};

export default Transaction;
