import { Category } from "./Categories";

export interface FeedDetail {
  Id?: number;
  Title: string;
  Summary?: string;
  Content?: string;
  ImageUrl?: string;
  Link?: string;
  Guid?: string;
  Category?: Category;
  SourceName?: string;
  SourceUrl?: string;
  Credit?: string;
  Language?: string;
  PublishedAt?: string; 
  PubDate?: string;     
  UpdatedAt?: string;
  WriterId?: number;
  WriterName?: string;
}
