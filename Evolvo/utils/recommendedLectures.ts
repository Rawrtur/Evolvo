export const recommendedLectures = (lectures: Lecture[]) => {
  return lectures
    .filter((l) => l.lastLecture !== undefined)
    .sort(
      (a, b) =>
        new Date(b.lastLecture).getDay() - new Date(a.lastLecture).getDay(),
    );
};
