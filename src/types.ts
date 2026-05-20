export type LanguageType = 'Inglizcha' | 'Ruscha' | 'Nemischa' | 'Turkcha' | 'Arabcha';

export type CategoryType = 'Kundalik' | 'Texnologiya' | 'Biznes' | 'Sayohat' | 'Ta’lim';

export interface Word {
  id: string;
  word: string;
  translation: string;
  language: LanguageType;
  category: CategoryType;
  partOfSpeech: string;
  pronunciation: string;
  exampleOriginal: string;
  exampleTranslation: string;
  synonyms: string[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  isCustom?: boolean;
}

export interface DictionaryStats {
  totalWords: number;
  byLanguage: Record<LanguageType, number>;
  byCategory: Record<CategoryType, number>;
  favoriteCount: number;
  customCount: number;
}

export interface QuizQuestion {
  id: string;
  word: Word;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}
