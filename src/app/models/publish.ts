export interface PublishResponse {
  id: number;
  title: string;
  category: number;
  link?: string;
  author?: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  guid?: string;
  sourceName?: string;
  sourceUrl?: string;
  language?: string;
  mediaContentUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  fetchedAt?: string;
  approved?: boolean;
  writerId?: number;
  sourceId?: number;
}
