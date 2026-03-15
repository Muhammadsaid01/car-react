import { Member } from './member'
import { Product } from './product'
/** REACT APP **/
export interface AppRootState {
	homePage: HomePageState;
	productsPage: ProductsPageState;
}
/** HOMEPAGE **/
export interface HomePageState {
	popularDishes: Product[];
	newDishes: Product[];
	topUsers: Member[];
}


/** Products Page **/
export interface ProductsPageState {
	restaurant:Member | null;
	products: Product[];
	chosenProduct:Product | null;
}

/** Orders Page **/

/** Help Page **/



