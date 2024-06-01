'use client'

import BasicCard from '@/components/basic-card'
import RenderObject from '@/components/render-object'
import { Button } from '@/components/ui/button'
import { useEthersSigner } from '@/lib/get-signer'
import { siteConfig } from '@/util/site-config'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { set } from 'react-hook-form'

const About = () => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const signer = useEthersSigner()

    return (
        <div className="flex flex-col items-center justify-center mt-8">
            <BasicCard
                title="About Arbichain"
                description="Learn more about Arbichain and how it works."
                className="min-w-[400px] p-4"
            >
                {siteConfig.about.map((section, index) => (
                    <div key={index} className="mt-4">
                        <h3 className="text-lg font-bold">{section.title}</h3>
                        <p>{section.description}</p>
                    </div>
                ))}

                {result && (
                    <div className="my-2">
                        <RenderObject title="Result" obj={result} />
                    </div>
                )}
            </BasicCard>
        </div>
    )
}
export default About
