import { ReactNode } from "react";

export default function TextBlock ({data}: {data: ReactNode}) {
    return (
        <div className="textBlock mx-auto my-auto w-1/2">
            {data}
        </div>
    );
}
