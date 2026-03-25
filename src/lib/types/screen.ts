/** REACT APP STATE **/

import OrdersPage from "../../app/screens/ordersPage";
import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";


export interface AppRootState {
    homePage: HomePageState;
    productsPage: ProductPageState;
    ordersPage: OrdersPageState;
   // productsPage: ProductsPageState;
}

/** HOMEPAGE **/

export interface HomePageState {
    popularDishes:  Product[];
    newDishes:Product[];
    topUsers: Member [];
}


/** PRODUCT PAGE **/

export interface ProductPageState {
    restaurant: Member | null;
    chosenProduct: Product | null ;
    products: Product[];
}

/**ORDERS PAGE   **/
export interface OrdersPageState{
    pausedOrders: Order[];
    processOrders: Order[];
    finishedOrders: Order[];
}