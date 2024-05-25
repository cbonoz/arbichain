<p align='center'>
    <img src='./public/logo.png' width=400 />
</p>

## Arbichain

Smart contract managed financial Arbitration with AI-assisted verdicts.

Live Demo url: https://arbichain.vercel.app

<!-- Demo video: -->

### Inspiration

Traditional arbitration can be plagued by lengthy proceedings, cumbersome paperwork, and limited accessibility, leaving many individuals and businesses feeling disillusioned with the legal system. The opacity of the decision-making process and enforcement challenges can also erode trust in the fairness and integrity of traditional arbitration outcomes.

By using the immutability of blockchain technology and artificial intelligence, we aim to address these common shortcomings of the current arbitration process. Through the use of smart contracts, we ensure that agreements are tamper-proof and automatically executed, eliminating the need for intermediaries and streamlining the resolution process.

Arbichain provides a transparent and decentralized environment where evidence is securely stored on the blockchain, accessible to all parties involved. AI algorithms assist arbitrators in analyzing evidence objectively and making informed decisions, promoting fairness and impartiality in dispute resolution.

Some arbitration apps may lack access to qualified legal professionals or experts in specific areas of law, limiting the quality and accuracy of legal advice or decisions provided to parties involved in disputes. Arbichain has a built in AI-advisor that's provided to the judge.

Smart contracts prevent tampering with provided statements or evidence after they are provided.

### How it works

 Be able to create a simple arbitration thread without the overhead of signing up for a new protocol or platform and using existing blockchain networks and the Chainlink LLM.

Every arbitration use gets its own smart contract.

1. The judge or mediator registers the dispute. The app automatically generates a smart contract based on the submitted dispute and terms agreed upon by both parties.
2. Each party uses the url to submit their case along with evidence and statements to the arbitration app.
3. The judge reviews the case and evidence provided by both parties, making a decision based on the evidence and terms of the smart contract using Arbichain's AI input.
4. The smart contract executes the decision, requesting or transferring locked funds or assets as necessary, based on the arbitrator's ruling.
5. An event gets emitted from the smart contract with the decision with the result visible by all parties.

<!-- Using a smart contracts ultimately prevents tampering with provided statements, evidence, and decision after they are provided with each interaction timestamped and recorded on the contract. -->

### Technologies used
<!-- https://ethglobal.com/events/hackfs2024/prizes-->
Filecoin: Storage of assets shared during the deliberation process. Involved parties can upload evidence as a document and these are made available to the judge at the time of signing.
Lit Protocol: Security of the uploads and data on chain. Involved parties sign their statements and evidence using the Lit message signing action before submitting to the network/contract..
Galadriel: L1 AI Agent
Huddle01: Video evidence.

### Example case
http://localhost:3000/case/0xAb47620fb38750aF584304a03770796e7E0668b7

http://localhost:3000/case/0xAb47620fb38750aF584304a03770796e7E0668b7


<!-- https://chainlinkblockmagic.devpost.com/ -->
#### Blockchain networks
Galadriel: AI chain fufillment
Chainlink LLM: AI chain fufillment
<!-- (address real world problems) -->
Polygon Cardona: Deployment
Scroll: Deployment
<!-- Avalanche?: https://docs.google.com/document/d/1XYYRz5dXlRcDCb9jH6eGzClPQ8VBrXre6zM9U8cDBQs/edit -->
<!-- Scroll: Use as infra, no need in demo video -->


### Challenges we ran into
* Integrating chainlink and chainlink LLMs into the decision making process while maintaining a high level of security.


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


### Useful links
* Contest: https://chainlinkblockmagic.devpost.com/
* Chainlink functions: https://docs.chain.link/chainlink-functions

<!--
Arbichain
Demo:

-->

#### Screenshots
