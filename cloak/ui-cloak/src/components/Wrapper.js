import React, { useEffect,} from 'react'
import Connect from './Connect'
import CloakId from './CloakId'
import Render from './Render'
import { createContext } from 'react'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer'



export const CloakContext = createContext(null)
export const contractAddress = "TFLwjm3o4zwseqbYYzgMuT8oWvWsAU9PFD";




const Wrapper = () => {

    const { tronWeb } = window


    const renderAddress = async () => {
        const address = tronWeb.defaultAddress.base58;
        sessionStorage.setItem('address', address)


    }

    useEffect(() => {

        if (tronWeb) {

            renderAddress()

        }
    }, [])


    if (tronWeb) {

        tronWeb.on('addressChanged', renderAddress)

    }



    async function connectwallet() {
        if (tronWeb) {
            if (!tronWeb.defaultAddress.base58) {
                // TronLink is not connected
                toast.warning("Please open TronLink and connect to the Shasta network");
                return
            }

            window.tronLink.request({ method: "tron_requestAccounts" });
            const address = tronWeb.defaultAddress.base58;
            sessionStorage.setItem('address', address)
            window.location.reload()
        }

    }


    const [error, seterror] = useState('')

    const contextValue = {
        error, seterror, connectwallet
    }


    return (
        <CloakContext.Provider value={contextValue}>
            <div className='bg-[#FFF7F7] min-h-[100vh] max-h-max '>
                <ToastContainer position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light" />
                <Connect />
                <div className=' className="md:w-[95%] max-w-[1160px] mx-auto
                  py-8 p-4"'>  <CloakId />
                    <Render />
                    <Footer />
                </div>
            </div>
        </CloakContext.Provider>
    )
}

export default Wrapper