import LocationOnIcon from "@mui/icons-material/LocationOn";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Container, Stack, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import "../../../css/order.css";
import FinishedOrders from "./FinishedOrders";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";

import { Dispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { useGlobals } from "../../hooks/useGlobal";
import OrderService from "../../services/OrderService";
import { setFinishedOrders, setPausedOrders, setProcessOrders } from './slice';



/** Redux Slice & Selector **/
const actionDispatch = (dispatch: Dispatch)=>({
  setPausedOrders:(data:Order[])=>dispatch(setPausedOrders(data)),
  setProcessOrders:(data:Order[])=> dispatch(setProcessOrders(data)),
  setFinishedOrders:(data: Order[]) => dispatch(setFinishedOrders(data))
});



export default function OrdersPage() {
  const {setPausedOrders, setProcessOrders, setFinishedOrders} = 
  actionDispatch(useDispatch());

  const {orderBuilder, authMember, authReady} = useGlobals();
  const history = useHistory();
  const [value, setValue] = useState("1");
const [orderInquiry ,setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PENDING,
  });

  useEffect(() => {
    if (!authReady || !authMember) return;
    const order = new OrderService();
    
    order
    .getMyOrders({...orderInquiry, orderStatus: OrderStatus.PENDING})
    .then((data) => setPausedOrders(data))
    .catch((err) => console.log(err));

     order
     .getMyOrders({...orderInquiry, orderStatus: OrderStatus.PROCESS})
    .then((data) => setProcessOrders(data))
    .catch((err) => console.log(err));

     order
     .getMyOrders({...orderInquiry, orderStatus: OrderStatus.FINISH})
    .then((data) => setFinishedOrders(data))
    .catch((err) => console.log(err));

  }, [orderInquiry, orderBuilder, authReady, authMember]);


  /**HANDLERS */

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (authReady && !authMember) history.replace("/");
  }, [authReady, authMember, history]);

  if (!authReady || !authMember) return null;

  return (
    <div className="order-page">
      <Container className="order-container">
        {/* LEFT SIDE: Tabs and Order Lists */}
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="order tabs"
                  className="table_list"
                >
                  <Tab label="PAUSED ORDERS" value="1" />
                  <Tab label="PROCESS ORDERS" value="2" />
                  <Tab label="FINISHED ORDERS" value="3" />
                </Tabs>
              </Box>
            </Box>

            <Stack className="order-main-content">
              <TabPanel value="1">
                <PausedOrders  setValue={setValue}/>
              </TabPanel>
              <TabPanel value="2">
                <ProcessOrders setValue={setValue} />
              </TabPanel>
              <TabPanel value="3">
                <FinishedOrders  />
              </TabPanel>
            </Stack>
          </TabContext>
        </Stack>

     
        <Stack className="order-right">

          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img src= {  authMember?.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg" } className="order-user-avatar" alt="User" />
                <div className="order-user-icon-box">
                  <img src= { authMember?.memberType === MemberType.ADMIN
                   ? "/icons/restaurant.svg"
                   :"/icons/user-badge.svg"}
                   className="order-user-prof-img" alt="Badge" />
                </div>
              </div>
              <span className="order-user-name">{authMember?.memberNick}</span>
              <span className="order-user-prof">{authMember?.memberType}</span>
            </Box>

            <div className="liner"></div>

            <Box className="order-user-address">
              <LocationOnIcon style={{ color: "#a1a1a1" }} />
              <span className="spec-address-txt">{authMember?.memberAddress ?authMember.memberAddress:"Do not exist"}</span>
            </Box>
          </Box>

          {/* BOX 2: Payment Details */}
          <Box 
            className="order-info-box" 
            sx={{ 
              mt: "15px", 
              boxSizing: "border-box", 
              width: "360px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center" 
            }}
          >
            <input type="text" className="card-input" placeholder="Card Number: 0000 0000 0000 0000" />
            
            <div className="cards-box">
              <input type="text" className="card-half-input" placeholder="07/24" />
              <input type="text" className="card-half-input" placeholder="CVV" />
            </div>
            
            <input type="text" className="card-input" placeholder="Card Holder Name" />
            
            <Box className="payment-icons-row" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: '20px' }}>
              <img src="/icons/western-card.svg" alt="western" style={{ height: '24px' }} />
              <img src="/icons/master-card.svg" alt="master" style={{ height: '24px' }} />
              <img src="/icons/paypal-card.svg" alt="paypal" style={{ height: '24px' }} />
              <img src="/icons/visa-card.svg" alt="visa" style={{ height: '24px' }} />
            </Box>
          </Box>
        </Stack> {/* FIXED: Added missing closing Stack */}
      </Container> {/* FIXED: Added missing closing Container */}
    </div> /* FIXED: Added missing closing div */
  );
} /* FIXED: Added missing closing brace for the function */