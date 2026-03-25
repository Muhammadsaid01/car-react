import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";

//**REDUX SLICE & SELECTOR
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <TabPanel value={"3"}>
      <Stack>
        {finishedOrders?.map((order: Order) => (
          <Box key={order._id} className={"order-main-box"}>
            <Box className={"order-box-scroll"}>
              {order?.orderItems?.map((item: OrderItem) => {
                const product: Product = order.productData.filter(
                  (ele: Product) => item.productId === ele._id
                )[0];
                
                const imagePath = product?.productImages?.[0] 
                  ? `${serverApi}/${product.productImages[0]}` 
                  : "/img/kebab.webp";

                // Fix 1: Added return here
                return (
                  <Box key={item._id} className={"orders-name-price"}>
                    <img
                      src={imagePath}
                      className="order-dish-img"
                      alt="dish"
                    />
                    <p className="title-dish">{product?.productName}</p>
                    <Box className="price-box">
                      <p>${item.itemPrice}</p>
                      <img src={"/icons/close.svg"} alt="close" />
                      <p>{item.itemQuantity} </p>
                      <img src="/icons/pause.svg" alt="pause" />
                      <p style={{ marginLeft: "15px" }}>
                        ${item.itemQuantity * item.itemPrice}
                      </p>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box className={"total-price-box"}>
              <Box className={"box-total"}>
                <p>Product price</p>
                <p>${order.orderTotal - order.orderDelivery}</p>
                <img
                  src={"/icons/plus.svg"}
                  style={{ marginLeft: "20px" }}
                  alt="plus"
                />
                <p>Delivery cost</p>
                <p>${order.orderDelivery}</p>
                <img
                  src={"/icons/pause.svg"}
                  style={{ marginLeft: "20px" }}
                  alt="pause"
                />
                <p>Total</p>
                <p>${order.orderTotal}</p>
              </Box>
            </Box>
          </Box>
        ))}

        {/* Fix 2, 3, & 4: Corrected brackets, variable name, and logic operator */}
        {(!finishedOrders || finishedOrders.length === 0) && (
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
          >
            <img
              src={"/icons/noimage-list.svg"}
              style={{ width: 300, height: 300 }}
              alt="no orders"
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}