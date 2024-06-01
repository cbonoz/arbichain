import BasicCard from '@/components/basic-card'
import { siteConfig } from '@/util/site-config'

const About = () => {

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

            </BasicCard>
        </div>
    )
}
export default About
