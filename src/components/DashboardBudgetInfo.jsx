import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getBudget } from "../features/budgetSlice";

const DashboardBudgetInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const budget = useSelector((state) => state.budget);

  useEffect(() => {
    const date = new Date();
    dispatch(getBudget({ month: date.getMonth(), year: date.getFullYear() }));
  }, []);

  useEffect(() => {
    console.log("Budget:", budget);
  }, [budget]);

  return <div></div>;
};

export default DashboardBudgetInfo;
