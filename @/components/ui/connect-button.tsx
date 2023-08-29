import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export default function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        // authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted
        //  && authenticationStatus !== 'loading'
        const connected = ready && account && chain
        // && (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className={`connect-btn-last`}>
                    Connect Wallet
                  </button>
                )
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={`h-10 w-max rounded-xl
                    bg-gradient-to-r from-sky-300 to-indigo-500
                    py-[4px] px-[20px]
                    text-base font-semibold text-rose-900 uppercase
                    transition-colors
                    hover:bg-accent hover:text-indigo-900
                    focus:bg-accent focus:text-indigo-900 focus:outline-blue-500
                    `}
                  >
                    <Image
                      priority
                      src="/logo/game-logo.png"
                      height={25}
                      width={25}
                      alt="ethereum logo"
                      className="shrink-0 inline mr-1"
                    />
                    Wrong network
                  </button>
                )
              }

              /* if chain got icon, show icon. if not, just show chain name */
              /* conditional rendering block */

              return (
                <div
                  className="
                  h-10 w-max flex gap-x-2 items-center text-sm
                  "
                >
                  <div className="flex gap-x-2">
                    {chain.hasIcon && (
                      <div
                        onClick={openChainModal}
                        role="presentation"
                        className="cursor-pointer"
                        style={{
                          background: chain.iconBackground,
                          width: 25,
                          height: 25,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 25, height: 25 }}
                          />
                        )}
                      </div>
                    )}

                    {/* {chain.name} */}
                  </div>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="
                    rounded-full bg-slate-300 text-base
                    bg-gradient-to-r from-sky-300 to-indigo-500
                    text-white px-3 py-1
                    "
                  >
                    {account.displayName} {account.displayBalance}
                    {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
