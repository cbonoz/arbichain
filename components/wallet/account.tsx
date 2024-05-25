import { abbreviate } from '@/lib/utils'
import {
    useAccount,
    useBalance,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
} from 'wagmi'

export function Account() {
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
    const { data: balance } = useBalance({ address })

    const shortAddress = abbreviate(address || '', 6)

    return (
        <div>
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
            {shortAddress && (
                <span className="mx-2">
                    {ensName ? `${ensName} (${shortAddress})` : shortAddress}
                    {/* {balance && ` - ${balance}} ETH`} */}&nbsp;(
                    <button
                        className="text-blue-500 underline"
                        onClick={() => disconnect()}
                    >
                        Disconnect
                    </button>
                    )
                </span>
            )}
        </div>
    )
}
