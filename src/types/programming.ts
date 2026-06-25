export type LessonSection = {
  title: string;
  content?: string;
  code?: string;
  output?: string;
};

export type ProgrammingLesson = {
  id: string;
  title: string;
  sections: LessonSection[];
};

export type ProgrammingTopic = {
  id: string;
  title: string;
  description: string;
  lessons: ProgrammingLesson[];
};