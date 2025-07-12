import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MyBudgetCircle = ({ percentage }) => {
  return (
    <div className="w-[120px] aspect-square sm:w-[130px] md:w-[150px]">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: "#6c2bd9",
          trailColor: "#e6e6fa",
          textColor: "#333",
          strokeLinecap: "round",
        })}
      />
    </div>
  );
};

export default MyBudgetCircle;
