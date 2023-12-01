export type ExerciseInput = {
  userId: string;
  description: string;
  duration: number;
  dateString: string;
};

export type Logs = {
  username: string;
  count: number;
  _id: string;
  log: object[];
};
