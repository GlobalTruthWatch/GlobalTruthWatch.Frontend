import { Category } from "./Categories";

// src/app/models/feed.ts
export interface Feed {
  id: number;
  title: string;
  category: Category;
  link: string;
  author: string | null;
  summary: string | null;
  content: string | null;
  imageUrl: string | null;
  guid: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  language: string | null;
  mediaContentUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  fetchedAt: string | null;
  approved: boolean;
  writerId: number | null;
  sourceId: number | null;
  writer: string | null;
  source: string | null;
}
