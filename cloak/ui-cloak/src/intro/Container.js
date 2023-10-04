import React from 'react'
import Header from './Header'
import Description from './Description'
import Footer from './Footer'
import Qna from './Qna'
import VideoTutorial from './VideoTutorial'
import DisclaimerPopup from './DisclaimerPopup'
import { useEffect, useState } from "react";

const Container = () => {

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setOpenModal(true);
  }, []);

  return (
    <div className='bg-[#FFF7F7]'>
      <Header />
      <Description />
      <VideoTutorial/>
      <Qna/>
      <Footer />
      <DisclaimerPopup open={openModal} onClose={() => setOpenModal(false)}>
      <div className="mx-auto my-4 w-48">
        <h3 className="text-lg font-black text-gray-800">working</h3>
        <button onClick={() => setOpenModal(false)}>yes working</button>
      </div>
    </DisclaimerPopup>

    </div>
  )
}

export default Container
