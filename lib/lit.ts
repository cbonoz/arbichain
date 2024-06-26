import * as LitJsSdk from '@lit-protocol/lit-node-client'
import { checkAndSignAuthMessage } from '@lit-protocol/lit-node-client'
import { getClient } from '@wagmi/core'
import { SUPPORTED_LIT_NETWORKS } from './constants'

const getLitClient = async (): Promise<LitJsSdk.LitNodeClient> => {
    const client = new LitJsSdk.LitNodeClient({
        alertWhenUnauthorized: false,
        litNetwork: 'cayenne',
    })
    await client.connect()
    return client
}

const accessControlConditions: any[] = [
    {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
            comparator: '>=',
            value: '0',
        },
    },
]
// https://developer.litprotocol.com/v2/sdk/explanation/encryption
export class LitClient {
    private litNodeClient: LitJsSdk.LitNodeClient
    private chain: string

    constructor(chainId: number) {
        if (chainId in SUPPORTED_LIT_NETWORKS) {
            const litChainName = SUPPORTED_LIT_NETWORKS[chainId + ""] as string
            this.chain = litChainName
            this.litNodeClient = null as any
        } else {
            throw new Error('Unsupported chain for encrypt/decrypt:' + chainId)
        }
    }

    async connect() {
        const client = await getLitClient()
        this.litNodeClient = client
    }

    async encrypt(message: string) {
        if (!this.litNodeClient) {
            await this.connect()
        }
        const chain = this.chain
        const nonce = await this.litNodeClient.getLatestBlockhash()
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain, nonce })

        const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
            {
                dataToEncrypt: message,
                accessControlConditions,
                chain,
                authSig,
            },
            this.litNodeClient
        )

        return {
            ciphertext,
            dataToEncryptHash,
        }
    }

    async decrypt(ciphertext: any, dataToEncryptHash: string) {
        if (!this.litNodeClient) {
            await this.connect()
        }
        const chain = this.chain

        const nonce = await this.litNodeClient.getLatestBlockhash()
        const authSig = await LitJsSdk.checkAndSignAuthMessage({
            chain,
            nonce,
        })

        const decryptedString = await this.litNodeClient.decrypt({
            ciphertext,
            dataToEncryptHash,
            authSig,
            accessControlConditions,
            chain,
        })

        const { decryptedData } = decryptedString
        return new TextDecoder().decode(decryptedData)
    }
}
