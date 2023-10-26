import React from 'react'

interface WelcomeModalType {
  toggleModal: () => void
}
const WelcomeModal: React.FC<WelcomeModalType> = ({ toggleModal }) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none text-white">
        <div className="relative lg:w-[60rem] w-[90%] my-6 mx-auto">
          <div
            className="border-[2px] border-[#534CFFFF] p-3 rounded-xl flex flex-col gap-5 w-[100%] md:h-auto h-[90vh] md:overflow-auto overflow-y-scroll"
            style={{
              background: 'linear-gradient(155deg, #0D032D 1.46%, rgba(89, 69, 153, 0.00) 105.7%)',
            }}
          >
            <p className="text-center text-[48px]">WELCOME TO LASTMAN</p>
            <p className="text-[24px] text-center">
              LAST MAN is a game of endurance - where players try to outlast each other for magic
              internet money. Check out Guide for how to play, then Game to join the fun.
            </p>
            <p className="text-[24px] text-center">
              Note: You can always preview an action before signing the transaction
            </p>
            <div className="w-[90%] h-[179px] bg-[#040F2C] border-[2px] border-[#00B5FFFF] mx-auto"></div>
            <div className="mt-10 flex flex-col gap-5 mb-5">
              <p className="text-center text-[24px]">Do not show this pop-up again</p>
              <button
                className="flex justify-center items-center py-[12px] px-[40px] gap-[8px] rounded border-[1px] border-[#FF308A] text-[20px] font-light mx-auto"
                onClick={toggleModal}
              >
                Let's Go
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-75 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default WelcomeModal
