import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MyBudgetCircle = ({ percentage }) => {
  return (
    <div style={{ width: 120, height: 120 }}>
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
