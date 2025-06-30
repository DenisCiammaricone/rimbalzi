import { ReactNode } from "react";

export default function TextBlock ({data}: {data: ReactNode}) {
    return (
        <div className="textBlock mx-auto mb-20 my-auto w-1/2">
            {data}
        </div>
    );
}
