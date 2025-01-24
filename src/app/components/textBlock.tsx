import { ReactNode } from "react";

const textBlock = (data: ReactNode) => {
    return (
        <div className="textBlock mx-auto mb-20 my-auto w-1/2">
            {data}
        </div>
    );
}

export default textBlock;