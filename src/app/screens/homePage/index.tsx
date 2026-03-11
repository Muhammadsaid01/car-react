import { useEffect } from 'react'
import "../../../css/home.css"
import ActiveUsers from './ActiveUsers'
import Advertisement from './Advertisement'
import Events from './Events'
import NewDishes from './NewDishes'
import PopularDishes from './PopularDishes'
import Statistics from './Statistics'

export  default function HomePage() {
    // Selector =>Store
    
    useEffect(() => {
      // Backend server data request => Data
      
      // Slice: Data => Store
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