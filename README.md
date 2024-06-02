<p align='center'>
    <img src='./public/logo.png' width=400 />
</p>

## Arbichain

Smart contract managed financial Arbitration with AI-assisted verdicts.

Going after real world use case category for blockchain/smart contracts.

Live Demo url: arbichainbeta.vercel.app


<!-- Demo video: -->

### Inspiration

Traditional arbitration can be plagued by lengthy proceedings, cumbersome paperwork, and limited accessibility, leaving many individuals and businesses feeling disillusioned with the legal system. The opacity of the decision-making process and enforcement challenges can also erode trust in the fairness and integrity of traditional arbitration outcomes.

Arbichain provides a transparent and decentralized environment where evidence is securely stored on the blockchain, accessible to all parties involved. AI algorithms assist arbitrators in analyzing evidence objectively and making informed decisions, promoting fairness and impartiality in dispute resolution.

Some arbitration apps may lack access to qualified legal professionals or experts in specific areas of law, limiting the quality and accuracy of legal advice or decisions provided to parties involved in disputes. Arbichain has a built in AI-advisor that's provided to the judge. Platforms like Kleros (kleros.com) exist, however requires using platform jurors and doesn't have as much flexibility to settle your own disputes without using a justice protocol and/or fee system.

### How it works

 <!-- Be able to create a simple arbitration thread without the overhead of signing up for a new protocol or platform and using existing blockchain networks and the Chainlink LLM. -->

Every arbitration use gets its own smart contract.

1. The judge or mediator registers the dispute. The app automatically generates a smart contract based on the submitted dispute and terms agreed upon by both parties.
2. Each party uses the url to submit their case along with evidence and statements to the arbitration app.
3. The judge reviews the case and evidence provided by both parties, making a decision based on the evidence and terms of the smart contract using Arbichain's AI input.
4. The smart contract executes the decision, requesting or transferring locked funds or assets as necessary, based on the arbitrator's ruling.
5. An event gets emitted from the smart contract with the decision with the result visible by all parties.

Using a smart contracts ultimately prevents tampering with provided statements, evidence, and decision after they are provided with each interaction timestamped and recorded on the contract.

### Examples

Example case url: htts://arbichainbeta.vercel.app/case/0x36FBf31c9E4dcE0Af4b917D10a884cDC71Fb5854

Example closed contract case: https://explorer.galadriel.com/address/0x36FBf31c9E4dcE0Af4b917D10a884cDC71Fb5854

### Technologies used

<!-- https://ethglobal.com/events/hackfs2024/prizes-->
<b>Filecoin</b>: Storage of assets shared during the deliberation process. Involved parties can upload evidence as a document and these are made available to the judge at the time of case determination. Filecoin entries are dynamically linked to the smart contract and only returned to the parties when the case is accessed. Lighthouse and Fleek are used for both secure and backup uploads and act as a gateway for fetching the secured assets for each case created on the app.


<b>Lit Protocol</b>: Security of the uploads and data on chain. Involved parties sign their statements and evidence using the Lit message encrypt action before submitting to the network/contract. Each statement is encrypted using the metamask or signing wallet before being persisted on the network. The judge is the only party that decrypts the messages before having them displayed in the UI when the case is being decided. 

<b>Galadriel Devnet</b>: L1 AI Smart contract network. Arbichain uses Galadriel smart contracts to provide an AI-assisted assessment of the case by merging the case description with the statements from the involved parties. Before making the final decision, the judge can review the on-chain LLM recommendation for the case saved to the contract. The AI recommendation is requestable when the judge is ready to review the case and is saved on chain for each unique Arbichain smart contract.

<b>Fleek IPFS/IPNS Pinning</b>: Fleek is used to securely pin IPFS uploaded assets for each case. A custom app specific gateway serves any uploaded documents to the arbiter/judge. These assets are backed to Filecoin via the Fleek SDK.

<b>Chainlink VRF and subscription management</b>: Prior to closing, a Chainlink VRF function call is made that generates a random value for both the plaintiff's and defendant's response and saves it to the contract state. This result is shown to the judge during determination. Randomness is used in multiple ways if on a supported network (ex: Fuji):
-- Random presentation of evidence to the judge: Ordering can bias analysis, a random value is used to indicate which evidence is presented first
--  Randomness in deadline. A week + a random number of days is added to each individual's deadline for providing evidence before close.

Whenever a new ArbContract is deployed, a consumer is added authorization the new instance of the contract to initiate API calls.

<b>Avalanche Fuji</b>: Alternative network that could be used for deployment that offers high throughput and low latency of confirmation. This is key for confirming asynchronous actions such as those involving external oracle calls (ex: Chainlink) and getting a result quickly. The low costs are also beneficial for enabling participants to submit evidence and statements at low cost. Avalanche provides access to various DeFi tools, and oracles like Chainlink used by Arbichain underneath.

<!-- Huddle01: Video meeting between participants. Huddle can be used by the judge to initiate a closing session and invite the participants. -->

Arbichain is build on Javascript/NextJS.

### Example case

<!-- (address real world problems) -->
<!-- Avalanche?: https://docs.google.com/document/d/1XYYRz5dXlRcDCb9jH6eGzClPQ8VBrXre6zM9U8cDBQs/edit -->
<!-- Scroll: Use as infra, no need in demo video -->


### Accomplishments that we're proud of

* Successfully implementing a fully decentralized arbitration platform using blockchain and smart contracts.
* Creating a secure and transparent system for submitting and reviewing evidence in arbitration cases.

### Potential future work

* Supporting more networks: Adding networks can attract users from different blockchain ecosystems. Each network has its advantages and user base, so supporting multiple networks can enhance the app's reach and utility. Each network currently defines a distinct app environment and contracts on one network are unique from other networks.
* Improving UI flow: Could include redesigning screens, adding tooltips or tutorials, and incorporating user feedback to address pain points and enhance usability.
* Further chainlink and oracle integrations: Chainlink and other oracle integrations play a pivotal role in providing external data to smart contracts. For example, integrating additional Chainlink Price Feeds can provide real-time asset valuations for mediated settlements. Moreover, integrating with other oracle networks can offer redundancy and ensure data reliability across various sources.
* Move to mainnet: Transitioning the app from a testnet environment to the Ethereum mainnet or other production-ready blockchain networks marks a significant milestone in its development. Moving to mainnet involves thorough testing, auditing, and ensuring scalability and security measures are in place to support real-world usage. This step opens up opportunities for live transactions, real-value settlements, and wider adoption by users and stakeholders.

### How to run

1. Fill in values in `.env.sample`, copy to a new file `.env`.

2. `yarn; yarn dev`

The app should now be running on port 3000.

### Updating the smart contract

1. Update `ArbContract.sol` in `/arbcontract/contracts`

2. Install dependencies via yarn in root folder. Run `npx hardhat compile` from `/arbcontract`

3. Copy contents (includes ABI) to `metadata.tsx#ARB_CONTRACT`

4. Rebuild web project

### Production build

`yarn build`

#### Screenshots
