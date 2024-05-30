import { RouteButtons } from '@/components/route-buttons'
import { config } from '@/util/site-config'
import { Metadata } from 'next'
import Image from 'next/image'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            {/* <h1 className="text-4xl font-bold">Welcome to arbichain</h1> */}
            <div>
                <Image
                    src="/logo.png"
                    alt="arbichain"
                    className="my-4"
                    width={400}
                    height={200}
                />
                <RouteButtons />
            </div>
            <p className="text-lg pt-8">{config.description}.</p>
        </main>
    )
}
