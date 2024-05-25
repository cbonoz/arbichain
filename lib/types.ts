export interface RequestData {
    recipientName: string
    recipientAddress: string
    balance: number
    name: string
    description: string
    files: string[]
}

// struct Metadata {
//     address owner;
//     string network;
//     uint256 createdAt;
//     string name;
//     string description;
//     // string cid; // optional cid pointer to attachment/s
//     address plaintiff;
//     address defendant;
//     address judge;
//     uint256 closedAt;
//     uint256 compensation;
// }



export interface Evidence {
    user: string;
    cid: string;
    statement: string;
}

export interface ContractMetadata {
    owner: string
    network: string
    createdAt: number
    name: string
    description: string
    plaintiff: Evidence
    defendant: Evidence
    ruling: Ruling;
    judge: string
    closedAt: number
    compensation: number
    recommendation: string
}


export enum Ruling {
    PlaintiffWins,
    DefendantWins,
    None
}