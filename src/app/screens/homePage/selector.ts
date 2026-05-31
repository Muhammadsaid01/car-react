import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";


const selectHomePage = (state: AppRootState ) => state.homePage;


export const retrieveBrandCars = createSelector (
    selectHomePage,
    (HomePage) => HomePage.brandCars
);

export const retrieveNewCars = createSelector (
    selectHomePage,
    (HomePage) => HomePage.newCars
);

export const retrieveTopUsers = createSelector (
    selectHomePage,
    (HomePage) => HomePage.topUsers
);

// Update your retrieveProducts selector to look into homePage
export const retrieveCars = (state: AppRootState) => state.homePage.products || [];
 
