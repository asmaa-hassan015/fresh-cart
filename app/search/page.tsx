import { Metadata } from 'next';
import SearchResultsPage from './searchResultsPage';

export const metadata: Metadata = {
  title: 'Search Results | FreshCart',
  description: 'Find the products you are looking for',
};

export default function SearchPage() {
  return <SearchResultsPage />;
}