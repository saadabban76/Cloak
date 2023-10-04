import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/IntroLogo.png";
import { Link } from "react-scroll";
import mainss from "../assets/mainss.png";
import Banner from "./Banner";
import TokensSlide from "./TokensSlide";

const Header = () => {
  const Valid = () => {
    // if(!window.tronWeb){
    //   alert('Please Install Tron Wallet')
    //   return
    // }
    navigate("/cloak");
  };

  const navigate = useNavigate();
  return (
    <div className="bg-[#FF5757] p-4 px-7">
      <div className="border-b-1 flex items-center justify-between border-b border-[#FDF0EF] px-5 pb-3">
        {/* logo on the left side */}
        <div className="flex items-center">
          <img className="w-16 font-bold sm:w-20" src={logo} alt="" />
          <h1 className="montserrat-subtitle text-[1.2rem] font-semibold text-[#FDF0EF] sm:text-[1.5rem]">
            Cloak
          </h1>
        </div>
        {/* "how it works" on the right side*/}
        <Link to="faq" spy={true} smooth={true} offset={50}>
          <h4
            className="montserrat-subtitle cursor-pointer font-semibold text-[#FDF0EF]  hover:font-bold hover:text-white sm:text-[1.2rem] "
            onClick={() => navigate("/")}
          >
            FAQ?
          </h4>
        </Link>
      </div>
      {/* at the bottom of the logo */}
      <div
        className="md:px-22 flex flex-col items-center justify-between space-y-1
        px-3 py-10 text-gray-700 sm:px-5 sm:py-16 md:flex-row xl:px-52"
      >
        {/* left side */}
        <div className="flex flex-col items-start space-y-4">
          <h2
            className="montserrat-header text-left text-[1.6rem] font-bold 
          text-[#FDF0EF] sm:text-[2.2rem] xl:text-[3.2rem]"
          >
            Stay Anonymous & secure.
          </h2>
          <p
            className="montserrat-small max-w-[400px] break-words
           text-left text-[1.0rem] text-[#FDF0EF] xl:max-w-[480px] xl:text-[1.3rem]"
          >
            Receive TRX and tokens with utmost privacy, your address remains 
            hidden!.
          </p>
          <div className="pt-1">
            <button
              className="border-1 montserrat-subheading  rounded-full border border-red-500 bg-[#FDF0EF] p-2 px-4 text-lg font-semibold text-[#FF5757] hover:border-white hover:bg-[#FF5757] hover:text-white hover:shadow-xl"
              onClick={Valid}
            >
              Launch app
            </button>
          </div>
        </div>
        {/* right image */}
        <div className="flex items-center justify-end ">
          <img
            className="sm:[mt-0] mt-10 h-[250px] rounded-[1.5rem] object-center shadow-2xl
        shadow-[#5e5e5e] md:mt-0 md:w-[480px] lg:h-[246px]
        xl:h-[290px] xl:w-[520px]"
            src={mainss}
            // height={1000}
            alt=""
          />
        </div>
      </div>
      <Banner />
      <TokensSlide />
    </div>
  );
};

export default Header;