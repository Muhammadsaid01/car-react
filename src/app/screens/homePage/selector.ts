import { createSelector} from "reselect"
import { AppRootState } from "../../../lib/types/screen"


const selectHomePage = (state: AppRootState ) => state.homePage;


export const retrievePopularDishes = createSelector (
    selectHomePage,
    (HomePage) => HomePage.popularDishes
);

export const retrieveNewDishes = createSelector (
    selectHomePage,
    (HomePage) => HomePage.newDishes
);

export const retrieveTopUsers = createSelector (
    selectHomePage,
    (HomePage) => HomePage.topUsers
);

// Update your retrieveProducts selector to look into homePage
export const retrieveProducts = (state: AppRootState) => state.homePage.products || [];
 
