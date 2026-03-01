import { IAccount } from "./IAccount";

export interface ClanData {
    id:                     number;
    name:                   string;
    slug:                   string;
    badge:                  string;
    accentColor:            string;
    image:                  string;
    tagline:                string;
    creatorAccountId:       number;
    creator:                IAccount;
    socials:                Record<string, any>;
    accentColor1?:          string;
    accentColor2?:          string;
    totalMembers:           number;
    totalMints:             number;
    isMember?:              boolean;
    rewardPerMintUsd:       number;
    totalEarnedUsd:         number;
    totalEarnedClaimedUsd:  number;
}
