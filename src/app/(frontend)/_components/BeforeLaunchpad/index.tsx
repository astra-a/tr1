"use client";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sleep } from "ahooks/es/utils/testingHelpers";
import { useRouter } from "next/navigation";

export default function BeforeLaunchpad({
  triggerButtonText,
  buttonIsActive,
}: {
  triggerButtonText: string;
  buttonIsActive: boolean;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("QS2875");

  const {
    data: checked,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["check-code", code],
    queryFn: async (): Promise<boolean> => {
      await sleep(1_000);
      return ["QS2875", "QS2876"].includes(code);
    },
    staleTime: 600_000,
    enabled: false,
  });

  return (
    <>
      <Button
        type="button"
        className={`text-base ${buttonIsActive ? "text-white" : "text-white/60"} hover:text-white cursor-pointer`}
        onClick={() => setIsOpen(true)}
      >
        {triggerButtonText}
      </Button>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => {
          // setIsOpen(false);
        }}
      >
        <DialogBackdrop className="fixed inset-0 backdrop-blur-lg" />
        <div className="fixed inset-0 w-full h-screen flex items-center justify-center z-10 overflow-hidden">
          <DialogPanel
            transition
            className="before-launchpad-dialog w-100 flex flex-col gap-8 px-8 py-8 border-2 border-dark-charcoal rounded-2xl"
          >
            <div className="flex justify-between items-center">
              <DialogTitle as="h3" className="text-xl font-semibold text-white">
                Invitation Code
              </DialogTitle>
              <CloseButton
                className="text-xl text-white/70 hover:text-white transition cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faClose} />
              </CloseButton>
            </div>

            <div className="">
              <input
                type="text"
                placeholder="Enter your invitation code"
                autoFocus={true}
                className="w-full px-3 py-2 bg-eerie-black border border-white/70 rounded-lg text-lg text-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                disabled={!code || isFetching}
                className="btn-main flex justify-center items-center px-6 py-3 rounded-md text-base font-semibold text-jet-black cursor-pointer"
                onClick={() => {
                  refetch?.().then((resp) => {
                    if (resp.data) {
                      setIsOpen(false);
                      router.push(`/launchpad?code=${code}&ts=${Date.now()}`);
                    }
                  });
                }}
              >
                Confirm
              </button>
              <p className="h-[1.5em] text-sm text-red-700">
                {isFetched && !checked ? "Invalid invitation code" : ""}
              </p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
