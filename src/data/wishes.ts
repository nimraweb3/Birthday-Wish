export interface Wish {
  id: number;
  number: string;
  title: string;
  message: string;
}

export const wishes: Wish[] = [
  {
    id: 1,
    number: "01",
    title: "To Azeen",
    message:
      "Another year has passed, and somehow you've become even more you — brighter, sharper, more yourself than ever.",
  },
  {
    id: 2,
    number: "02",
    title: "The Constant",
    message:
      "Through every chaotic phase and quiet season, you've stayed the one thing I never had to question.",
  },
  {
    id: 3,
    number: "03",
    title: "This Year",
    message:
      "May this year bring you exactly what you've been chasing quietly, and none of what you've been carrying loudly.",
  },
  {
    id: 4,
    number: "04",
    title: "Always",
    message:
      "Whatever changes around us, this stays the same — I'm rooting for you, today and every day after.",
  },
  {
    id: 5,
    number: "05",
    title: "Happy Birthday",
    message:
      "Here's to you, Azeen. To the version of you that exists now, and the one still becoming.",
  },
];