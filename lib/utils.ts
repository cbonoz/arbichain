import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Chain } from 'viem'
import { Config } from 'wagmi'
import { ContractMetadata } from './types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const isEmpty = (obj: any) => !obj || obj.length === 0

export const abbreviate = (s: string | undefined, chars?: number) =>
    s ? `${s.substr(0, chars || 6)}**` : ''

export const assertTrue = (condition: boolean, message: string) => {
    if (!condition) {
        throw new Error(message)
    }
}

export const formatCurrency = (amount: number, chain?: Chain) => {
    if (!chain) {
        return `${amount} ETH`
    }
    // decimals
    const decimals = chain.nativeCurrency.decimals
    const symbol = chain.nativeCurrency.symbol
    return `${amount / 10 ** decimals} ${symbol}`
}

export const getExplorerUrl = (
    address?: string,
    chain?: Chain,
    isTx?: boolean
) => {
    const prefix = isTx ? 'tx' : 'address'
    const baseUrl = chain?.blockExplorers?.default?.url
    if (!baseUrl || !address) {
        return ''
    }
    return `${baseUrl}/${prefix}/${address}`
}

export const getPlaceholderDescription = () => {
    // week from now
    const date = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toLocaleDateString()
    return `Sarah and John are neighbors who own condominium units in the same building. Their units are located adjacent to each other, with a shared wall between them. Sarah decided to renovate her condo and hired a contractor to install new plumbing fixtures, including a new shower system. During the renovation process, the contractor accidentally damaged the shared wall, causing water leakage into John's condo. As a result, John's condo sustained water damage to the walls, floors, and furniture, requiring costly repairs.\n\nThis is a dispute resolution case that will be resolved by ${date}. Each party is required to submit evidence and arguments to support their position.`
}

export const transformMetadata = (contractData: ContractMetadata) => {
    contractData.createdAt = Number(contractData.createdAt) * 1000
    contractData.closedAt = Number(contractData.closedAt) * 1000
    return contractData
}

export const formatDate = (
    d: Date | string | number | undefined,
    onlyDate?: boolean
) => {
    if (!(d instanceof Date)) {
        d = d ? new Date(d) : new Date()
    }

    if (onlyDate) {
        return d.toLocaleDateString()
    }
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export const isValidEmail = (email: string) => {
    return email && email.indexOf('@') !== -1
}

export const getNameFromUser = (user: any) => {
    return `${user.firstName} ${user.lastName}`
}

export const caseUrl = (address: string) =>
    `${window.location.origin}/case/${address}`

export const termsUrl = () => `${window.location.origin}/terms`

export const convertCamelToHuman = (str: string) => {
    // Check if likely datetime timestamp ms
    if (str.length === 13) {
        // Check if parseable as a date
        const date = new Date(parseInt(str))
        if (!isNaN(date.getTime())) {
            return formatDate(date)
        }
    }

    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (s) {
            return s.toUpperCase()
        })
        .replace(/_/g, ' ')
}

export function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getIpfsUrl = (cid: string) => {
    return `https://gateway.lighthouse.storage/ipfs/${cid}`
}

export const createLlmPrompt = (
    name: string,
    description: string,
    defendantStatement: string,
    plaintiffStatement: string
) => {
    return `This is a dispute resolution case between two parties called ${name}. ${description}. The defendant has provided the following statement or hasn't responded yet if blank: ${defendantStatement}. The plaintiff has provided the following statement or hasn't responded yet if blank: ${plaintiffStatement}. You have to make a ruling on this case. Who wins and why?`
}
