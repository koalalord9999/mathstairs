export type LevelName = 'Pink' | 'Purple' | 'Blue' | 'Green' | 'Yellow' | 'Random Additions';

export interface Problem {
  question: string;
  answer: number;
}

export interface Level {
  name: LevelName;
  description: string;
  color: string;
  hoverColor: string;
  problems: Problem[];
}