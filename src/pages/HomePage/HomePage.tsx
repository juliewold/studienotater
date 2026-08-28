import "./HomePage.css";
import { Footer } from "../../components/layout/Footer/Footer";
import { HomeProgress } from "../../components/home/HomeProgress/HomeProgress";
import { SemesterSubjects } from "../../components/subjects/SemesterSubjects/SemesterSubjects";
import { ExamOverview } from "../../components/exams/ExamOverview/ExamOverview";
import { WeeklyUpdates } from "../../components/home/WeeklyUpdates/WeeklyUpdates";
import { UpcomingTasks } from "../../components/home/UpcomingTasks/UpcomingTasks";

export const HomePage = () => {
  return (
    <>
      <WeeklyUpdates />

      <SemesterSubjects />

      <div className="home-dashboard-grid">
        <UpcomingTasks />

        <HomeProgress />
      </div>

      <ExamOverview />

      <Footer />
    </>
  );
};
