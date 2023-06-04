import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="bg-white flex items-center justify-between w-full h-24 px-12 border-b border-gray-300">
            <Link className="flex flex-row space-x-4 items-center font-semibold text-3xl" to='/'>
                <img src="https://satellite.money/assets/ui/satellite.logo.svg" />
                <div>SuperLiquid</div>
            </Link>
            <div className="space-x-36">
                <Link className="font-normal hover:font-bold text-md" to='/'>Home</Link>
                <Link className="font-normal hover:font-bold text-md" to='/staking'>Liquid Staking</Link>
                <Link className="font-normal hover:font-bold text-md" to='/earn'>Earn</Link> 
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        </div>
    )
}

export default Navbar;