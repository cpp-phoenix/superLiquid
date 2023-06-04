import { useParams } from "react-router-dom";
import { useAccount, useNetwork } from 'wagmi'

function Execute () {
    let { chainId } = useParams();
    return (
        <div className="text-3xl text-blue-500 flex bg-white w-full h-5/6 items-center justify-center">
            Coming Soon!!
        </div>
    )
}

export default Execute;