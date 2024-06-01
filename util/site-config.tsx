export const siteConfig = {
    title: 'Arbichain',
    isLocal: process.env.NEXT_PUBLIC_ENV === 'development',
    description:
        'Smart contract assisted financial dispute arbitration using on-chain AI',
    about: [
        {
            title: 'What is Arbichain?',
            description:
                'Arbichain is a decentralized arbitration platform that leverages blockchain technology, specifically Chainlink and blockchain LLMs (decentralized oracle networks), to settle disputes fairly and transparently.',
        },
        {
            title: 'How does it work?',
            description:
                'Arbichain works by allowing parties involved in a dispute to submit evidence and arguments to a smart contract deployed on the blockchain. A designated judge then reviews the evidence and makes a final ruling. The ruling is executed automatically by the smart contract, ensuring fairness and immutability of each verdict stored on the blockchain. Once a decision is made, an event is emitted from the blockchain that can be listened to by external platforms and systems - enabling off and on chain workflows post-decision.',
        },
        {
            title: 'Why should I use Arbichain?',
            description:
                'Arbichain provides a trustless and efficient way to resolve disputes without the need for expensive and time-consuming traditional legal processes. By leveraging blockchain technology and AI, Arbichain ensures transparency, immutability, and fairness without requiring the costly and slow mediation typical of many arbitration processes.',
        },
        {
            title: 'Disclaimer',
            description:
                'Note Arbichain is currently a free proof of concept prototype and is provided as-is without any guarantees. Use at your own risk/descretion.',
        },
    ],
    createPrompt:
        'Create a new arbitration case. This case will become available as a url for involved parties (based on addresses) to submit statements. Three parties are required: plaintiff, defendant, and judge. the judge is the current deployer of the contract and will be the final arbiter of the case.',
    steps: [
        {
            title: 'Create',
            description:
                'Initiate a new arbitration case by deploying a smart contract on the Arbichain platform.',
        },
        {
            title: 'Present',
            description:
                'Share the case url with the defendant and the plaintiff. Each side presents evidence to support their position and is saved encrypted to the contract.',
        },
        {
            title: 'Decide',
            description:
                'The judge reviews the evidence and makes a final ruling on the case. The ruling is saved immutably to the contract and emitted as a smart contract event.',
        },
    ],
}
