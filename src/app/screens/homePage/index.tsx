import { useEffect } from 'react'
import "../../../css/home.css"
import ActiveUsers from './ActiveUsers'
import Advertisement from './Advertisement'
import Events from './Events'
import NewDishes from './NewDishes'
import PopularDishes from './PopularDishes'
import Statistics from './Statistics'


import { Dispatch } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { Product } from '../../../lib/types/product'
import { retrievePopularDishes } from './selector'
import { setPopularDishes } from './slice'
/** Redux Slice & Selector **/
const actionDispatch = (dispatch: Dispatch)=>({
  setPopularDishes:(data:Product[])=>dispatch(setPopularDishes(data)),
});
const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) =>({popularDishes})
);

export  default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch());
  const { popularDishes } = useSelector(popularDishesRetriever);


    useEffect(() => {},[]);



  return <div className={'homepage'}>
    <Statistics />
    <PopularDishes />
    <NewDishes />
    <Advertisement />
    <ActiveUsers />
    <Events />
  </div>;
}