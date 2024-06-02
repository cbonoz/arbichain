import { defineChain } from 'viem'
import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import {
    sepolia,
    mainnet,
    polygonZkEvmCardona,
    scrollSepolia,
    avalancheFuji,
} from 'wagmi/chains'

export const galadrielDevnet = /*#__PURE__*/ defineChain({
    id: 696969,
    name: 'Galadriel Devnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Galadriel Devnet',
        symbol: 'GAL',
    },
    rpcUrls: {
        default: { http: ['https://devnet.galadriel.com'] },
    },
    blockExplorers: {
        default: {
            name: 'Galadriel Explorer',
            url: 'https://explorer.galadriel.com',
            apiUrl: 'https://explorer.galadriel.com/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0x0', // Add the correct address here if available
            blockCreated: 0, // Add the correct block number here if available
        },
    },
    testnet: true, // Change to false if this is not a testnet
})

export const config = createConfig({
    chains: [galadrielDevnet, avalancheFuji, scrollSepolia], //, polygonZkEvmCardona, scrollSepolia, mainnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // add other chains
        [galadrielDevnet.id]: http(),
        [avalancheFuji.id]: http(),
        [scrollSepolia.id]: http(),
        [mainnet.id]: http(),
    },
})
