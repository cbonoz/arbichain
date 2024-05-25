import { Evidence } from '@/lib/types'
import { getIpfsUrl } from '@/lib/utils'
import BasicCard from './basic-card'


interface Props {
    user: string
    data: Evidence | undefined

}

export const RenderEvidence = ({user, data}: Props) => {
    if (!data) {
        return null
    }

    return (
        <BasicCard title={user}>
            <div className='text-l'>Statement</div>
            <p>{data.statement}</p>
            {data.cid && (
                <div>
                    <h1>CID</h1>
                    <a href={getIpfsUrl(data.cid)} target="_blank">
                        View upload from {user}
                    </a>
                </div>
            )}
        </BasicCard>
    )
}
