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

By using the immutability of blockchain technology and artificial intelligence, we aim to address these common shortcomings of the current arbitration process. Through the use of smart contracts, we ensure that agreements are tamper-proof and automatically executed, eliminating the need for intermediaries and streamlining the resolution process.

Arbichain provides a transparent and decentralized environment where evidence is securely stored on the blockchain, accessible to all parties involved. AI algorithms assist arbitrators in analyzing evidence objectively and making informed decisions, promoting fairness and impartiality in dispute resolution.

Some arbitration apps may lack access to qualified legal professionals or experts in specific areas of law, limiting the quality and accuracy of legal advice or decisions provided to parties involved in disputes. Arbichain has a built in AI-advisor that's provided to the judge. Platforms like Kleros (kleros.com) exist, however requires using platform jurors and doesn't have as much flexibility to settle your own disputes without using their justice protocol / fee system.

Smart contracts prevent tampering with provided statements or evidence after they are provided.

### How it works

 <!-- Be able to create a simple arbitration thread without the overhead of signing up for a new protocol or platform and using existing blockchain networks and the Chainlink LLM. -->

Every arbitration use gets its own smart contract.

1. The judge or mediator registers the dispute. The app automatically generates a smart contract based on the submitted dispute and terms agreed upon by both parties.
2. Each party uses the url to submit their case along with evidence and statements to the arbitration app.
3. The judge reviews the case and evidence provided by both parties, making a decision based on the evidence and terms of the smart contract using Arbichain's AI input.
4. The smart contract executes the decision, requesting or transferring locked funds or assets as necessary, based on the arbitrator's ruling.
5. An event gets emitted from the smart contract with the decision with the result visible by all parties.

<!-- Using a smart contracts ultimately prevents tampering with provided statements, evidence, and decision after they are provided with each interaction timestamped and recorded on the contract. -->

### Technologies used

<!-- https://ethglobal.com/events/hackfs2024/prizes-->
Filecoin: Storage of assets shared during the deliberation process. Involved parties can upload evidence as a document and these are made available to the judge at the time of case determination. Filecoin entries are dynamically linked to the smart contract and only returned to the parties when the case is accessed. Lighthouse is used for both secure uploads and as a gateway for fetching the secured assets for each case created on the app. 

Lit Protocol: Security of the uploads and data on chain. Involved parties sign their statements and evidence using the Lit message encrypt action before submitting to the network/contract. Each statement is encrypted using the metamask or signing wallet before being persisted on the network. The judge is the only party that decrypts the messages before having them displayed in the UI when the case is being decided.

Galadriel: L1 AI Smart contract network. Arbichain uses Galadriel smart contracts to provide an AI-assisted assessment of the case by merging the case description with the statements from the involved parties. Before making the final decision, the judge can review the on-chain LLM recommendation for the case saved to the contract.

Chainlink:
* Programmatic management of subscriptions: Whenever a new ArbContract is deployed, a consumer is added authorization the new instance of the contract to initiate API calls.
* Chainlink Function call: Prior to closing, a chainlink function call is made that analyzes both the plaintiff's and defendant's response and saves it to the contract state. This result is shown to the judge during determination.

Huddle01: Video meeting between participants. Huddle can be used by the judge to initiate a closing session and invite the participants.

### Example case


Avalanche: Chainlink function compatible Fuji contracts
Scroll: Deployment
<!-- (address real world problems) -->
<!-- Avalanche?: https://docs.google.com/document/d/1XYYRz5dXlRcDCb9jH6eGzClPQ8VBrXre6zM9U8cDBQs/edit -->
<!-- Scroll: Use as infra, no need in demo video -->


### Challenges we ran into
* Integrating chainlink and chainlink LLMs into the decision making process while maintaining a high level of security.
* Using chainlink function to fufill an AI-based assessment.


### Accomplishments that we're proud of
* Successfully implementing a fully decentralized arbitration platform using blockchain and smart contracts.
* Developing AI algorithms that assist arbitrators in making fair and informed decisions.
* Creating a secure and transparent system for submitting and reviewing evidence in arbitration cases.
* Building a user-friendly interface that simplifies the arbitration process for all parties involved.

### Potential future work
* Enhancing AI algorithms to provide more advanced analysis of evidence and statements, including natural language processing and sentiment analysis.

### How to run

1. Fill in values in `.env.sample`, copy to a new file `.env`.

2. `yarn; yarn dev`

The app should now be running on port 3000.

### Updating the smart contract

1. Update `ArbContract.sol` in `/arbcontract/contracts`

2. Install dependencies via yarn in root folder. Run `npx hardhat compile` from `/arbcontract`

3. Copy contents (includes ABI) to `metadata.tsx#ARB_CONTRACT`

4. Rebuild web project

### Deployment

Vercel CICD or hosting provider of choice.


### Useful links
* Chainlink functions: https://docs.chain.link/chainlink-functions

<!--
Arbichain
Demo

-->

#### Screenshots
