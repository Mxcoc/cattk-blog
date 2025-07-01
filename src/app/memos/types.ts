// /app/memos/types.ts

export interface User {
  displayName: string;
  avatarUrl: string;
}

export interface MemoLocation {
  placeholder: string;
}

export interface MemoResource {
  name: string;
  filename: string;
  type: string;
}

export interface Memo {
  name: string;
  creator: string;
  displayTime: string;
  content: string;
  resources: MemoResource[];
  location?: MemoLocation; 
}
