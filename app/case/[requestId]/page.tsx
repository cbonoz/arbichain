import ManageCase from '@/components/manage-case'

interface Params {
    requestId: string
}

export default function RequestPage({ params }: { params: Params }) {
    const { requestId } = params

    return <ManageCase requestId={requestId as any} />
}
