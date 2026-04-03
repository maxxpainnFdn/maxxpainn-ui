import { AccountData } from "./AccountData";

export interface CommentData {
  accountId: number;
  account: AccountData;
  content: string;
  createdAt: Date;
  id: number;
  likesCount: number;
  parentId: number | null
  postId: number;
  repliesCount: number;
  likes?: Record<string, any>[] | null;
  updatedAt: Date;
}
