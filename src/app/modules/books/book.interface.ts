export type TGenre = "FICTION" | "NON-FICTION"| "SCIENCE"| "HISTORY"| "BIOGRAPHY"| "FANTASY";

export interface IBook {
  title: string;
  author: string;
  genre: TGenre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}
