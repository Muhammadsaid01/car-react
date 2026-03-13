import { useEffect } from 'react'
import "../../../css/home.css"
import ActiveUsers from './ActiveUsers'
import Advertisement from './Advertisement'
import Events from './Events'
import NewDishes from './NewDishes'
import PopularDishes from './PopularDishes'
import Statistics from './Statistics'


import { Dispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { ProductCollection } from '../../../lib/enums/product.enum'
import { Product } from '../../../lib/types/product'
import ProductService from '../../services/ProductService'
import { setPopularDishes } from './slice'
/** Redux Slice & Selector **/
const actionDispatch = (dispatch: Dispatch)=>({
  setPopularDishes:(data:Product[])=>dispatch(setPopularDishes(data)),
});



export  default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch());



    useEffect(() => {
      //Backend server data fetch => Data
      const product= new ProductService();
      product.getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        productCollection: ProductCollection.DISH,
      }).then((data)=>{
        console.log("Data passed here:", data);
        setPopularDishes(data);
      }).catch((err) => console.log(err));
    },[]);


  return <div className={'homepage'}>
    <Statistics />
    <PopularDishes />
    <NewDishes />
    <Advertisement />
    <ActiveUsers />
    <Events />
  </div>;
}