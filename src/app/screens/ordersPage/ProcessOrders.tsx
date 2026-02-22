import TabPanel from "@mui/lab/TabPanel"
import { Box, Button, Stack } from "@mui/material"
import moment from "moment"

export default function ProcessOrders() {
  return (
    <TabPanel value={"2"}>
      <Stack>
        {/* Main Orders Loop */}
        {[1, 2].map((ele, index) => (
          <Box key={index} className={"order-main-box"}>
            {/* Scrollable list of 2 items */}
            <Box className={"order-box-scroll"}>
              {[1, 2].map((ele2, index2) => (
                <Box key={index2} className={"orders-name-price"}>
                  <img
                    src="/img/kebab.webp"
                    className={"order-dish-img"}
                    alt="kebab"
                  />
                  <p className="title-dish">Kebab</p>
                  <Box className="price-box">
                    <p>$11</p>
                    <img src={"/icons/close.svg"} alt="close" />
                    <p>2 </p>
                    <img src="/icons/pause.svg" alt="pause" />
                    <p style={{ marginLeft: "15px" }}>$22</p>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Total Price Box moved INSIDE the card */}
            <Box className={"total-price-box"}>
              <Box className={"box-total"}>
                <p>Product price</p>
                <p>$22</p>
                <img 
                  src={"/icons/plus.svg"} 
                  style={{ marginLeft: "20px" }} 
                  alt="plus" 
                />
                <p>Delivery cost</p>
                <p>$2</p>
                <img
                  src={"/icons/pause.svg"}
                  style={{ marginLeft: "20px" }}
                  alt="pause icon"
                />
                <p>Total</p>
                <p>$24</p>
              </Box>

              {/* Date/Time and the blue Verify Button */}
              <p className={"data-compl"}>
                {moment().format("YY-MM-DD HH:mm")}
              </p>

              <Button 
                variant="contained" 
                className={"verify-button"}
                sx={{ backgroundColor: "#0288d1", color: "#ffffff" }}
              >
                Verify to Fulfil
              </Button>
            </Box>
          </Box>
        ))}

        {false && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img
              src={"/icons/noimage-list.svg"}
              style={{ width: 300, height: 300 }}
              alt="no images"
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}