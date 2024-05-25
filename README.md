<p align='center'>
    <img src='./public/logo.png' width=400 />
</p>

## Arbichain

AI-managed financial Arbitration backed by smart contracts.

Live Demo url: https://arbichain.vercel.app

<!-- Demo video: -->

### Inspiration

Traditional arbitration can be plagued by lengthy proceedings, cumbersome paperwork, and limited accessibility, leaving many individuals and businesses feeling disillusioned with the legal system. Moreover, the opacity of decision-making and enforcement challenges can erode trust in the fairness and integrity of arbitration outcomes.

By harnessing the power of blockchain technology and artificial intelligence, we aim to address these common shortcomings of the current arbitration process. Through the use of smart contracts, we ensure that agreements are tamper-proof and automatically executed, eliminating the need for intermediaries and streamlining the resolution process.

Our platform provides a transparent and decentralized environment where evidence is securely stored on the blockchain, accessible to all parties involved. AI algorithms assist arbitrators in analyzing evidence objectively and making informed decisions, promoting fairness and impartiality in dispute resolution.

* Smart contracts prevent tampering with provided statements or evidence after they are provided.
* Some arbitration apps may lack access to qualified legal professionals or experts in specific areas of law, limiting the quality and accuracy of legal advice or decisions provided to parties involved in disputes.
* Be able to create a simple arbitration thread without the overhead of signing up for a new protocol or platform and using existing blockchain networks and the Chainlink LLM.

### How it works
1. Users submit their dispute along with evidence and statements to the arbitration app.
2. The app automatically generates a smart contract based on the submitted dispute and terms agreed upon by both parties.
3. Arbitrators review the case and evidence provided by both parties. Specify an arbitrator using an address agreed on by both parties.
4. Arbitrators make a decision based on the evidence and terms of the smart contract using AI input.
5. The smart contract executes the decision, requesting or transferring locked funds or assets as necessary, based on the arbitrator's ruling.

### Technologies used
<!-- https://ethglobal.com/events/hackfs2024/prizes-->
Filecoin: Storage of assets shared during the deliberation process.
Lit Protocol: Security of the uploads and data on chain.
Galadriel: L1 Agent
Huddle01:


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
