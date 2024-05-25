import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { sepolia, mainnet, polygonZkEvmCardona, scrollSepolia, liskSepolia, avalancheFuji } from 'wagmi/chains'

export const config = createConfig({
    chains: [sepolia, avalancheFuji, polygonZkEvmCardona, scrollSepolia, mainnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // add other chains
        [sepolia.id]: http(),
        [avalancheFuji.id]: http(),
        [polygonZkEvmCardona.id]: http(),
        [scrollSepolia.id]: http(),
        [mainnet.id]: http(),
    },
})
