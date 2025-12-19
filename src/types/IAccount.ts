
export interface IAccount {
  id:             number;
  address:        string;
  username:       string;
  desription:     string;
  website:        string;
  photo:          string;
  coverPhoto:     string;
  location:       string;
  rank:           number;
  referralCount:  number;
  painScore:      number;
  mintCount:      number;
  mintedAmount:   number;
  followerCount:  number;
  followingCount: number;
  isFollower?:    boolean; // if the current user is following the opened account
  badges:         Array<any>;
  createdAt:      Date;
}
