import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

export default function ConfirmCancelModal({ openButtonText, title, message, onOk, openButtonStyle }: { openButtonText: string, title: string; message: string; onOk: (() => void | Promise<void>), openButtonStyle?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className={openButtonStyle}
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                {openButtonText}
            </button>
            
            <Dialog open={isOpen} className="z-50 " onClose={() => setIsOpen(false)}>
                <div className="fixed flex w-screen modal items-center justify-center p-4">
                <DialogPanel className="w-screen">
                    <DialogTitle className="text-2xl font-bold text-center">{title}</DialogTitle>
                    <p className="text-center">{message}</p>
                    <div className="flex flex-row gap-5 p-5 justify-center">
                        <button className="negative w-32" type="button" onClick={() => setIsOpen(false)}>
                            Annulla
                        </button>
                        <button
                            className="positive w-32"
                            type="button"
                            onClick={() => {
                                onOk();
                                setIsOpen(false);
                            }}
                        >
                            Conferma
                        </button>
                        </div>
                </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
