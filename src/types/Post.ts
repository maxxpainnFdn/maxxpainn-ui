import { AccountData } from "./AccountData";
import { ClanData } from "./ClanData";

type PostStatus = 'PUBLIC' | 'PRIVATE' | 'UNLISTED' | 'SUSPENDED'
type PostType = 'standard' | 'nft' | 'pain_story'

export interface Post {
  params: Record<string, any>;
  status: PostStatus;
  id: number;
  type: PostType;
  clanId: number | null;
  clan: ClanData | null;
  content: string;
  updatedAt: Date;
  createdAt: Date;
  accountId: number;
  account?: AccountData;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  collectionId: number | null;
  tags: string[];
  likes?: Record<string, any>[] | null;
  comments?: Record<string, any>[] | null;
  bookmarks?: Record<string, any>[] | null;
}
