import { AccountData } from "./AccountData";
import { ClanData } from "./ClanData";

export interface ActivityData {
  id:                   number;
  accountId:            number;
  type:                 string;
  group:                string;
  uid:                  string;
  clanId?:              number;
  referredAccountId?:   number;
  followedAccountId?:    number;

  params?:               Record<string, any>;   
  createdAt:             Date;   

  // ✅ Relations (no explicit relation names)
 // Named relations
  account?:               AccountData;
  clan?:                  ClanData;
  referredAccount?:       AccountData;  
  followedAccount?:       AccountData;

}