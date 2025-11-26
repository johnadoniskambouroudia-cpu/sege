export interface TelegramGroup {
  id: string;
  name: string;
  description: string;
  link: string;
  category: string;
  estimatedMembers?: string;
  tags: string[];
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  results: TelegramGroup[];
  error: string | null;
  sources?: { uri: string; title: string }[];
}

export enum SearchSort {
  RELEVANCE = 'relevance',
  POPULARITY = 'popularity'
}