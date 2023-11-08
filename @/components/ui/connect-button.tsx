import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from './button'

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
                  // <button onClick={openConnectModal} type="button" className="connect-last">
                  //   Connect Wallet
                  // </button>
                  <Button
                    onClick={openConnectModal}
                    variant="connect"
                    className="h-10 rounded-xl px-4 py-2 text-md leading-10 font-whitrabt"
                  >
                    Connect Wallet
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  // <button onClick={openChainModal} type="button" className="connect-last">
                  // </button>
                  <Button
                    onClick={openConnectModal}
                    variant="connect"
                    className="h-10 rounded-xl px-4 py-2 text-md leading-10 font-whitrabt"
                  >
                    {/* <Image
                      priority
                      src="/logo/game-logo.png"
                      height={25}
                      width={25}
                      alt="ethereum logo"
                      className="shrink-0 inline mr-1"
                    /> */}
                    Wrong network
                  </Button>
                )
              }

              /* if chain got icon, show icon. if not, just show chain name */
              /* conditional rendering block */

              return (
                <div>
                  {/* <div className="flex gap-x-2">
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

                    {chain.name}
                  </div> */}

                  {/* <button onClick={openAccountModal} type="button" className="connect-last">
                    </button> */}
                  <Button
                    onClick={openConnectModal}
                    variant="connect"
                    className="h-10 rounded-xl px-4 py-2 text-md leading-10 font-whitrabt"
                  >
                    {account.displayName}
                    {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
