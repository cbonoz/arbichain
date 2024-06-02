// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOracle {
    function createLlmCall(uint promptId) external returns (uint);
}

import '@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol';
import '@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol';

contract ArbContract is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;

    enum Ruling {
        None,
        PlaintiffWins,
        DefendantWins
    }

    struct Evidence {
        address user;
        string statement;
        string encryptionKey;
        string cid;
    }

    // Struct that represents the case of the case.
    struct Metadata {
        address owner;
        string network;
        uint256 createdAt;
        string name;
        string description;
        // string cid; // optional cid pointer to attachment/s
        Evidence plaintiff;
        Evidence defendant;
        address judge;
        uint256 closedAt;
        uint256 compensation;
        string recommendation;
        uint256 randomValue;
        Ruling ruling;
    }

    // metadata
    Metadata private metadata;

    modifier onlyOracle() {
        require(msg.sender == galadrielOracle, 'Caller is not oracle');
        _;
    }

    modifier onlyJudge() {
        require(
            msg.sender == metadata.judge,
            'Only the judge can call this function'
        );
        _;
    }

    modifier onlyParties() {
        require(
            msg.sender == metadata.plaintiff.user ||
                msg.sender == metadata.defendant.user,
            'Only involved parties can call this function'
        );
        _;
    }

    struct Message {
        string role;
        string content;
    }

    struct ChatRun {
        address owner;
        Message[] messages;
        uint messagesCount;
    }

    address private galadrielOracle;

    // fuji
    uint64 s_subscriptionId = 0;
    address vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610;
    address link = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    bytes32 s_keyHash =
        0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;
    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    uint256 private constant FETCH_IN_PROGRESS = 9999;

    // status
    uint256 private constant MAX_RESULT = 10; // 1 -> max result
    uint256 private randomResult;


    // Event to log arbitration completion.
    event CaseClosed(
        address indexed judge,
        Ruling ruling,
        uint256 compensation
    );
    event RandomGenerated(uint256 indexed requestId, address indexed requester, uint256 result);
    event EvidenceSubmitted(address indexed submitter, string evidence);

    // Constructor to initialize the contract
    constructor(
        string memory _name,
        string memory _description,
        string memory _network,
        address _plaintiff,
        address _defendant,
        address _judge,
        address _galadrielOracle
    ) VRFConsumerBaseV2(vrfCoordinator)  {
        metadata = Metadata(
            msg.sender,
            _network,
            block.timestamp,
            _name,
            _description,
            Evidence(_plaintiff, '', '', ''),
            Evidence(_defendant, '', '', ''),
            _judge,
            0,
            0,
            '',
            0,
            Ruling.None
        );
        galadrielOracle = _galadrielOracle;
        if (equalStrings(_network, 'fuji')) {
            s_subscriptionId = 8867;
            COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
            LINKTOKEN = LinkTokenInterface(link);
            addConsumer(address(this));
        }
    }

     function addConsumer(address consumerAddress) internal {
        // Add a consumer contract to the subscription.
        COORDINATOR.addConsumer(s_subscriptionId, consumerAddress);
    }

    function removeConsumer(address consumerAddress) internal {
        // Remove a consumer contract from the subscription.
        COORDINATOR.removeConsumer(s_subscriptionId, consumerAddress);
    }

    function equalStrings(
        string memory a,
        string memory b
    ) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

     function getRandom() public onlyJudge returns (uint256 requestId) {
        require(s_subscriptionId != 0, 'Invalid network');
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
       );

        metadata.randomValue = FETCH_IN_PROGRESS;
    }

      function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // Scale value
        uint256 value = (randomWords[0] % MAX_RESULT) + 1;
        metadata.randomValue = value;
        emit RandomGenerated(requestId, metadata.judge, value);
    }

    function submitEvidence(
        string memory _evidence,
        string memory _key,
        string memory _cid
    ) public onlyParties {
        // Logic to submit evidence
        // For simplicity, let's assume evidence is just logged
        emit EvidenceSubmitted(msg.sender, _evidence);
        if (msg.sender == metadata.plaintiff.user) {
            metadata.plaintiff = Evidence(msg.sender, _evidence, _key, _cid);
        } else {
            metadata.defendant = Evidence(msg.sender, _evidence, _key, _cid);
        }
    }

    function makeRuling(
        Ruling _ruling,
        uint256 _compensation
    ) public onlyJudge {
        require(metadata.ruling == Ruling.None, 'Ruling already made');

        metadata.ruling = _ruling;
        metadata.compensation = _compensation;
        metadata.closedAt = block.timestamp;

        emit CaseClosed(metadata.judge, _ruling, _compensation);
        if (s_subscriptionId != 0) {
            removeConsumer(address(this));
        }
    }

    function withdrawCompensation() public {
        require(metadata.closedAt != 0, 'Case is not closed yet');
        // require that the balance provided was nonzero when the case was created.
        require(metadata.compensation > 0, 'No compensation available');
        require(
            msg.sender == metadata.plaintiff.user ||
                msg.sender == metadata.defendant.user,
            'You are not entitled to compensation'
        );
        Ruling currentRuling = metadata.ruling;
        require(
            currentRuling == Ruling.PlaintiffWins &&
                msg.sender == metadata.plaintiff.user,
            'You are not entitled to compensation'
        );
        require(
            currentRuling == Ruling.DefendantWins &&
                msg.sender == metadata.defendant.user,
            'You are not entitled to compensation'
        );

        uint256 amount = metadata.compensation;
        metadata.compensation = 0;

        payable(msg.sender).transfer(amount);
    }

    string private prompt;

    function onOracleLlmResponse(
        uint runId,
        string memory response,
        string memory /*errorMessage*/
    ) public onlyOracle {
        // Logic to handle response
        // For simplicity, let's assume response is just logged
        metadata.recommendation = response;
    }

    function getMessageHistoryContents(
        uint chatId
    ) public view returns (string[] memory) {
        // get prompt as single message
        string[] memory messages = new string[](1);
        messages[0] = prompt;
        return messages;
    }

    function getMessageHistoryRoles(
        uint chatId
    ) public pure returns (string[] memory) {
        // get prompt as single message
        string[] memory roles = new string[](1);
        roles[0] = 'user';
        return roles;
    }

    function getRecommendation(string memory _prompt) public onlyJudge {
        prompt = _prompt;
        IOracle(galadrielOracle).createLlmCall(1);
    }

    // get metadata
    function getMetadata() public view returns (Metadata memory) {
        return metadata;
    }
}
