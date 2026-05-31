import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";

const initialState: HomePageState = {
    brandCars: [],
    newCars: [],
    topUsers: [],
    products: []
};

const homepageSlice = createSlice({
    name: "homePage", 
    initialState,
    reducers: {
        setBrandCars: (state, action) => { 
            state.brandCars = action.payload;
        },
        setNewCars: (state, action) => {
            state.newCars = action.payload;
        },
        setTopUsers: (state, action) => {
            state.topUsers = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        }
    },
});

export const { setBrandCars, setNewCars, setTopUsers, setProducts } = homepageSlice.actions;

const HomePageReducer = homepageSlice.reducer;
export default HomePageReducer;
