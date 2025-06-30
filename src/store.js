import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import transactionReducer from './features/transactionSlice';
import dashboardReducer from './features/dashboardSlice';
import budgetReducer from './features/budgetSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        transaction: transactionReducer,
        dashboard: dashboardReducer,
        budget: budgetReducer,
    }
})

export default store;