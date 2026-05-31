import VisibilityIcon from "@mui/icons-material/Visibility";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import { CssVarsProvider } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { ProductCondition } from "../../../lib/enums/product.enum";
import { Product } from "../../../lib/types/product";
import { retrieveNewCars } from "./selector";

//**REDUX SLICE & SELECTOR
const newCarsRetriever = createSelector(
  retrieveNewCars,
  (newCars) => ({ newCars })
);

export default function NewCars() {
  const { newCars } = useSelector(newCarsRetriever);

  return (
    <div className="new-products-frame">
      <Container>
        <Stack className="main">
          <Box className="category-title">New Cars</Box>
          <Stack className="cards-frame">
            <CssVarsProvider>
              {newCars.length !== 0 ? (
                newCars.map((product: Product) => { 
                  const imagePath = `${serverApi}/${product.productImages[0]}`; 
                  
                  // Logic for size vs volume display
                  const sizeVolume = 
                    product.productCondition === ProductCondition.NEW
                    ? `0`
                    : `${product.productMileage}l`;

                  return ( 
                    <Card key={product._id} variant="outlined" className="card">
                      <CardOverflow>
                        <div className="product-sale">{sizeVolume}</div>
                        <AspectRatio ratio={1}>
                          <img src={imagePath} alt={product.productName} />
                        </AspectRatio>
                      </CardOverflow>

                      <CardOverflow variant="soft" className="product-detail">
                        <Stack className="info">
                          <Stack flexDirection="row">
                            {/* FIX: Changed 'ele' to 'product' to match the map variable */}
                            <Typography className="title">{product.productName}</Typography>
                            <Divider width="2" height="24" bg="#d9d9d9" />
                            <Typography className="price">${product.productPrice}</Typography> 
                          </Stack>
                        </Stack>
                        <Typography className="views">
                          {product.productViews}
                          <VisibilityIcon sx={{ fontSize: 20, marginLeft: "5px" }} />
                        </Typography>
                      </CardOverflow>
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">New Cars are not available</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}