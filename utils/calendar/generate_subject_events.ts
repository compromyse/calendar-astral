export function generateSubjectEvents(
  subject_id: string,
  user_id: string,
  title: string,
  numberOfLessons: number,
  days: number[],
  startDate: Date
) {
  const currentDate = new Date(startDate);
  
  const lessons = [];
  let lessonCount = 0;

  while (lessonCount < numberOfLessons) {
    const dayOfWeek = currentDate.getDay() - 1;
    
    if (dayOfWeek >= 0 && dayOfWeek < 5 && days[dayOfWeek] === 1) {
      lessons.push({
        subject_id: subject_id,
        user_id: user_id,
        title: `${title} - ${lessonCount + 1}`,
        date: new Date(currentDate)
      });

      lessonCount++;
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return lessons;
}
