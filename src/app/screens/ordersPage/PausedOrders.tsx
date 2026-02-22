import TabPanel from "@mui/lab/TabPanel"
import { Box, Stack } from "@mui/material"
import Button from "@mui/material/Button"

export default function PausedOrders() {
  return (
    <TabPanel value={"1"}>
      <Stack>
        {/* Main Orders Loop */}
        {[1, 2].map((ele, index) => (
          <Box key={index} className={"order-main-box"}>
            {/* Scrollable section with 3 items */}
            <Box className={"order-box-scroll"}>
              {[1, 2, 3].map((ele2, index2) => (
                <Box key={index2} className={"orders-name-price"}>
                  <img
                    src="/img/lavash.webp"
                    className="order-dish-img"
                    alt="lavash"
                  />
                  <p className="title-dish">Lavash</p>
                  <Box className="price-box">
                    <p>$9</p>
                    <img src={"/icons/close.svg"} alt="close" />
                    <p>2 </p>
                    <img src="/icons/pause.svg" alt="pause" />
                    <p style={{ marginLeft: "15px" }}>$18</p>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Total Info Box moved inside the card */}
            <Box className={"total-price-box"}>
              <Box className={"box-total"}>
                <p>Product price</p>
                <p>$18</p>
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
                  alt="pause"
                />
                <p>Total</p>
                <p>$20</p>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={"cancel-button"}
                >
                  Cancel
                </Button>

                <Button variant="contained" className={"pay-button"}>
                  Payment
                </Button>
              </Stack>
            </Box>
          </Box>
        ))}

        {false && (
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