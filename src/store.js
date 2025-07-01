import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import transactionReducer from './features/transactionSlice';
import dashboardReducer from './features/dashboardSlice';
import budgetReducer from './features/budgetSlice';
import notificationReducer from './features/notificationSlice';
import statReducer from './features/statSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        transaction: transactionReducer,
        dashboard: dashboardReducer,
        budget: budgetReducer,
        notification: notificationReducer,
        stat: statReducer,
    }
})

export default store;