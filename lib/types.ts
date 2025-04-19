export interface Prospect {
  name: string;
  age: number;
  graduationStatus: "graduated" | "undergraduate" | "postgraduate";
  graduationYear: number | null;
  phoneNumber: string;
  specialization: string;
}

export interface Message {
  sender: "AI" | "User";
  text: string;
  timestamp: Date;
  isFollowUp?: boolean; // Flag for follow-up actions
  transcription?: string;

}

