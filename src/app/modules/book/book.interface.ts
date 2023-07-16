import { Model } from 'mongoose';

export type BookGenres =
  | 'Novel'
  | 'Narrative'
  | 'Science fiction'
  | 'Genre fiction'
  | 'Mystery'
  | 'Historical Fiction'
  | 'Romance novel'
  | 'Thriller'
  | 'Horror fiction'
  | 'Fantasy Fiction'
  | 'Literary fiction'
  | 'Fantasy'
  | 'Graphic novel'
  | 'Short Story'
  | 'Action fiction'
  | 'Historical fantasy'
  | 'Humor'
  | 'Adventure fiction'
  | 'Magical Realism'
  | 'Contemporary literature'
  | 'Dystopian Fiction'
  | 'Western fiction'
  | 'Crime Thriller'
  | 'Memoir'
  | 'Self-help book'
  | 'History'
  | 'Biography'
  | 'True crime'
  | 'Spirituality'
  | 'Essay'
  | 'Politics'
  | 'Social science'
  | 'Prose'
  | 'Creative nonfiction'
  | 'Cookbook'
  | "Children's literature"
  | 'Travel literature'
  | 'Speculative fiction'
  | 'Fairy tale'
  | 'Paranormal romance';

export type IBook = {
  title: string;
  image: string;
  author: string;
  genre: BookGenres;
  publicationDate: string;
  reviews?: string[];
};

export type BookModel = Model<IBook, Record<string, unknown>>;
export type IBookFilters = { searchTerm?: string };
