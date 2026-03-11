import { Member } from './member'
import { Product } from './product'
/** REACT APP **/
export interface AppRootState {
	homePage: HomePageState;
}
/** HOMEPAGE **/
export interface HomePageState {
	popularDishes: Product[];
	newDishes: Product[];
	topUsers: Member[];
}


/** Products Page **/

/** Orders Page **/

/** Help Page **/



