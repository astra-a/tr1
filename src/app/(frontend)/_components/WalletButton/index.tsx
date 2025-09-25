import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Popover, PopoverButton } from "@headlessui/react";
import WalletPanel from "./WalletPanel";

export default function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="h-full flex items-center gap-2.5"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    type="button"
                    className="btn-mint-green connect-wallet w-48 3xl:w-64 4xl:w-72 h-full flex justify-center items-center gap-2 px-1.5 py-3 border border-white/10 text-sm 3xl:text-base 4xl:text-2xl text-[#051117] cursor-pointer"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    type="button"
                    className="btn-mint-green connect-wallet w-48 3xl:w-64 4xl:w-72 h-full flex justify-center items-center gap-2 px-1.5 py-3 border border-white/10 text-sm 3xl:text-base 4xl:text-2xl text-[#051117] cursor-pointer"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <Popover className="relative h-full">
                  <PopoverButton className="btn-mint-green connect-wallet w-48 3xl:w-64 4xl:w-72 h-full flex justify-center items-center gap-2 px-1.5 py-3 border border-white/10 text-lg 3xl:text-xl 4xl:text-2xl text-[#051117] cursor-pointer">
                    {account.displayName}
                  </PopoverButton>
                  <WalletPanel account={account} chain={chain} />
                </Popover>
              );

              // return (
              //   <button
              //     type="button"
              //     className="btn-mint-green connect-wallet w-48 3xl:w-64 4xl:w-72 h-full flex justify-center items-center gap-2 px-1.5 py-3 border border-white/10 text-sm 3xl:text-base 4xl:text-2xl text-[#051117] cursor-pointer"
              //     onClick={openAccountModal}
              //   >
              //     {account.displayName}
              //   </button>
              // );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
