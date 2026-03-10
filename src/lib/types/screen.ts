import { Member } from './member'
import { Product } from './product'
/** REACT APP **/
export interface AppRootState {
	homepage: HomePageState;
}
/** HOMEPAGE **/
export interface HomePageState {
	popularDishes: Product[];
	neDished: Product[];
	topUsers: Member[];
}


/** Products Page **/
	
/** Orders Page **/

/** Help Page **/



