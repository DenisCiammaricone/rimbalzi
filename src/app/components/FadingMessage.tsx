import { createRef } from "react";

export default function FadingMessage( {type, message}: {type: string, message: string} ) {
    const messageBoxRef = createRef<HTMLDivElement>();
    let color;
    if(type === 'success') { 
        color='green'
    } else if (type === 'error') {
        color='red'
    }

    return (
        <div id="messageBox" ref={messageBoxRef}>
            <div className={'absolute left-2 top-2 p-2 w-1/6 rounded opacity-75 flex justify-between bg-'+ color +'-200 text-'+ color +'-800 '}>
            
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
