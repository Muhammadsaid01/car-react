import { Route, Switch, useLocation } from 'react-router-dom'
import "../css/app.css"
import "../css/footer.css"
import "../css/navbar.css"
import Footer from './components/footer'
import HomeNavbar from './components/headers/HomeNavbar'
import OtherNavbar from './components/headers/OtherNavbar'
import HelpPage from './screens/helpPage'
import HomePage from './screens/homePage/index'
import OrdersPage from './screens/ordersPage'
import ProductsPage from './screens/productsPage'
import UserPage from './screens/userPage'
function App() {
  const location = useLocation();
  console.log("location:",location);


  return (
    <>
       {location.pathname === "/" ? <HomeNavbar/> : <OtherNavbar/>}
        <Switch>
          <Route path="/products">
            <ProductsPage />
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/member-page">
            <UserPage />
          </Route>
           <Route path="/help">
            <HelpPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
        < Footer />
      </>
  );
}







export default App;





