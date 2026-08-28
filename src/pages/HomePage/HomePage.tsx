import "./HomePage.css";
import { Footer } from "../../components/Footer/Footer";
import { HomeProgress } from "../../components/HomeProgress/HomeProgress";
import { SemesterSubjects } from "../../components/SemesterSubjects/SemesterSubjects";
import { ExamOverview } from "../../components/ExamOverview/ExamOverview";
import { WeeklyUpdates } from "../../components/WeeklyUpdates/WeeklyUpdates";
import { UpcomingTasks } from "../../components/UpcomingTasks/UpcomingTasks";

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
