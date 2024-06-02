'use client'

import { config, galadrielDevnet } from '@/app/config'
import BasicCard from '@/components/basic-card'
import { RenderEvidence } from '@/components/render-evidence'
import RenderObject from '@/components/render-object'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ARB_CONTRACT } from '@/lib/contract/metadata'
import { ContractMetadata, Ruling } from '@/lib/types'
import {
    abbreviate,
    createLlmPrompt,
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
import { uploadFile } from '@/lib/stor'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { Separator } from '@radix-ui/react-select'
import { LitClient } from '@/lib/lit'
import { Input } from '@/components/ui/input'
import { SUPPORTED_LIT_NETWORKS } from '@/lib/constants'

interface Props {
    requestId: Address
}

export default function ManageCase({ requestId }: Props) {
    const [loading, setLoading] = useState(true)
    const [caseLoading, setCaseLoading] = useState(false)
    const [recLoading, setRecLoading] = useState(false)
    const [data, setData] = useState<ContractMetadata | undefined>()
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<any>(null)
    const [statement, setStatement] = useState('')
    const [ruling, setRuling] = useState<Ruling>(Ruling.DefendantWins)
    const [file, setFile] = useState<File | null>(null)
    const [proceed, setProceed] = useState(false)
    const { chains, switchChain } = useSwitchChain()
    const { address } = useAccount()

    const router = useRouter()

    const chainId = useChainId()
    const currentChain: Chain | undefined = (chains || []).find(
        (c) => c.id === chainId
    )

    useEffect(() => {
        if (address) {
            fetchData()
        }
    }, [address])

    // if (!requestId) {
    //     router.push('/lookup')
    //     return <div>Redirecting...</div>
    // }

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

            if (
                contractData.judge === address &&
                !!SUPPORTED_LIT_NETWORKS[chainId]
            ) {
                // decrypt data
                const lit = new LitClient(chainId)
                if (contractData.plaintiff.statement) {
                    const {
                        statement: encryptedString,
                        encryptionKey: encryptedSymmetricKey,
                    } = contractData.plaintiff
                    const decrypted = await lit.decrypt(
                        encryptedString,
                        encryptedSymmetricKey
                    )
                    console.log('decrypted plaintiff', decrypted)
                    contractData.plaintiff.statement = decrypted
                }
                if (contractData.defendant.statement) {
                    const {
                        statement: encryptedString,
                        encryptionKey: encryptedSymmetricKey,
                    } = contractData.defendant
                    const decrypted = await lit.decrypt(
                        encryptedString,
                        encryptedSymmetricKey
                    )
                    console.log('decrypted defendant', decrypted)
                    contractData.defendant.statement = decrypted
                }
            }
            setData(contractData)
        } catch (error) {
            console.log('error reading contract', error)
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    async function getRecommendation(prompt: string) {
        // setRecommendation('Defendant should win')
        setRecLoading(true)
        try {
            // make contract call with prompt
            const res = await writeContract(config, {
                abi: ARB_CONTRACT.abi,
                address: requestId,
                functionName: 'getRecommendation',
                args: [prompt],
            })

            console.log('get recommendation', prompt, res)
            const transaction = getExplorerUrl(res, currentChain, true)
            setResult({
                transaction,
                message:
                    'Success: Recommendation will be available here once confirmed on the network',
            })
            alert(
                'Recommendation requested, you may need to refresh the page to see the result'
            )
        } catch (error) {
            console.log('error getting recommendation', error)
            setError(error)
        } finally {
            setRecLoading(false)
        }
    }

    async function provideEvidence() {
        // log chain
        console.log('currentChain', currentChain)

        setError(null)
        setCaseLoading(true)
        try {
            if (!statement) {
                throw new Error('Please provide a statement')
            }

            if (!currentChain) {
                throw new Error('Please connect to a chain')
            }

            let text
            let textHash
            if (SUPPORTED_LIT_NETWORKS[chainId]) {
                const lit = new LitClient(chainId) //currentChain?.name)
                const { ciphertext, dataToEncryptHash } =
                    await lit.encrypt(statement)
                text = ciphertext
                textHash = dataToEncryptHash
            } else {
                text = statement
                textHash = ''
            }
            console.log('provide evidence', text, textHash)

            // const attestation = { attestationId: '1234' }
            // await switchChain({ chainId })
            let cid = ''
            // upload
            if (file) {
                cid = await uploadFile([file])
            }

            const res = await writeContract(config, {
                abi: ARB_CONTRACT.abi,
                address: requestId,
                functionName: 'submitEvidence',
                args: [text, textHash, cid],
            })

            console.log('submit evidence', res)
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
    const isPartyThatNeedsToSubmit =
        (isPlaintiff && !plaintiffSubmitted) ||
        (isDefendant && !defendantSubmitted)
    const evidenceSubmitted =
        (isPlaintiff && plaintiffSubmitted) ||
        (isDefendant && defendantSubmitted)
    const allFeedbackSubmitted = plaintiffSubmitted && defendantSubmitted
    const showContinue = !proceed && !allFeedbackSubmitted

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
            return 'plaintiff (accuser)'
        }
        if (address === data?.defendant.user) {
            return 'defendant (accused)'
        }
        if (address === data?.judge) {
            return 'judge'
        }
        return 'unknown'
    }

    const EvidenceSection = () => {
        const comp1 = <RenderEvidence user="Plaintiff" data={data?.plaintiff} />

        const comp2 = <RenderEvidence user="Defendant" data={data?.defendant} />
        // return random order

        const value = data?.randomValue || 0
        if (value % 2 === 0) {
            return (
                <div className="my-1">
                    {comp2}
                    {comp1}
                </div>
            )
        }

        return (
            <div className="my-1">
                {comp1}
                {comp2}
            </div>
        )
    }

    const compensation = data?.compensation || 0

    return (
        // center align
        <div className="flex flex-col items-center justify-center mt-8">
            {authorized && !isClosed && (
                <p className="text-green-500">Case Open</p>
            )}
            <BasicCard title={getTitle()} className="max-w-[1000px] p-4">
                {invalid && (
                    <div>
                        <p>
                            This contract may not exist or may be on another
                            network, double check your currently connected
                            network
                        </p>
                    </div>
                )}

                {!authorized && !isClosed && (
                    <div className="mt-2">
                        <p>
                            Not authorized to access this case or you may be on
                            the wrong network.
                        </p>
                    </div>
                )}

                {isClosed && (
                    <div>
                        {/* Ruling */}
                        {data && (
                            <div className="text-xl my-2">
                                {Ruling[data.ruling]}
                            </div>
                        )}

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
                        <Separator />

                        <div className="text-sm text-bold mt-4">
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
                            {/* <div className="text-2xl font-bold">
                                {data?.name}
                            </div> */}
                            <div className="mb-4">{data?.description}</div>
                            <div className="text-lg font-bold">Evidence</div>

                            <EvidenceSection />

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
                            {!!compensation && (
                                <div>
                                    <Label>Compensation</Label>
                                    <div>{formatCurrency(compensation)}</div>
                                </div>
                            )}
                        </div>

                        {/* <div className="text-black-500"> */}
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
                                    {/* <div className="font-bold text-2xl mb-4 text-black-500">
                                        Hello,
                                    </div> */}

                                    {/* <div className="text-2xl font-bold mt-4">
                                        {data.name}
                                    </div> */}
                                    <div className="my-4">
                                        {data.description}
                                    </div>
                                    {data.createdAt && (
                                        <div className="italic my-2">
                                            This case was opened at:&nbsp;
                                            {new Date(
                                                data.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    )}

                                    <hr />
                                    <div className="mt-4 text-l font-bold">
                                        You are the {getUserRole()} on this
                                        case.
                                    </div>

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

                        {evidenceSubmitted && (
                            <div>
                                <h3 className="text-lg font-bold text-green-500">
                                    Evidence submitted!
                                </h3>
                            </div>
                        )}

                        {isPartyThatNeedsToSubmit && (
                            <div className="submit-evidence">
                                <div className="text-med mt-1">
                                    Provide statement
                                </div>
                                <Textarea
                                    className="my-2"
                                    value={statement}
                                    onChange={(e) => {
                                        setStatement(e.target.value)
                                    }}
                                    rows={10}
                                />
                                <div className="my-4">
                                    <label className="my-2">
                                        Optional attachment to include with your
                                        statement:
                                    </label>
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files?.length) {
                                                setFile(e.target.files[0])
                                            }
                                        }}
                                    />
                                </div>

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

                        {isJudge && !isPartyThatNeedsToSubmit && (
                            <div>
                                <div className="text-xl font-bold mt-8">
                                    Statements
                                </div>

                                <EvidenceSection />

                                {data.recommendation && (
                                    <div>
                                        <Accordion type="single" collapsible>
                                            <AccordionItem
                                                value="item-1"
                                                className="max-width-[400px]"
                                            >
                                                <AccordionTrigger>
                                                    View AI Recommendation
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {data.recommendation}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                )}

                                <div className="text-xl font-bold my-4">
                                    Select Ruling
                                </div>

                                <RadioGroup
                                    value={ruling + ''}
                                    onValueChange={(v: any) => {
                                        setRuling(v as Ruling)
                                    }}
                                >
                                    <div className="flex space-x-2">
                                        <RadioGroupItem
                                            value={Ruling.PlaintiffWins + ''}
                                        />
                                        <Label>Plaintiff wins</Label>
                                    </div>
                                    <div className="flex space-x-2">
                                        <RadioGroupItem
                                            value={Ruling.DefendantWins + ''}
                                        />
                                        <Label>Defendant wins</Label>
                                    </div>
                                    <div className="flex space-x-2">
                                        <RadioGroupItem
                                            value={Ruling.None + ''}
                                        />
                                        <Label>Split</Label>
                                    </div>
                                </RadioGroup>
                                {/* TODO: add chainlink call */}
                                {!data?.recommendation &&
                                    isJudge &&
                                    chainId === galadrielDevnet.id && (
                                        <div className="my-2">
                                            <Button
                                                variant={'outline'}
                                                disabled={recLoading}
                                                onClick={() => {
                                                    getRecommendation(
                                                        createLlmPrompt(
                                                            data?.name,
                                                            data?.description,
                                                            data?.plaintiff
                                                                .statement,
                                                            data?.defendant
                                                                .statement
                                                        )
                                                    )
                                                }}
                                            >
                                                {recLoading && (
                                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Get AI Recommendation
                                            </Button>
                                        </div>
                                    )}

                                <Separator />
                                <div className="my-2" />
                                {/* {Ruling[ruling]} */}
                                {!allFeedbackSubmitted && (
                                    <div className="text-red-500 my-4">
                                        Warning: Not all parties have provided
                                        statements yet.
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Button
                                        disabled={caseLoading || showContinue}
                                        onClick={() => {
                                            closeCase()
                                        }}
                                    >
                                        {caseLoading && (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Decide case
                                    </Button>
                                    &nbsp;
                                    {showContinue && (
                                        <span>
                                            <a
                                                className="text-blue-500 hover:underline cursor-pointer"
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setProceed(true)
                                                }}
                                            >
                                                Continue anyway
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-4">
                    {result && (
                        <div className="mt-4">
                            <RenderObject title="Result" obj={result} />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500">{error.message}</div>
                    )}
                </div>
            </BasicCard>
        </div>
    )
}
