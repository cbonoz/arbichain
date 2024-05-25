'use client'

import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { useAccount } from 'wagmi'

export const RouteButtons = () => {
    const router = useRouter()
    return (
        <div className="flex space-x-4">
            <Button
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => router.push('/upload')}
            >
                Create arbitration case
            </Button>

            <Button
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => router.push('/case')}
            >
                Verify arbitration case
            </Button>
        </div>
    )
}
