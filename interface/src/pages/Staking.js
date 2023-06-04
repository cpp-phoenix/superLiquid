import { useAccount, useNetwork } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { ankrChains } from '../constants';
import { Link } from "react-router-dom";

function Staking () {

    const {isConnected} = useAccount()
    const { chain, chains } = useNetwork()
    const [metrics, setMetrics] = useState(new Map())

    useEffect(() => {
        if(isConnected) {
            fetch("https://api.staking.ankr.com/v1alpha/metrics")
            .then(response => {
                return response.json()
            })
            .then(data => {
                let metricsData = new Map()
                data.services.map(metric => {
                    metricsData.set(metric.serviceName, metric)
                })
                console.log(metricsData.has("bnb"))
                console.log(metricsData)
                setMetrics(metricsData) 

            })
        }
    }, [isConnected])

    if(!isConnected) {
        return (
            <div className='h-5/6 flex items-center justify-center'>
               <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        )
    }

    const ChainObject = ({chainObj}) => {
        const ankrChain = ankrChains[chainObj.id]
        return (
            <div className='drop-shadow-xs rounded-[20px] w-full h-[280px] bg-white p-8' key={ankrChain.serviceName}>
                <div className='flex flex-col items-start justify-center w-content h-full space-y-4'>
                    <img src={ankrChain.image} className="w-16 h-16" />
                    <p className='font-semibold text-2xl'>{chainObj.name}</p>
                    <div className='space-y-4'>
                        <div className='flex space-x-10'>
                            <div>
                                <p className='text-sm text-gray-400'>APY</p>
                                <div className='font-semibold'>{metrics.has(ankrChain.serviceName) ? Number(metrics.get(ankrChain.serviceName).apy).toFixed(2) + "%" : "-"}</div>
                            </div>
                            <div>
                                <p className='text-sm text-gray-400'>Staked (TVL)</p>
                                <div className='font-semibold'>{metrics.has(ankrChain.serviceName) > 0 ? "$ " + Number(metrics.get(ankrChain.serviceName).totalStakedUsd).toFixed(0): "-"}</div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <Link to={`/staking/${chainObj.id}`} className='rounded-lg bg-blue-600 text-white px-12 py-[12px]'>Stake</Link>
                    </div>
                </div>
            </div>
            
        )
    }

    return (
        <div className="flex justify-center items-center w-full h-5/6">
            <div className='grid grid-cols-3 w-full gap-8 mx-24'>
                {chains.filter(chainObj => {
                    return ankrChains[chainObj.id] !== undefined
                }).map(chainObj => {
                    return (
                        <ChainObject chainObj={chainObj}/>
                    )
                })}
             </div>
        </div>
    )
}

export default Staking;