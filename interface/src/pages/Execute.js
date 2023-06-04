import { useParams } from "react-router-dom";
import { useAccount, useNetwork, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ankrChains } from '../constants';
import { useState } from "react";

function Execute () {
    let { chainId } = useParams();
    const {address, isConnected} = useAccount()
    const { chain, chains } = useNetwork()
    const { data, isError, isLoading } = useBalance({
        address:address
    })
    const [inputAmount, setInputAmount] = useState(0);

    if(!isConnected) {
        return (
            <div className='h-5/6 flex items-center justify-center'>
               <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        )
    }

    return (
        <div className="flex w-content h-5/6 items-center justify-center">
            <div className="flex flex-col items-center rounded-[20px] w-6/12 h-5/6 bg-white p-14 px-20 space-y-6">
                <div className="text-3xl font-semibold">{ankrChains[chainId].serviceName.toUpperCase()} Liquid Staking </div>
                <div className="w-full space-y-2">
                    <div className="flex justify-between">
                        <div className="font-bold text-sm">{chain.nativeCurrency.symbol + " Amount"}</div>
                        <div className="text-xs text-gray-400">Your balance: {data?.formatted}</div>
                    </div>
                    <div>
                        <input onChange={(e) => {setInputAmount(e.target.value)}} type="number" className='w-full px-4 py-[18px] rounded-[8px] bg-gray-100 border-slate-300 text-md shadow-sm focux:bg-white focus:outline-none focus:border-2 focus:border-blue-600 focus:ring-1 focus:ring-sky-500' />
                    </div>
                </div>
                <div className="rounded-[10px] flex space-x-6 border border-gray-100 border-2 p-4">
                    <img src={ankrChains[chainId].receiptImage}/> 
                    <div className="text-sm flex space-x-1">
                        <div> <span className="font-semibold">ankr{ankrChains[chainId].serviceName.toUpperCase()}</span> is a reward-bearing token. It accumulates rewards not by growing in number, by by growing in value in relation to {ankrChains[chainId].serviceName.toUpperCase()}. The redemption price of 1 <span className="font-semibold">ankr{ankrChains[chainId].serviceName.toUpperCase()}</span> is now <span className="font-semibold">{ankrChains[chainId].serviceName.toUpperCase()}</span></div> 
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <div className="font-semibold text-sm">You will receive</div>
                    <div className="font-semibold text-md"> 0 ankr{ankrChains[chainId].serviceName.toUpperCase()}</div>
                </div>
                <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-[18px] w-full border py-4">Initiate</button>
                <div className="text-sm text-gray-400">Source chain is <span className="font-semiibold text-black">{chain.name}</span></div>
            </div>
        </div>
    )
}

export default Execute;