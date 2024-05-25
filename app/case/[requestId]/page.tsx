'use client'

import { config } from '@/app/config'
import BasicCard from '@/components/basic-card'
import { RenderEvidence } from '@/components/render-evidence'
import RenderObject from '@/components/render-object'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ARB_CONTRACT } from '@/lib/contract/metadata'
import { useEthersSigner } from '@/lib/get-signer'
import { ContractMetadata, Ruling } from '@/lib/types'
import {
    abbreviate,
    formatCurrency,
    formatDate,
    getExplorerUrl,
    getIpfsUrl,
    transformMetadata,
} from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import { writeContract } from '@wagmi/core'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Address, Chain, createPublicClient, http } from 'viem'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
    useAccount,
    useChainId,
    useChains,
    useSwitchChain,
    useWriteContract,
} from 'wagmi'
import { Separator } from '@radix-ui/react-select'

interface Params {
    requestId: Address
}

export default function ManageCase({ params }: { params: Params }) {
    const [loading, setLoading] = useState(true)
    const [caseLoading, setCaseLoading] = useState(false)
    const [data, setData] = useState<ContractMetadata | undefined>()
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const [statement, setStatement] = useState('')
    const [ruling, setRuling] = useState<Ruling>(Ruling.DefendantWins)
    const [file, setFile] = useState<File | null>(null)
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

            if (contractData.judge === address) {
                await getRecommendation()
            }
        } catch (error) {
            console.log('error reading contract', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    async function getRecommendation() {
        // setRecommendation('Defendant should win')
    }

    async function provideEvidence() {
        if (!statement) {
            throw new Error('Please provide a statement')
        }

        setCaseLoading(true)
        try {
            // const attestation = { attestationId: '1234' }
            // await switchChain({ chainId })
            let cid = ''
            // upload

            const res = await writeContract(config, {
                abi: ARB_CONTRACT.abi,
                address: requestId,
                functionName: 'submitEvidence',
                args: [statement, cid],
            })

            console.log('submit evidence')
            await fetchData()
            alert(
                'Evidence submitted! Please wait a few moments for the blockchain to update and refresh the page.'
            )
        } catch (error) {
            console.log('error updating case', error)
            setError(error)
        } finally {
            setCaseLoading(false)
        }
    }

    async function closeCase() {
        if (!data) {
            alert('No case found - try another url')
            return
        }

        setCaseLoading(true)
        try {
            // const attestation = { attestationId: '1234' }
            // await switchChain({ chainId })

            // TODO: make variable

            const res = await writeContract(config, {
                abi: ARB_CONTRACT.abi,
                address: requestId,
                functionName: 'makeRuling',
                args: [ruling, 0],
            })

            console.log('signcase validate')
            await fetchData()
            alert(
                'Case closed! Please wait a few moments for the blockchain to update and refresh the page.'
            )
        } catch (error) {
            console.log('error updating case', error)
            setError(error)
        } finally {
            setCaseLoading(false)
        }
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

    const isPlaintiff = address === data?.plaintiff.user
    const isDefendant = address === data?.defendant.user
    const isJudge = address === data?.judge

    const authorized = isPlaintiff || isDefendant || isJudge
    const invalid = !loading && !data
    const isClosed = Boolean(data?.closedAt)
    const showActioncase = Boolean(authorized && !isClosed)
    const plaintiffSubmitted = data?.plaintiff.statement
    const defendantSubmitted = data?.defendant.statement
    const evidenceSubmitted =
        (isPlaintiff && plaintiffSubmitted) ||
        (isDefendant && defendantSubmitted)
    const allFeedbackSubmitted = plaintiffSubmitted && defendantSubmitted

    const getTitle = () => {
        if (isClosed) {
            return <span className="text-green-500">This case is closed!</span>
        }
        if (showActioncase) {
            return data?.name || 'Arbitration case'
        }
        return 'Arbitration case'
    }

    const getUserRole = () => {
        if (address === data?.plaintiff.user) {
            return 'plaintiff'
        }
        if (address === data?.defendant.user) {
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

                {(!authorized && !isClosed) && (
                    <div>
                        <p>Not authorized to access this case</p>
                    </div>
                )}

                {isClosed && (
                    <div>
                        {/* Ruling */}
                        {data && <div className="text-xl my-2">{Ruling[data.ruling]}</div>}

                        <Separator/>

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

                        <div className="case-summary">
                            <div className="text-2xl font-bold">
                                {data?.name}
                            </div>
                            <div className="mb-4">{data?.description}</div>
                            Evidence
                            <div className="my-1">
                                <RenderEvidence
                                    user="Plaintiff"
                                    data={data?.plaintiff}
                                />
                            </div>
                            <div className="my-1">
                                <RenderEvidence
                                    user="Defendant"
                                    data={data?.defendant}
                                />
                            </div>
                            <div>
                                <Label>Judge</Label>
                                <div>
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
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <Label>Compensation</Label>
                                <div>
                                    {formatCurrency(data?.compensation || 0)}
                                </div>
                            </div>
                        </div>

                        {/* <div className="text-black-500"> */}
                        <div>
                            This case was closed by{' '}
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={getExplorerUrl(data?.judge, currentChain)}
                            >
                                {abbreviate(data?.judge)}
                            </Link>{' '}
                            at {formatDate(data?.closedAt)}
                        </div>
                    </div>
                )}

                {showActioncase && (
                    <div>
                        <div className="text-sm text-bold">
                            <Link
                                className="text-blue-500 hover:underline"
                                rel="noopener noreferrer"
                                target="_blank"
                                href={getExplorerUrl(requestId, currentChain)}
                            >
                                View on {data?.network || 'explorer'}
                            </Link>
                        </div>

                        {data && (
                            <div className="mt-4">
                                <div className="my-2">
                                    <div className="font-bold text-2xl mb-4 text-black-500">
                                        Hello,
                                    </div>
                                    <div className="mb-2">
                                        You are the {getUserRole()} on this
                                        case.
                                    </div>
                                    <hr />
                                    <div className="text-2xl font-bold mt-4">
                                        {data.name}
                                    </div>
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

                                    {isJudge && allFeedbackSubmitted && (
                                        <div>
                                            {/* select who wins */}

                                            <div className="text-xl font-bold mt-8">
                                                Select winner
                                            </div>
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

                        {/* {data && (
                            <div className="mt-4">
                                <RenderObject
                                    title="Data"
                                    obj={data}
                                    keys={RESULT_KEYS}
                                />
                            </div>
                        )} */}

                        {evidenceSubmitted && (
                            <div>
                                <h3 className="text-lg font-bold text-green-500">
                                    Evidence submitted!
                                </h3>
                            </div>
                        )}

                        {!evidenceSubmitted && (
                            <div className="submit-evidence">
                                <Textarea
                                    className="my-2"
                                    value={statement}
                                    onChange={(e) => {
                                        setStatement(e.target.value)
                                    }}
                                    rows={5}
                                />

                                <Button
                                    onClick={() => {
                                        provideEvidence()
                                    }}
                                >
                                    {caseLoading && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Provide evidence
                                </Button>
                            </div>
                        )}

                        {isJudge && !allFeedbackSubmitted && (
                            <div>
                                <RenderEvidence
                                    user="Plaintiff"
                                    data={data?.plaintiff}
                                />

                                <RenderEvidence
                                    user="Defendant"
                                    data={data?.defendant}
                                />

                                {/* input group for selecting ruling */}
                                <RadioGroup
                                    value={ruling+""}
                                    onChange={(e) => {
                                        setRuling((e.target as any).value)
                                    }}
                                >
                                    <RadioGroupItem value={Ruling.PlaintiffWins+""}>
                                        Plaintiff wins
                                    </RadioGroupItem>
                                    <RadioGroupItem value={Ruling.DefendantWins+""}>
                                        Defendant wins
                                    </RadioGroupItem>
                                    <RadioGroupItem value={Ruling.None+""}>
                                        No ruling
                                    </RadioGroupItem>
                                </RadioGroup>

                                <div>Recommendation</div>
                                <p>{data.recommendation}</p>

                                <div>Select Ruling</div>
                                {Ruling[ruling]}

                                <hr />

                                <Button
                                    onClick={() => {
                                        closeCase()
                                    }}
                                >
                                    {caseLoading && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Decide case
                                </Button>
                            </div>
                        )}
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
