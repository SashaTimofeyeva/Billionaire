require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
    solidity: "0.8.20",
    networks: {
        scrollMainnet: {
            url: "https://rpc.scroll.io",
            accounts: [`0x${process.env.PRIVATE_KEY}`]
        }
    },
    etherscan: {
        apiKey: {
            scrollMainnet: process.env.SCROLLSCAN_API_KEY,
        },
        customChains: [
            {
                network: "scrollMainnet",
                chainId: 534352,
                urls: {
                    apiURL: "https://api.scrollscan.com/api",
                    browserURL: "https://scrollscan.com"
                }
            }
        ]
    }
};
