import { Evidence } from '@/lib/types'
import { abbreviate, getIpfsUrl, isEmpty } from '@/lib/utils'
import BasicCard from './basic-card'

interface Props {
    user: string
    data: Evidence | undefined
}

export const RenderEvidence = ({ user, data }: Props) => {
    const statement = data?.statement
    const hasStatement = !isEmpty(statement)

    // const title = `${user} ${abbreviate(data?.user || '')}`
    const title = user

    return (
        <BasicCard title={title} className="py-1 my-4 max-width-[400px]">
            {!hasStatement && <div>{user} has not provided a statement.</div>}
            {hasStatement && (
                <div>
                    <div className="text-l">Statement</div>
                    <p>{statement}</p>
                    {data?.cid && (
                        <div>
                            <h1>CID</h1>
                            <a href={getIpfsUrl(data.cid)} target="_blank">
                                View upload from {user}
                            </a>
                        </div>
                    )}
                </div>
            )}
        </BasicCard>
    )
}
