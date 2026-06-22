export type BookChapter = {
  id: string;
  title: string;
  startPage: number;
  endPage: number;
};

export type Book = {
  id: string;
  title: string;
  shortTitle: string;
  chapters: BookChapter[];
};

export const tma4412Book: Book = {
  id: "logiske-metoder",
  title: "Logiske metoder",
  shortTitle: "RA",
  chapters: [
    { id: "ra-1", title: "RA kap. 1", startPage: 7, endPage: 18 },
    { id: "ra-2", title: "RA kap. 2", startPage: 19, endPage: 28 },
    { id: "ra-3", title: "RA kap. 3", startPage: 29, endPage: 40 },
    { id: "ra-4", title: "RA kap. 4", startPage: 41, endPage: 50 },
    { id: "ra-5", title: "RA kap. 5", startPage: 51, endPage: 64 },
    { id: "ra-6", title: "RA kap. 6", startPage: 65, endPage: 76 },
    { id: "ra-7", title: "RA kap. 7", startPage: 77, endPage: 88 },
    { id: "ra-8", title: "RA kap. 8", startPage: 89, endPage: 98 },
    { id: "ra-9", title: "RA kap. 9", startPage: 99, endPage: 110 },
    { id: "ra-10", title: "RA kap. 10", startPage: 111, endPage: 122 },
    { id: "ra-11", title: "RA kap. 11", startPage: 123, endPage: 136 },
    { id: "ra-12", title: "RA kap. 12", startPage: 137, endPage: 148 },
    { id: "ra-17", title: "RA kap. 17", startPage: 191, endPage: 202 },
    { id: "ra-18", title: "RA kap. 18", startPage: 203, endPage: 214 },
    { id: "ra-19", title: "RA kap. 19", startPage: 215, endPage: 222 },
    { id: "ra-21", title: "RA kap. 21", startPage: 231, endPage: 242 },
    { id: "ra-22", title: "RA kap. 22", startPage: 243, endPage: 252 },
    { id: "ra-23", title: "RA kap. 23", startPage: 253, endPage: 276 },
  ],
};