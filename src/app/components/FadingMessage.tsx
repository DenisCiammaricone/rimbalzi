import { useSearchParams } from "next/navigation";
import { createRef } from "react";

export default function FadingMessage( ) {
    const searchParams = useSearchParams();
    const messageBoxRef = createRef<HTMLDivElement>();

    const type = searchParams.get("type");
    const message = searchParams.get("message");

    // TODO: Riscrivere in modo più elegante la gestione del colore del messaggio
    if(type && message) {
        if(type === 'success') {
            return(
                <div id="messageBox" ref={messageBoxRef}>
                    <div className={'absolute left-2 top-2 p-2 w-1/6 rounded opacity-75 flex justify-between bg-green-200 text-green-800 '}>
                    
                        <div>{message}</div>
                        <div onClick={() => { if (messageBoxRef.current) messageBoxRef.current.animate(
                            [
                                { transform: "translateY(0)" },
                                { transform: "translateY(-20vh)" },
                            ], 
                            {
                                duration: 5000,
                                iterations: 1,
                            }).addEventListener('finish', () => { if (messageBoxRef.current) {
                                    messageBoxRef.current.style.display = 'none';
                                } 
                            })
                        }}> 
                            X 
                        </div>
                    </div>
                </div>
            )
        } else if (type === 'error') {
            return(
                <div id="messageBox" ref={messageBoxRef}>
                    <div className={'absolute left-2 top-2 p-2 w-1/6 rounded opacity-75 flex justify-between bg-red-200 text-red-800 '}>
                    
                        <div>{message}</div>
                        <div onClick={() => { if (messageBoxRef.current) messageBoxRef.current.animate(
                            [
                                { transform: "translateY(0)" },
                                { transform: "translateY(-20vh)" },
                            ], 
                            {
                                duration: 5000,
                                iterations: 1,
                            }).addEventListener('finish', () => { if (messageBoxRef.current) {
                                    messageBoxRef.current.style.display = 'none';
                                } 
                            })
                        }}> 
                            X 
                        </div>
                    </div>
                </div>
            )
        }
    } else {
        return(<></>)
    }
    
}
