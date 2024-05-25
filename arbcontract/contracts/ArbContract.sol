// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ArbContract {
    enum Ruling {
        None,
        PlaintiffWins,
        DefendantWins
    }

    // Struct that represents the case of the case.
    struct Metadata {
        address owner;
        string network;
        uint256 createdAt;
        string name;
        string description;
        // string cid; // optional cid pointer to attachment/s
        address plaintiff;
        address defendant;
        address judge;
        uint256 closedAt;
        uint256 compensation;
        Ruling ruling;
    }

    // metadata
    Metadata private metadata;

    modifier onlyJudge() {
        require(
            msg.sender == metadata.judge,
            'Only the judge can call this function'
        );
        _;
    }

    modifier onlyParties() {
        require(
            msg.sender == metadata.plaintiff ||
                msg.sender == metadata.defendant,
            'Only involved parties can call this function'
        );
        _;
    }

    // Event to log arbitration completion.
    event CaseClosed(
        address indexed judge,
        address indexed plaintiff,
        address indexed defendant,
        Ruling ruling,
        uint256 compensation
    );
    event EvidenceSubmitted(address indexed submitter, string evidence);

    // Map of address to string statement
    mapping(address => string) public statements;

    // Constructor to initialize the contract
    constructor(
        string memory _name,
        string memory _description,
        string memory _network,
        address _plaintiff,
        address _defendant,
        address _judge
    ) {
        metadata = Metadata(
            msg.sender,
            _network,
            block.timestamp,
            _name,
            _description,
            _plaintiff,
            _defendant,
            _judge,
            0,
            0,
            Ruling.None
        );
    }

    function submitEvidence(string memory _evidence) public onlyParties {
        // Logic to submit evidence
        // For simplicity, let's assume evidence is just logged
        emit EvidenceSubmitted(msg.sender, _evidence);
        statements[msg.sender] = _evidence;
    }

    function makeRuling(
        Ruling _ruling,
        uint256 _compensation
    ) public onlyJudge {
        require(metadata.ruling == Ruling.None, 'Ruling already made');

        metadata.ruling = _ruling;
        metadata.compensation = _compensation;
        metadata.closedAt = block.timestamp;

        emit CaseClosed(metadata.judge, metadata.plaintiff, metadata.defendant, _ruling, _compensation);
    }

    function withdrawCompensation() public {
        require(metadata.closedAt != 0, 'Case is not closed yet');
        // require that the balance provided was nonzero when the case was created.
        require(metadata.compensation > 0, 'No compensation available');
        require(
            msg.sender == metadata.plaintiff || msg.sender == metadata.defendant,
            'You are not entitled to compensation'
        );
        Ruling currentRuling = metadata.ruling;
        require(
            currentRuling == Ruling.PlaintiffWins && msg.sender == metadata.plaintiff,
            'You are not entitled to compensation'
        );
        require(
            currentRuling == Ruling.DefendantWins && msg.sender == metadata.defendant,
            'You are not entitled to compensation'
        );

        uint256 amount = metadata.compensation;
        metadata.compensation = 0;

        payable(msg.sender).transfer(amount);
    }

    // get metadata
    function getMetadata() public view returns (Metadata memory) {
        return metadata;
    }
}
