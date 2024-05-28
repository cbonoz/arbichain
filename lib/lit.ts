import * as LitJsSdk from '@lit-protocol/lit-node-client'

// https://developer.litprotocol.com/v2/LitActions/additionalExamples/usingEIP

import fs from 'fs'
import { serialize, recoverAddress } from '@ethersproject/transactions'
import {
    hexlify,
    splitSignature,
    hexZeroPad,
    joinSignature,
} from '@ethersproject/bytes'
import { recoverPublicKey, computePublicKey } from '@ethersproject/signing-key'

// you need an AuthSig to auth with the nodes
// normally you would obtain an AuthSig by calling LitJsSdk.checkAndSignAuthMessage({chain})

// this code will be run on the node
const litActionCode: any = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });
};

go();
`

export const signMessage = async (address: string, message: string) => {
    const litNodeClient = new LitJsSdk.LitNodeClient({
        alertWhenUnauthorized: false,
        minNodeCount: 6,
        debug: true,
        litNetwork: 'serrano',
    })

    const authSig = {
        sig: '0x2bdede6164f56a601fc17a8a78327d28b54e87cf3fa20373fca1d73b804566736d76efe2dd79a4627870a50e66e1a9050ca333b6f98d9415d8bca424980611ca1c',
        derivedVia: 'web3.eth.personal.sign',
        signedMessage: message,
        address,
    }

    await litNodeClient.connect()
    const results = await litNodeClient.executeJs({
        code: litActionCode,
        authSig,
        jsParams: {},
    })
    console.log('results', results)
    const { signatures, response } = results
    console.log('response', response)
    const sig = signatures.sig1
    const { dataSigned } = sig
    const encodedSig = joinSignature({
        r: '0x' + sig.r,
        s: '0x' + sig.s,
        v: sig.recid,
    })

    const { txParams } = response as any

    console.log('encodedSig', encodedSig)
    console.log('sig length in bytes: ', encodedSig.substring(2).length / 2)
    console.log('dataSigned', dataSigned)
    const splitSig = splitSignature(encodedSig)
    console.log('splitSig', splitSig)

    const recoveredPubkey = recoverPublicKey(dataSigned, encodedSig)
    console.log('uncompressed recoveredPubkey', recoveredPubkey)
    const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true)
    console.log('compressed recoveredPubkey', compressedRecoveredPubkey)
    const recoveredAddress = recoverAddress(dataSigned, encodedSig)
    console.log('recoveredAddress', recoveredAddress)

    // const txParams = {
    //   nonce: "0x0",
    //   gasPrice: "0x2e90edd000", // 200 gwei
    //   gasLimit: "0x" + (30000).toString(16), // 30k gas limit should be enough.  only need 21k to send.
    //   to: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
    //   value: "0x" + (10000).toString(16),
    //   chainId,
    // };

    const txn = serialize(txParams, encodedSig)

    console.log('txn', txn)
    return { txn, response }
}
