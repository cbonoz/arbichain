import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { mainnet, polygonZkEvmCardona, scrollSepolia, liskSepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [polygonZkEvmCardona, scrollSepolia, mainnet],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
    transports: {
        // add other chains
        [mainnet.id]: http(),
        [polygonZkEvmCardona.id]: http(),
        [scrollSepolia.id]: http(),
    },
})
