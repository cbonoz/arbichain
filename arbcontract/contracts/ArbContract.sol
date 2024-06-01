// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IOracle {
    function createLlmCall(
        uint promptId
    ) external returns (uint);
}

contract ArbContract {
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
        Ruling ruling;
    }

    // metadata
    Metadata private metadata;

    modifier onlyOracle() {
        require(msg.sender == galadrielOracle, "Caller is not oracle");
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


    // Event to log arbitration completion.
    event CaseClosed(
        address indexed judge,
        Ruling ruling,
        uint256 compensation
    );
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
    ) {
        metadata = Metadata(
            msg.sender,
            _network,
            block.timestamp,
            _name,
            _description,
            Evidence(_plaintiff, "", "", ""),
            Evidence(_defendant, "", "", ""),
            _judge,
            0,
            0,
            "",
            Ruling.None
        );
        galadrielOracle = _galadrielOracle;
    }

    function submitEvidence(string memory _evidence, string memory _key, string memory _cid) public onlyParties {
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
    }

    function withdrawCompensation() public {
        require(metadata.closedAt != 0, 'Case is not closed yet');
        // require that the balance provided was nonzero when the case was created.
        require(metadata.compensation > 0, 'No compensation available');
        require(
            msg.sender == metadata.plaintiff.user || msg.sender == metadata.defendant.user,
            'You are not entitled to compensation'
        );
        Ruling currentRuling = metadata.ruling;
        require(
            currentRuling == Ruling.PlaintiffWins && msg.sender == metadata.plaintiff.user,
            'You are not entitled to compensation'
        );
        require(
            currentRuling == Ruling.DefendantWins && msg.sender == metadata.defendant.user,
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

    function getMessageHistoryContents(uint chatId) public view returns (string[] memory) {
        // get prompt as single message
        string[] memory messages = new string[](1);
        messages[0] = prompt;
        return messages;
    }

    function getMessageHistoryRoles(uint chatId) public view returns (string[] memory) {
        // get prompt as single message
        string[] memory roles = new string[](1);
        roles[0] = "user";
        return roles;
    }

    function getRecommendation(string memory _prompt) private {
        prompt = _prompt;
        IOracle(galadrielOracle).createLlmCall(1);
    }

    // get metadata
    function getMetadata(string memory _prompt) public returns (Metadata memory) {
        // if judge and prompt is non empty
        if (msg.sender == metadata.judge && bytes(_prompt).length > 0) {
            getRecommendation(_prompt);
        }
        return metadata;
    }
}
