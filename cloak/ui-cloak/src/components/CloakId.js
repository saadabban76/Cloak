import { Crc } from "../helpers/Crc";
import base58 from "bs58";
import React from "react";
import { useState, useEffect } from "react";
import EllipticCurve from "elliptic";
import { AiOutlineCopy } from "react-icons/ai";
import { downloadFile } from "../helpers/DownloadFile";
import ToolTip from "../helpers/ToopTip";
import { FaFileSignature } from "react-icons/fa";
import { toast } from "react-toastify";
const ec = new EllipticCurve.ec("secp256k1");

const CloakId = () => {
  const [cloakid, setcloakid] = useState("");
  const [, setnote] = useState(false);
  let key;

  const generateCloakId = () => {
    try {
      key = ec.genKeyPair();

      sessionStorage.setItem("DRM key", key.getPrivate().toString(16));

      const spendingkey = ec.keyFromPrivate(
        key.getPrivate().toString(16),
        "hex"
      );


      const data = Uint8Array.from(
        spendingkey.getPublic().encodeCompressed("array")
      );
      console.log(key.getPrivate().toString(16))

      console.log(spendingkey)
      console.log(data)

      const crc = Crc(data);
      const addr = new Uint8Array(data.length + 2);
      addr.set(data);
      addr.set(crc, data.length);
      const id = "T" + base58.encode(addr);
      console.log(base58.encode(addr),id)
      sessionStorage.setItem("cloak address", id);
      setcloakid(id);
    } catch (e) {
      // console.error(e);
    }
  };

  const revealnot = () => {
    setnote(true);
    setTimeout(() => {
      setnote(false);
    }, 7000);
  };

  const oncopy = () => {
    navigator.clipboard.writeText(cloakid);
    toast.success('Copied Sussessfully');
    revealnot();
  };


  const downloadDrm = () => {

    const drmkey = sessionStorage.getItem("DRM key");
    // notyf.success("Copied");
    downloadFile(`DRM Key : ${drmkey} \nCloak address : ${cloakid}`, "DRM key.txt");

  };


  useEffect(() => {
    generateCloakId();
  }, []);

  return (
    <>
      <div
        // style={{ backgroundImage: `url(${bg})` }}
        className="border-gray flex flex-col items-center rounded-md rounded-t-md border bg-[#f7ecec] bg-no-repeat object-scale-down p-8 "
      >
        <div className="flex w-full flex-col items-center space-y-4   pb-6">
          <h1
            className="montserrat-heading mx-auto bg-clip-text
             text-3xl font-[1000]   text-gray-500 sm:text-[2.0rem]
              xl:text-[2.5rem]"
          >
            {" "}
            Do Fortify
            <span
              className="text-[#FF5757] bg-clip-text 
 sm:text-[2.1rem] xl:text-[2.6rem]
            "
            >
              {" "}
              Your Finances
            </span>{" "}
            , Tron Cloak's Way
          </h1>

          {/* {note === true && ( */}
            <p className="montserrat-small text-[0.8rem] font-semibold text-gray-400 sm:text-[1.1rem]">
              Never reveal the ' DRM key ', only
              share your secure ' Cloak address '  for confidential transactions !!
            </p>
          {/* )} */}
        </div>
        {/* tronCloak */}

        <div className="flex space-x-4">
          <div
            className="mx-3 my-2 flex items-center rounded-md bg-[#f5d8d8] bg-opacity-60 p-2 px-2 shadow-gray-300
           hover:shadow-sm sm:mx-0 sm:gap-4 sm:px-3   "
          >
            <p
              className="montserrat-heading text-[0.8rem] font-extrabold text-gray-600 
            sm:text-[1rem] "
            >
              <span className=" montserrat-heading text-md text-[0.9rem] font-extrabold  text-gray-500 sm:text-[1.1rem]">
                # CloakAddress -
              </span>{" "}
              {cloakid}
            </p>
          </div>
          <div className="flex items-center space-x-3 text-white">
            <ToolTip tooltip="Copy cloak Address">
              <AiOutlineCopy
                className="hover:text-highlight cursor-pointer text-2xl font-bold text-gray-700"
                onClick={oncopy}
              />
            </ToolTip>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className="montserrat-subtitle border-1 montserrat-subtitle bg-[#FF5757] my-2 mb-4
         rounded-md border  p-1 px-6  
         text-center font-semibold text-white transition-all ease-linear hover:border"
            onClick={generateCloakId}
          >
            Generate 
          </button>

          <div
            onClick={downloadDrm}
            className="montserrat-subtitle montserrat-subtitle  my-2 mb-4 flex cursor-pointer 
            space-x-2 rounded-md border border-gray-600 p-1   text-[#FF5757]
           px-6 text-center font-semibold  bg-slate-200
      
            "
          >
            <FaFileSignature className="text-2xl font-bold text-[181b1f]" />
            <ToolTip tooltip="Save DRM Key">
              <span>DRM Key</span>
            </ToolTip>
          </div>
        </div>
      </div>

    </>
  );
};

export default CloakId;
