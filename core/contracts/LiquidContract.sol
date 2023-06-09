// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/NonblockingLzApp.sol";

interface IAnkrProxy {
    function stakeAndClaimCerts() external payable;
}

interface IAnkrToken {
    function ratio() external view returns (uint256);
}

interface IERC20 {
    function allowance(address owner, address spender) external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract LiquidContract is NonblockingLzApp {

    address public ankrPoolContract;
    address public ankrTokenContract;
    address payable public odner;
    mapping(address => uint) receiptTokenMap;

    constructor(address _lzEndpoint, address _ankrPoolContract, address _ankrTokenContract) NonblockingLzApp(_lzEndpoint) {
        ankrPoolContract = _ankrPoolContract;
        ankrTokenContract = _ankrTokenContract;
        odner = payable(msg.sender);
    }

    event SentMessage(uint16 destinationDomain, address recipient, bytes message);
    event ReceivedMessage(uint16 _srcChainId, bytes _srcAddress, bytes message);


    function transferOut() external {
        odner.transfer(address(this).balance);
    }

    function transferOut(address tokenAddress, uint amount) external {
        IERC20(tokenAddress).transfer(odner, amount);
        odner.transfer(address(this).balance);
    }

    // To send message to multichain contract
    function sendMessage(
        uint16 _destinationDomain,
        address _recipient,
        bytes memory _message
    ) private {
        _lzSend(_destinationDomain, _message, payable(msg.sender), address(0x0), bytes(""), msg.value);
        emit SentMessage(_destinationDomain, _recipient, _message);
    }

    function initiateXStaking(uint16 destDomain, address recipient, uint nativeTokenAmount) public payable {
        bytes memory message = abi.encode(nativeTokenAmount, msg.sender);
        sendMessage(destDomain, recipient, message);
    }

    function _initiateBridge(uint nativeTokenAmount, address msgSender) private {
        IAnkrProxy(ankrPoolContract).stakeAndClaimCerts{value: nativeTokenAmount}();
        uint receiptToken = (IAnkrToken(ankrTokenContract).ratio() * nativeTokenAmount / 1000000000000000000) * 98 / 100;
        receiptTokenMap[msgSender] = receiptToken;
    }

    function claimToken() external {
        require(receiptTokenMap[msg.sender] > 0, "No rewards to claim");
        IERC20(ankrTokenContract).transfer(msg.sender, receiptTokenMap[msg.sender]);
    }

    function checkClaims() view external returns (uint) {
        return receiptTokenMap[msg.sender];
    }

    function initiateBridge() external payable {
        _initiateBridge(msg.value, msg.sender);
    }

    // To receive the message from multichain contract
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, 
        bytes memory _message
    ) internal override {
        
        uint nativeTokenAmount;
        address msgSender;

        (nativeTokenAmount, msgSender) = abi.decode(_message,(uint, address));
        _initiateBridge(nativeTokenAmount, msgSender);
        emit ReceivedMessage(_srcChainId, _srcAddress, _message);
    }

    receive() external payable {}
}