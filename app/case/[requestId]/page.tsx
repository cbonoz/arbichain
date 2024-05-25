'use client'

import { config } from '@/app/config'
import BasicCard from '@/components/basic-card'
import RenderObject from '@/components/render-object'
import { Button } from '@/components/ui/button'
import { ARB_CONTRACT } from '@/lib/contract/metadata'
import { useEthersSigner } from '@/lib/get-signer'
import { ContractMetadata } from '@/lib/types'
import {
    abbreviate,
    formatCurrency,
    formatDate,
    getExplorerUrl,
    getIpfsUrl,
    transformMetadata,
} from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Address, Chain, createPublicClient, http } from 'viem'

import {
    useAccount,
    useChainId,
    useChains,
    useSwitchChain,
    useWriteContract,
} from 'wagmi'

const RESULT_KEYS = [
    'name',
    'description',
    'recipientName',
    'recipientAddress',
    'owner',
    'network',
    'attestationId',
]

interface Params {
    requestId: Address
}

export default function ManageCase({ params }: { params: Params }) {
    const [loading, setLoading] = useState(true)
    const [signLoading, setSignLoading] = useState(false)
    const [data, setData] = useState<ContractMetadata | undefined>()
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const ref = useRef(null)
    const { chains, switchChain } = useSwitchChain()
    const { address } = useAccount()

    const router = useRouter()

    const { requestId } = params

    const chainId = useChainId()
    const currentChain: Chain | undefined = (chains || []).find(
        (c) => c.id === chainId
    )

    const signer = useEthersSigner({ chainId })

    async function fetchData() {
        setLoading(true)
        try {
            const publicClient = createPublicClient({
                chain: currentChain,
                transport: http(),
            })
            let contractData: ContractMetadata = transformMetadata(
                (await publicClient.readContract({
                    abi: ARB_CONTRACT.abi,
                    address: requestId,
                    functionName: 'getMetadata',
                })) as ContractMetadata
            )
            // convert balance and validatedAt to number from bigint
            console.log('contractData', contractData)
            setData(contractData)
        } catch (error) {
            console.log('error reading contract', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    // https://wagmi.sh/react/guides/read-from-contract
    // const { data: balance } = useReadContract({
    //     ...wagmiContractConfig,
    //     functionName: 'balanceOf',
    //     args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
    //   })

    async function closeCase() {
        if (!data) {
            alert('No case found - try another url')
            return
        }

        setSignLoading(true)
        try {

            // const attestation = { attestationId: '1234' }
            // await switchChain({ chainId })

            // const res = await writeContract(config, {
            //     abi: ARB_CONTRACT.abi,
            //     address: requestId,
            //     functionName: 'makeRuling',
            //     args: [attestation.attestationId || ''],
            // })

            console.log('signcase validate')
            await fetchData()
            alert(
                'Case closed! Please wait a few moments for the blockchain to update and refresh the page.'
            )
        } catch (error) {
            console.log('error updating case', error)
            setError(error)
        }
        setSignLoading(false)
    }

    useEffect(() => {
        if (address) {
            fetchData()
        }
    }, [address])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!address) {
        return <div>Please connect your wallet</div>
    }

    const authorized = data && (address === data.plaintiff || address === data.defendant || address === data.judge)
    const invalid = !loading && !data
    const isClosed = Boolean(data?.closedAt)
    const showActioncase = Boolean(authorized && !isClosed)
    const showResult = Boolean(authorized && isClosed)

    const getTitle = () => {
        if (showResult) {
            return (
                <span className="text-green-500">
                    This case is closed!
                </span>
            )
        }
        if (showActioncase) {
            return data?.name || 'Arbitration case'
        }
        return 'Arbitration case'
    }

    const getUserRole = () => {
        if (address === data?.plaintiff) {
            return 'plaintiff'
        }
        if (address === data?.defendant) {
            return 'defendant'
        }
        if (address === data?.judge) {
            return 'judge'
        }
        return 'unknown'
    }

    return (
        // center align
        <div className="flex flex-col items-center justify-center mt-8">
            <BasicCard
                title={getTitle()}
                // description="Find and verify a arbitration case using your wallet."
                className="max-w-[1000px] p-4"
            >
                {invalid && (
                    <div>
                        <p>
                            This contract may not exist or may be on another
                            network, double check your currently connected
                            network
                        </p>
                    </div>
                )}

                {!authorized && (
                    <div>
                        <p>Not authorized to access this case</p>
                    </div>
                )}

                {showResult && (
                    <div>
                        <div className="text-sm text-bold">
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={
                                    getExplorerUrl(requestId, currentChain) ||
                                    ''
                                }
                            >
                                View on {data?.network || 'explorer'}
                            </Link>
                        </div>

                        {/* <div className="text-black-500"> */}
                        <div>
                            This case was closed by{' '}
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={getExplorerUrl(
                                    data?.judge,
                                    currentChain
                                )}
                            >
                                {abbreviate(data?.judge)}
                            </Link>{' '}
                            at {formatDate(data?.closedAt)}
                        </div>

                        {data && (
                            <div className="mt-4">
                                <RenderObject
                                    title="Data"
                                    obj={data}
                                    keys={RESULT_KEYS}
                                />
                            </div>
                        )}
                    </div>
                )}

                {showActioncase && (
                    <div>
                        <div className="text-sm text-bold">
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={
                                    getExplorerUrl(requestId, currentChain) ||
                                    ''
                                }
                            >
                                View on {data?.network || 'explorer'}
                            </Link>
                        </div>

                        {data && (
                            <div className="mt-4">
                                <div className="my-2">
                                    <div className="font-bold text-2xl mb-4 text-black-500">
                                        Hey there
                                    </div>
                                    <div className="mb-2">
                                        You are the {getUserRole()} on this case.
                                    </div>
                                    <hr />
                                    <div className="my-4">
                                        {data.description}
                                    </div>
                                    {data.createdAt && (
                                        <div className="italic">
                                            This case was opened at:&nbsp;
                                            {new Date(
                                                data.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    )}

                                </div>
                                <div className="text-xl font-bold mt-8">
                                    Details
                                </div>
                                <div>
                                    Case owner:&nbsp;
                                    <Link
                                        className="text-blue-500 hover:underline"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        href={getExplorerUrl(
                                            data.owner,
                                            currentChain
                                        )}
                                    >
                                        {abbreviate(data.owner)}
                                    </Link>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={() => {
                                closeCase()
                            }}
                        >
                            {signLoading && (
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Verify request
                        </Button>
                    </div>
                )}

                {result && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Result</h3>
                        <p>{result}</p>
                    </div>
                )}

                {error && <div className="text-red-500">{error.message}</div>}
            </BasicCard>
        </div>
    )
}
