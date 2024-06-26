import { Evidence } from '@/lib/types'
import { abbreviate, getIpfsUrl, isEmpty } from '@/lib/utils'
// import BasicCard from './basic-card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

interface Props {
    user: string
    data: Evidence | undefined
}

export const RenderEvidence = ({ user, data }: Props) => {
    const statement = data?.statement
    const hasStatement = !isEmpty(statement)

    // const title = `${user} ${abbreviate(data?.user || '')}`
    const title = hasStatement ? user : `${user} (no statement provided yet)`

    return (
        <Accordion className='my-1' type="single" collapsible>
            <AccordionItem value="item-1" className="max-width-[400px]">
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>
                    {/* <BasicCard title={title} className="py-1 my-4 max-width-[400px]"> */}
                    {!hasStatement && (
                        <div>{user} has not provided a statement.</div>
                    )}
                    {hasStatement && (
                        <div>
                            {/* <span className="text-xl">Statement</span> */}
                            <p>{statement}</p>
                            <br />
                            {data?.cid && (
                                <span>
                                    <div className="text-xl">Upload</div>
                                    <a
                                        href={getIpfsUrl(data.cid)}
                                        target="_blank"
                                        className="cursor-pointer text-blue-500 hover:underline"
                                    >
                                        View upload from {user}
                                    </a>
                                </span>
                            )}
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
