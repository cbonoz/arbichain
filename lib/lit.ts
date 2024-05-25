import * as LitJsSdk from '@lit-protocol/lit-node-client'
import { ENC_FILE_NAME } from './constants'

let litNodeClient: any
const chain = 'mumbai'

export const initClient = async () => {
    if (!litNodeClient) {
        litNodeClient = new LitJsSdk.LitNodeClient({
            litNetwork: 'cayenne',
        })
        await litNodeClient.connect()
    }
}

// https://developer.litprotocol.com/v3/sdk/access-control/encryption
// https://github.com/LIT-Protocol/lit-js-sdk/blob/main/api_docs.md#encryptfileandzipwithmetadata
export async function encryptAndZipUserFiles(
    files: any[],
    accessControlConditions: any
) {
    await initClient()
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const { ciphertext, dataToEncryptHash } = await LitJsSdk.zipAndEncryptFiles(
        files,
        {
            accessControlConditions,
            authSig,
            chain,
            readme: JSON.stringify({
                name: 'metadata.json',
                description: 'Metadata for upload',
            }),
        },
        litNodeClient
    )

    // Create a new File object with the encrypted data
    // Rename file to data.{ext} with same extension
    // const blob = new Blob([ciphertext], { type: 'application/octet-stream' })
    const data = JSON.stringify({ ciphertext, dataToEncryptHash })
    const encryptedFile = new File([data], ENC_FILE_NAME)

    return {
        encryptedFile,
    }
}

// https://github.com/LIT-Protocol/lit-js-sdk/blob/main/api_docs.md#decryptfileandzipwithmetadata
export async function decryptUserFile(
    ciphertext: string,
    dataToEncryptHash: string,
    accessControlConditions: any
) {
    await initClient()
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
    const decryptedResult = await LitJsSdk.decryptToZip(
        {
            ciphertext,
            dataToEncryptHash,
            accessControlConditions,
            authSig,
            chain,
        },
        litNodeClient
    )
    console.log('dec', decryptedResult)
    return decryptedResult
}
