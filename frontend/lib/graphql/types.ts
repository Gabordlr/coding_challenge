export enum Sentiment {
  HAPPY = "happy",
  SAD = "sad",
  NEUTRAL = "neutral",
  ANGRY = "angry",
}

export interface Note {
  id: string;
  text: string;
  sentiment: Sentiment;
  dateCreated: string;
  userId: string;
}

export interface NoteQueryResults {
  items: Note[];
  nextToken?: string | null;
  scannedCount: number;
}
