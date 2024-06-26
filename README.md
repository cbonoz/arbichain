<p align='center'>
    <img src='./public/logo.png' width=400 />
</p>

## Arbichain

Smart contract managed financial Arbitration with AI-assisted verdicts.

Going after real world use case category for blockchain/smart contracts.

Live Demo url: https://arbichainbeta.vercel.app

Demo video: https://youtu.be/afBL9xaALtk

### Inspiration

Traditional arbitration can be plagued by lengthy proceedings, cumbersome paperwork, and limited accessibility, leaving many individuals and businesses feeling disillusioned with the legal system. The opacity of the decision-making process and enforcement challenges can also erode trust in the fairness and integrity of traditional arbitration outcomes.

<a href="https://www.wipo.int/amc/en/arbitration/what-is-arb.html" target="_blank">Arbitration primer</a>

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

### Example created cases

#### Galadriel
Example case url: https://arbichainbeta.vercel.app/case/0x36FBf31c9E4dcE0Af4b917D10a884cDC71Fb5854

Example closed contract case: https://explorer.galadriel.com/address/0x36FBf31c9E4dcE0Af4b917D10a884cDC71Fb5854

#### Avalance Fuji
Exampel case url: https://arbichainbeta.vercel.app/case/0x0ad760921240F5d6e4dFF7E1d851A5577ea7f55D

Example closed contract case: https://testnet.snowtrace.io/address/0x0ad760921240F5d6e4dFF7E1d851A5577ea7f55D

Note to view case urls need to be logged in with an account address of the involved parties (i.e. judge, plaintiff address, defendant address).

### Technologies used

<!-- https://ethglobal.com/events/hackfs2024/prizes-->
<b>Filecoin</b>: Storage of assets shared during the deliberation process. Involved parties can upload evidence as a document and these are made available to the judge at the time of case determination. Filecoin entries are dynamically linked to the smart contract and only returned to the parties when the case is accessed. Lighthouse and Fleek are used for both secure and backup uploads and act as a gateway for fetching the secured assets for each case created on the app.


<b>Lit Protocol</b>: Lit Protocol enables security of the uploads and data on chain. We don't want arbitrary users coming across smart contracts to necessarily be able to access all raw statements provided by users. Involved parties sign their statements and evidence using the Lit message encrypt action before submitting to the network/contract. Each statement is encrypted using the metamask or signing wallet before being persisted on the network. The judge is the only party that decrypts the messages before having them displayed in the UI when the case is being decided. 

<b>Galadriel Devnet</b>: L1 AI Smart contract network. Arbichain uses Galadriel smart contracts to provide an AI-assisted assessment of the case by merging the case description with the statements from the involved parties. Before making the final decision, the judge can review the on-chain LLM recommendation for the case saved to the contract. The AI recommendation is requestable when the judge is ready to review the case and is saved on chain for each unique Arbichain smart contract.

<b>Fleek IPFS/IPNS Pinning</b>: Fleek is used to securely pin IPFS uploaded assets for each case. A custom app specific gateway serves any uploaded documents to the arbiter/judge. These assets are backed to Filecoin via the Fleek SDK. Toggleable IPFS upload, custom gateway, and pinning are supported alongside use with Lighthouse on the client.

<b>Chainlink VRF and subscription management</b>: Prior to closing, a Chainlink VRF function call is made that generates a random value for both the plaintiff's and defendant's response and saves it to the contract state. This result is shown to the judge during determination. Randomness is used in multiple ways if on a supported network (ex: Fuji):
-- Randomness in evidence submission and preparation deadlines i.e. enabling different submission timeframes for parties.
-- Random presentation of evidence to the judge: Ordering can bias analysis, a random value is used to indicate which evidence is presented first
-- Whenever a new ArbContract is deployed, a consumer is added authorization the new instance of the contract to initiate API calls.

Example funded subscription: https://vrf.chain.link/fuji/111460400570697049739504630512020373539708700110695505033242213289977625247430

<b>Avalanche Fuji</b>: Alternative network that could be used for deployment that offers high throughput and low latency of confirmation. This is key for confirming asynchronous actions such as those involving external oracle calls (ex: Chainlink) and getting a result quickly. The low costs are also beneficial for enabling participants to submit evidence and statements at low cost. Avalanche provides access to various DeFi tools, and oracles like Chainlink used by Arbichain underneath.

<!-- Huddle01: Video meeting between participants. Huddle can be used by the judge to initiate a closing session and invite the participants. -->

Arbichain is build on Javascript/NextJS.

### Accomplishments that we're proud of

* Successfully implementing a fully decentralized arbitration platform using blockchain and smart contracts.
* Creating a secure and transparent system for submitting and reviewing evidence in arbitration cases.

### Potential future work

1. Supporting more networks: Adding networks can attract users from different blockchain ecosystems. Each network has its advantages and user base, so supporting multiple networks can enhance the app's reach and utility. Each network currently defines a distinct app environment and contracts on one network are unique from other networks.
2. Improving UI flow: Could include redesigning screens, adding tooltips or tutorials, and incorporating user feedback to address pain points and enhance usability.
3. Further chainlink and oracle integrations: Chainlink and other oracle integrations play a pivotal role in providing external data to smart contracts. For example, integrating additional Chainlink Price Feeds can provide real-time asset valuations for mediated settlements. Moreover, integrating with other oracle networks can offer redundancy and ensure data reliability across various sources.
4. Move to mainnet: Moving to mainnet involves thorough testing, auditing, and ensuring scalability and security measures are in place to support real-world usage.

### How to run

1. Fill in values in `.env.sample`, copy to a new file `.env`.

2. `yarn; yarn dev`

The app should now be running on port 3000.

### Updating the smart contract

1. Update `ArbContract.sol` in `/arbcontract/contracts`

2. Install dependencies via yarn in root folder. Run `npx hardhat compile` from `/arbcontract`

3. Copy contents (includes ABI) to `metadata.tsx#ARB_CONTRACT`

4. Rebuild web project

#### Screenshots

## Home page

<p>
  <img src="img/home.png" alt="Home" width="600" />
</p>

## About page

<p>
  <img src="img/about.png" alt="About" width="600" />
</p>

## Creating a new case

<p>
  <img src="img/create.png" alt="Create" width="600" />
</p>

## Created case

<p>
  <img src="img/created.png" alt="Created" width="600" />
</p>

## Find

<p>
  <img src="img/find.png" alt="Find" width="600" />
</p>

## AI Recognition

<p>
  <img src="img/ai_rec.png" alt="AI Recognition" width="600" />
</p>

## Get Recognition

<p>
  <img src="img/get_rec.png" alt="Get Recognition" width="600" />
</p>

## Evidence submitted

<p>
  <img src="img/evidence.png" alt="Evidence" width="600" />
</p>

## Viewing a document upload

<p>
  <img src="img/upload.png" alt="Upload" width="600" />
</p>

## Chainlink Contract snapshot

<p>
  <img src="img/contract1.png" alt="Contract 1" width="600" />
</p>

## Contract snapshot of submitting evidence/case

<p>
  <img src="img/contract2.png" alt="Contract 2" width="600" />
</p>

## Fuji Contract

<p>
  <img src="img/fuji_contract.png" alt="Fuji Contract" width="600" />
</p>

## Fuji Evidence

<p>
  <img src="img/fuji_evidence.png" alt="Fuji Evidence" width="600" />
</p>

## Gala Contract

<p>
  <img src="img/gala_contract.png" alt="Gala Contract" width="600" />
</p>

## Fleek site config

<p>
  <img src="img/fleek1.png" alt="Fleek 1" width="600" />
</p>

## Example closed case

<p>
  <img src="img/closed.png" alt="Closed" width="600" />
</p>


<!--

Demo:
Existing sites

Creation:
Fuji or Galadriel deployment
View contract and shareable link

Evidence submit:
Lit protocol
Filecoin upload of docs
Fleek for IPNS pinning

Judge view:
Chainlink VRF randomness

Final verification:
Galadriel AI 
Submit

Common scenarios:
Commercial disputes, employment disputes, consumer disputes, construction disputes, international trade disputes, intellectual property disputes, financial and securities disputes, real estate disputes, sports disputes, maritime disputes, healthcare disputes, family business disputes, insurance disputes, franchise disputes, landlord-tenant disputes, partnership disputes, technology disputes, entertainment industry disputes, environmental disputes, mergers and acquisitions disputes.


-->