import React, { useState, useMemo } from "react";
import { Tokens } from "../helpers/Token";
import { base58, keccak256 } from "ethers/lib/utils.js";
import EllipticCurve from "elliptic";
// import { AiOutlineArrowDown } from "react-icons/ai";
// import abi from "../build/contracts/EphKeys.json";
import Tron from "../assets/trx.png";
import loading2 from "../assets/loading2.gif";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { contractAddress } from "./Wrapper";
import { db } from "../config/firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { BiTransfer } from "react-icons/bi";
import { BsChevronDown } from "react-icons/bs";
const ec = new EllipticCurve.ec("secp256k1");

const Send = () => {
  const [token, settoken] = useState("");
  const [StealthmetaAddress, setStealthmetaAddress] = useState("");
  const [error, seterror] = useState("");
  const [amount, setamount] = useState("");
  const [show, setshow] = useState(false);
  const [bydefault, setbydefault] = useState("TRX");
  const [bydefaultimg, setbydefaultimg] = useState(Tron);
  const [trxid, settrxid] = useState("");
  const [running, setrunning] = useState(false);
  const [toggleInput, settoggleInput] = useState(false);
  const [buttonInput, setButtonInput] = useState("Transfer");
  //helpers

  const { tronWeb } = window;

  var r;
  var s;
  var a;

  const msgSender = sessionStorage.getItem("address");

  let receipent;

  const tronLink = useMemo(() => {
    if (window.tronLink) {
      return window.tronLink;
    }
    return {};
  }, []);

  //middleware functions

  const handleChange = (e) => {
    const value = e.target.value;

    setamount(value.replace(/[^0-9.]/g, ""));
  };

  const handlecloakaddress = (e) => {
    if (
      (e.target.value[0] !== "T" && e.target.value !== "") ||
      e.target.value.length > 48 ||
      e.target.value.length < 47
    ) {
      seterror("Invalid address");
      setTimeout(() => {
        seterror("");
      }, 4000);
    }

    setStealthmetaAddress(e.target.value);
  };

  const handletronweb = () => {
    if (tronLink) {
      toast("Please install Tron wallet");
      return;
    }
  };

  const changedefault = (t) => {
    setshow(!show);
    setbydefault(t.name);
    settoken(t.address);
    setbydefaultimg(t.symbol);
    if (t.name === "NFTS") {
      settoggleInput(true);
    } else {
      settoggleInput(false);
    }
  };

  const validation = () => {
    if (StealthmetaAddress === "" || amount === "") {
      seterror("Please enter the address and amount");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }
  };

  const fetchContract = async () => {
    //checking is tronweb connected
    if (!tronWeb) {
      toast.error("Please install Tron wallet");
      return;
    }
    //validating the inputs
    if (StealthmetaAddress === "" || amount === "") {
      seterror("Please enter the address and amount");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }

    //BigInt(value) / BigInt(10 ** 18)
    const instance = await tronWeb.contract().at(token);
    const result = await instance.balanceOf(msgSender).call();
    console.log("balance", result.toNumber(), amount);

    if (amount > result.toNumber()) {
      seterror("Not efficient funds for the transaction");
      toast.error("Not effecicient funds for the transaction");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    } else {
      approve();
    }
  };

  const checkOwner = async () => {
    if (!tronWeb) {
      toast.error("Please install Tron wallet");
      return;
    }
    //validating the inputs
    if (StealthmetaAddress === "" || amount === "") {
      seterror("Please enter the address and amount");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    }

    let result;
    try {
      const instance = await tronWeb.contract().at(token);
      result = await instance.ownerOf(amount).call();
      console.log("res", tronWeb.address.fromHex(result));
    } catch (e) {
      seterror(e.mesage);
    }

    if (tronWeb.address.fromHex(result) !== msgSender) {
      console.log(tronWeb.address.fromHex(result));
      seterror("You are not the owner of this nft");
      toast.error("You are not the owner of this nft");
      setTimeout(() => {
        seterror("");
      }, 4000);
      return;
    } else {
      approve();
    }
  };

  const initializer = () => {
    var meta;
    var ephPublic;

    const ephKey = ec.genKeyPair();
    ephPublic = ephKey.getPublic();

    try {
      if (StealthmetaAddress.startsWith("T")) {
        const _StealthmetaAddress = StealthmetaAddress.slice(1);
        let decodedID = base58.decode(_StealthmetaAddress);
        const metaAddress = decodedID.subarray(0, 33);
        meta = ec.keyFromPublic(metaAddress, "hex");
      } else {
        seterror("Plz paste the valid address");
      }
    } catch (e) {
      seterror(e.message);
    }

    try {
      const sharedsecret = ephKey.derive(meta.getPublic());
      const hashed = ec.keyFromPrivate(keccak256(sharedsecret.toArray()));
      const publicKey = meta
        .getPublic()
        .add(hashed.getPublic())
        .encode("array", false)
        .splice(1);

      const address = keccak256(publicKey);
      const _HexString = address.substring(address.length - 40, address.length);
      const _Hex = "41" + _HexString;
      receipent = tronWeb.address.fromHex(_Hex);
      // console.log(receipent);

      r = "0x" + ephPublic.getX().toString(16, 64);
      s = "0x" + ephPublic.getY().toString(16, 64);
      a =
        "0x" +
        sharedsecret.toArray()[0].toString(16).padStart(2, "0") +
        sharedsecret.toArray()[31].toString(16);
    } catch (e) {
      console.log("error", e);
    }

    return true;
  };

  const pubkeys = collection(db, "pubKeys");

  const storing = async () => {
    const stored = `T${a.replace("0x", "")}04${r.slice(2)}${s.slice(2)}`;
    // console.log(stored)
    try {
      await addDoc(pubkeys, {
        keys: stored,
      });
    } catch (err) {
      console.error(err);
    }
    console.log("storing...");
  };

  const sendTrx = async () => {
  //   //checking is tronweb connected
  //   if (!tronWeb) {
  //     toast.error("Please install Tron wallet");
  //     return;
  //   }
  //   //validating the inputs
  //   if (StealthmetaAddress === "" || amount === "") {
  //     seterror("Please enter the address and amount");
  //     setTimeout(() => {
  //       seterror("");
  //     }, 4000);
  //     return;
  //   }

  //   setrunning(true);

  //   //calculating stealth address
  //   initializer();

  //   //putting ephkeys to firebase

  //   try {
  //     const contract = await tronWeb.contract(abi.abi, contractAddress);
  //     const trx = await contract
  //       .sendTron(r, s, a, receipent)
  //       .send({ callValue: tronWeb.toSun(amount) });
  //     // console.log("tron");
  //     let txId = await tronWeb.trx.getTransaction(trx);
  //     settrxid("https://shasta.tronscan.org/#/transaction/" + txId.txID);
  //     // console.log("https://shasta.tronscan.org/#/transaction/" + txId.txID)
  //   } catch (err) {
  //     seterror(err);
  //   }
  //   storing();
  //   setrunning(false);
  };

  const sendTrc20 = async () => {
    // setrunning(true);

    // //calculating stealth address
    // initializer();

    // try {
    //   const contract = await tronWeb.contract(abi.abi, contractAddress);
    //   const trx = await contract
    //     .sendTrc20(r, s, a, token, receipent, amount)
    //     .send();
    //   // console.log('trc20')
    //   let txId = await tronWeb.trx.getTransaction(trx);
    //   // console.log("https://shasta.tronscan.org/#/transaction/" + txId.txID);
    //   settrxid("https://shasta.tronscan.org/#/transaction/" + txId.txID);
    // } catch (e) {
    //   seterror(e.message);
    // }
    // storing();
    // setrunning(false);
  };

  const sendTrc721 = async () => {
    // setrunning(true);

    // //calculating stealth address
    // initializer();

    // try {
    //   const contract = await tronWeb.contract(abi.abi, contractAddress);
    //   const trx = await contract
    //     .sendTrc721(r, s, a, token, receipent, amount)
    //     .send();
    //   // console.log("trc721");
    //   let txId = await tronWeb.trx.getTransaction(trx);
    //   console.log("https://shasta.tronscan.org/#/transaction/" + txId.txID);
    //   settrxid("https://shasta.tronscan.org/#/transaction/" + txId.txID);
    // } catch (e) {
    //   seterror(e.message);
    // }
    // storing();
    // setrunning(false);
  };

  async function approve() {
    let contract;

    try {
      contract = await tronWeb.contract().at(token);
    } catch (e) {
      seterror(e.message);
    }

    let allowance;

    if (toggleInput === true) {
      try {
        const getapproved = await contract.getApproved(amount).call();
        console.log(tronWeb.address.fromHex(getapproved));
        if (tronWeb.address.fromHex(getapproved) !== contractAddress) {
          try {
            await contract.approve(contractAddress, amount).send();
            console.log("approve done");
            setButtonInput("approving...");
            let txId = await tronWeb.trx.getTransaction(approve);
            console.log(
              "https://shasta.tronscan.org/#/transaction/" + txId.txID
            );
            setButtonInput("Transfer");
            sendTrc721();
          } catch (err) {
            seterror(err.message);
          }
        } else {
          console.log("else done");
          sendTrc721();
        }
      } catch (e) {
        seterror(e.message);
      }
    } else {
      try {
        allowance = await contract.allowance(msgSender, contractAddress).call();
        // console.log("allowance", allowance.toNumber());
      } catch (e) {
        seterror(e.message);
      }
      if (amount > allowance.toNumber()) {
        try {
          const approve = await contract
            .approve(contractAddress, amount)
            .send();
          console.log("approve done");
          setButtonInput("approving...");
          let txId = await tronWeb.trx.getTransaction(approve);
          console.log("https://shasta.tronscan.org/#/transaction/" + txId.txID);
          setButtonInput("Transfer");
          sendTrc20();
        } catch (e) {
          seterror(e.message);
        }
      } else {
        console.log("else done");
        sendTrc20();
      }
    }
  }

  const opentab = () => {
    if (trxid !== "") {
      window.open(trxid, "_blank");
    }
  };

  setTimeout(() => {
    seterror(" ");
  }, 6000);

  return (
    <div className="flex flex-col items-start justify-center space-y-2">
      {/* <div className=" mt-4 flex flex-col items-center space-y-6 "> */}
      {/* cloak key input */}
      <div
        className="text-bgGray w-[100%] rounded-md 
       "
      >
        <input
          className="montserrat-subtitle my-4 h-[100%] w-[100%]  rounded-md
          border-2 border-gray-500 bg-[#f5f5f5] px-3 py-3 text-[0.9rem]
           font-semibold text-gray-400 outline-none placeholder:text-gray-500 hover:border-cyan-900"
          type="text"
          value={StealthmetaAddress}
          onChange={handlecloakaddress}
          placeholder=" Receipent's Cloak address"
        />
      </div>
      {/* Nft Token Container */}
      {toggleInput && (
        <div
          className="border-1 flex w-[100%] items-center
                  space-x-2 rounded-md border border-gray-300 bg-[#ffffff] 
                    px-3 py-2 hover:shadow-sm"
        >
          <input
            className="montserrat-subtitle  border-1 w-[100%] rounded-md
               px-2 font-semibold text-gray-600 outline-none"
            type="text"
            onChange={(e) => settoken(e.target.value)}
            placeholder=" Nft token address"
          />
        </div>
      )}
      {/* Amount */}
      <div className="text-bgGray w-[100%] rounded-md pb-4">
        {/* <h2 className="text-[1.3rem] text-left mb-1">Amount </h2> */}
        <div
          className="relative flex w-[100%]  items-center rounded-md py-1 hover:shadow-sm         
       "
        >
          <input
            className="montserrat-subtitle h-[100%] w-[100%]  rounded-md
          border-2 border-gray-500 bg-[#f5f5f5] px-3 py-3 text-[0.9rem]
          font-semibold text-gray-400 outline-none placeholder:text-gray-500 hover:border-cyan-900"
            value={amount}
            type="text"
            placeholder="0.1"
            onChange={handleChange}
          />
          {/* Tokens Dropdown Menu */}
          <div className="absolute right-1 min-w-[95px] ">
            <ul onClick={() => setshow(!show)}>
              <li
                className="flex cursor-pointer items-center gap-2 rounded-md 
 border-l border-gray-700 p-2
            px-3 font-semibold text-[#FF5757]"
              >
                <p>{bydefault}</p>
                <BsChevronDown size={18} />
              </li>
              <div
                className={`
              ${
                show &&
                `scrollbar-thumb-bgGray scrollbar-rounded-full scrollbar-thumb-gray-00 absolute mt-2 flex max-h-28 w-[105%] flex-col overflow-y-scroll rounded-b-md bg-white
                py-1 shadow-md transition-all ease-in scrollbar-thin scrollbar-thumb-[#FF5757]
               scrollbar-track-[#ebe1db] scrollbar-thumb-rounded`
              }
            `}
              >
                {show &&
                  Tokens.map((c) => (
                    <div className="h-40 border-b border-gray-400 ">
                      <li
                        className="montserrat-small flex cursor-pointer flex-row-reverse items-center
                    justify-between gap-2 border-l border-gray-100 
                    p-1 px-3 text-[0.8rem] font-semibold 
                    text-gray-900 hover:bg-[#dbe6eb]
                    hover:text-gray-900"
                        key={c.name}
                        onClick={() => changedefault(c)}
                      >
                        <img
                          className=" rounded-lg"
                          src={c.symbol}
                          alt=""
                          height={14}
                          width={18}
                        />
                        <p>{c.name}</p>
                      </li>
                    </div>
                  ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
      {/* send button */}
      <div className="mr-4 flex w-full justify-center">
        <button
          onClick={
            token === ""
              ? sendTrx
              : toggleInput === true
              ? checkOwner
              : fetchContract
          }
          className="montserrat-subtitle border-1 montserrat-subtitle  bg-[#FF5757] mx-auto my-2
           mb-4 flex w-[100%] justify-center  
          space-x-2 rounded-md border  px-6 py-2 text-center 
          font-bold text-white transition-all ease-linear hover:shadow-xl"
        >
          {running === false ? (
            <>
              <BiTransfer className="text-[1.3rem] text-inherit" />
              <span>Transfer</span>
            </>
          ) : (
            <img height={30} width={30} src={loading2} alt="" />
          )}
        </button>
      </div>
      <p
        onClick={opentab}
        className="montserrat-subtitle  decoration-bgGray cursor-pointer font-semibold text-gray-900 underline underline-offset-8"
      >
        {trxid !== "" ? trxid.slice(8, 58) : ""}
      </p>
      <p className="montserrat-subtitle mx-auto flex items-center font-semibold text-[#FF5757]">
        {error}
      </p>
    </div>
  );
};

export default Send;
