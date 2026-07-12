import { configureStore } from "@reduxjs/toolkit"
import userSliceReducer from "./UserSlice"

const Store = configureStore({
    reducer : {
        user : userSliceReducer
    }
})


export default Store