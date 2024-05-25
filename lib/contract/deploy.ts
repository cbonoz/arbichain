import { ARB_CONTRACT } from './metadata'
import { formatDate } from '../utils'
import { ethers } from 'ethers'
import { Ruling } from '../types'

const ethToWei = (amount: any) => {
    return ethers.parseEther(amount + '')
}

export async function deployContract(
    signer: any,
    title: string,
    description: string,
    plaintiff: string,
    defendant: string,
    judge: string,
    network: string
) {
    // Deploy contract with ethers
    const factory = new ethers.ContractFactory(
        ARB_CONTRACT.abi,
        ARB_CONTRACT.bytecode,
        signer
    )

    // const balance = ethToWei(wei)
    // console.log('balance', balance, wei)

    let contract: any = await factory.deploy(
        title,
        description,
        network,
        plaintiff,
        defendant,
        judge,
    )
    // log
    console.log(
        'Deploying contract...',
        title,
        description,
        network,
        plaintiff,
        defendant,
        judge
    )

    contract = await contract.waitForDeployment()
    console.log('deployed contract...', contract.target)
    return contract.target
}

export const getMetadata = async (signer: any, address: string) => {
    const contract = new ethers.Contract(address, ARB_CONTRACT.abi, signer)
    const result = await (contract.getMetadata as any).call()
    console.log('result', result)
    return {
        name: result[0],
        description: result[1],
        versionCount: result[2].toNumber(),
        createdAt: formatDate(result[3].toNumber() * 1000),
        owner: result[4],
    }
}

export const makeRuling = async (signer: any, address: string, ruling: Ruling) => {
    const contract = new ethers.Contract(address, ARB_CONTRACT.abi, signer)
    const result = await contract.makeRuling(ruling, 0)
    console.log('result', result)
    return result;
}


export const submitEvidence = async (signer: any, address: string, evidence: string) => {
    const contract = new ethers.Contract(address, ARB_CONTRACT.abi, signer)
    const result = await contract.submitEvidence(evidence)
    console.log('result', result)
    return result;
}