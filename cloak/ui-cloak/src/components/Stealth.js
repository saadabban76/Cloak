import { Crc } from "../helpers/Crc";
import base58 from 'bs58';
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import EllipticCurve from 'elliptic';
import { AiOutlineCopy } from "react-icons/ai";
import { CloakContext } from './Cloak';
// import { Tokens } from "../helpers/Token";
const ec = new EllipticCurve.ec('secp256k1');




const Stealth = () => {

  const data = useContext(CloakContext);
  let key;

  const [stealthmeta, setstealthmeta] = useState('')
  const [storedspendingkey, setstoredspendingkey] = useState('')
  const [note, setnote] = useState(false)



  const generatestealthmetaaddress = () => {

    try {

      key = ec.genKeyPair();

      const skey = localStorage.setItem('DontRevealMe', key.getPrivate().toString(16));
      const spendingkey = ec.keyFromPrivate(key.getPrivate().toString(16), 'hex');
      setstoredspendingkey(skey)


      const data = Uint8Array.from(
        spendingkey.getPublic().encodeCompressed('array')
      );

      const crc = Crc(data);
      const addr = new Uint8Array(data.length + 2);
      addr.set(data);
      addr.set(crc, data.length);
      const M = 'T' + base58.encode(addr);
      localStorage.setItem('meta', M);
      setstealthmeta(M);
    }

    catch (e) {
      console.error(e);
      data.seterror(e);
    }

  }

  const downloadFile = (text) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "DontRevealMe.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  const revealnot = () => {
    setnote(true)
    setTimeout(() => {
      setnote(false)

    }, 5000);


  }

  const oncopy = () => {

    navigator.clipboard.writeText(stealthmeta)
    downloadFile(localStorage.getItem('DontRevealMe'))
    revealnot()

  }

  useEffect(() => {
    generatestealthmetaaddress();
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="montserrat-subtitle text-4xl font-semibold">Cloak Address</h1>

      <div className="flex mx-auto space-x-3">
        <h3 className="montserrat-medium font-normal">#tronCloak-
          <span className="montserrat-small font-semibold">{stealthmeta}</span>
        </h3>
        {/* copy key */}
        <AiOutlineCopy
          className="cursor-pointer text-gray-500"
          size={20}
          onClick={oncopy}

        />
      </div>

      {/* generatemetakey */}
      <div>
        <button
          className="montserrat-subtitle border-1 p-1 text-white bg-[#FF5757] hover:shadow-xl px-3 rounded-md hover:bg-[#FDF0EF] hover:text-[#FF5757] font-semibold hover:border-white border-red-500 border"
          onClick={generatestealthmetaaddress}
        >
          Generate
        </button>
      </div>
      {note === true &&
        <div className="flex justify-center text-gray-800 items-center  mr-2 mb-2"> <span className="montserrat-subtitle font-semibold " >⚠ Note :  </span> <p className="montserrat-subtitle font-semibold text-gray-500 "> Never expose the 'DontRevealMe' key .Always Share 'Cloak address' to receive trnsc</p>
        </div>}
    </div>
  )
}

export default Stealth