'use client'

import { useState } from 'react'
import BasicCard from '@/components/basic-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Lookup = () => {
    const [requestId, setRequestId] = useState<string>('')
    const router = useRouter()

    return (
        <div className="flex flex-row items-center justify-center mt-8">
            <BasicCard
                title="Find case"
                description="Update an arbitration case using your wallet."
                className="min-w-[400px] p-4"
            >
                <Input
                    placeholder="Enter case address"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                />

                <Button
                    className="mt-4"
                    onClick={() => {
                        console.log('Sign request')
                        router.push(`/case/${requestId}`)
                    }}
                >
                    Go to case page
                </Button>
            </BasicCard>
        </div>
    )
}

export default Lookup
