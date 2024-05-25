import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, polygonZkEvmCardona, scrollSepolia, liskSepolia, avalancheFuji } from 'wagmi/chains'

export const config = createConfig({
    chains: [avalancheFuji, polygonZkEvmCardona, scrollSepolia, mainnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // add other chains
        [avalancheFuji.id]: http(),
        [polygonZkEvmCardona.id]: http(),
        [scrollSepolia.id]: http(),
        [mainnet.id]: http(),
    },
})
