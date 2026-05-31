/* eslint-disable jsx-a11y/iframe-has-title */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Container, Stack } from "@mui/material";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Dispatch } from "@reduxjs/toolkit";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSelector } from "reselect";
import { serverApi } from "../../../lib/config";
import { ProductCollection, ProductCondition } from "../../../lib/enums/product.enum";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";
import { retrieveProducts } from "./selector";
import { setProducts } from "./slice";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));



interface ProductsProps {
  onAdd: (item: CartItem) =>  void;
}

export default function Products(props: ProductsProps) {
  const { onAdd}= props;

  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.SEDAN,
    search: "",
  });

  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
  if (searchText === "") {
    productSearch.search = "";
    setProductSearch({ ...productSearch });
  }
  }, [searchText]);

  /** HANDLERS **/
  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (order: string) => {
  productSearch.page = 1;
  productSearch.order = order;
  setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
  productSearch.search = searchText;
  setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
  productSearch.page = value;
  setProductSearch({ ...productSearch });
  };

  const chooseDishHandler =(id: string) => {history.push(`/products/${id}`);};


  return (
    <div className={"products"}>
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"avatar-big-box"}>
            <Stack className={"top-text"}>
              <p>BUGATTI</p>
              <Stack className={"single-search-form"}>
                <input
                  type={"search"}
                  className={"single-search-input"}
                  name={"singleResearch"}
                  placeholder={"Type here"}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") searchProductHandler();
                  }}
                />
                <Button
                  className={"single-button-search"}
                  variant={"contained"}
                  endIcon={<SearchIcon />}
                  onClick={searchProductHandler}
                >
                  Search
                </Button>
              </Stack>
            </Stack>
          </Stack>

                <Stack className={"dishes-filter-section"}>
                  <Stack className={"dishes-filter-box"}>
                    <Button
                      variant={"contained"}
                      className={"order"}
                      color={
                        productSearch.order === "createdAt" ? "primary" : "secondary"
                      }
                      onClick={() => searchOrderHandler("createdAt")}
                    >
                      New
                    </Button>
                    <Button
                      variant={"contained"}
                      className={"order"}
                      color={
                        productSearch.order === "productPrice" ? "primary" : "secondary"
                      }
                      onClick={() => searchOrderHandler("productPrice")}
                    >
                      Price
                    </Button>
                    <Button
                      variant={"contained"}
                      className={"order"}
                      color={
                        productSearch.order === "productViews" ? "primary" : "secondary"
                      }
                      onClick={() => searchOrderHandler("productViews")}
                    >
                      Views
                    </Button>
                  </Stack>
                </Stack>

                <Stack className={"list-category-section"}>
                    <Stack className={"product-category"}>
                        <div className={"category-main"}>
                            <Button
                              variant={"contained"}
                              color={
                                productSearch.productCollection === ProductCollection.OTHER
                                  ? "primary"
                                  : "secondary"
                              }
                              onClick={() => searchCollectionHandler(ProductCollection.OTHER)}
                              >
                              Other
                            </Button>
                            <Button
                              variant={"contained"}
                              color={
                                productSearch.productCollection === ProductCollection.HATCHBACK
                                  ? "primary"
                                  : "secondary"
                              }
                              onClick={() => searchCollectionHandler(ProductCollection.HATCHBACK)}
                              >
                              Hatchback
                            </Button>
                            <Button
                              variant={"contained"}
                              color={
                                productSearch.productCollection === ProductCollection.TRUCK
                                  ? "primary"
                                  : "secondary"
                              }
                              onClick={() => searchCollectionHandler(ProductCollection.TRUCK)}
                              >
                              Truck
                            </Button>
                            <Button
                              variant={"contained"}
                              color={
                                productSearch.productCollection === ProductCollection.SPORT_CAR
                                  ? "primary"
                                  : "secondary"
                              }
                              onClick={() => searchCollectionHandler(ProductCollection.SPORT_CAR)}
                              >
                              Sport Car
                            </Button>
                            <Button
                              variant={"contained"}
                              color={
                                productSearch.productCollection === ProductCollection.SEDAN
                                  ? "primary"
                                  : "secondary"
                              }
                              onClick={() => searchCollectionHandler(ProductCollection.SEDAN)}
                              >
                              Sedan
                            </Button>
                        </div>
                    </Stack>

                    <Stack className={"product-wrapper"}>
                        {products.length !== 0 ? (
                            products.map((product: Product) => {
                              const imagePath = `${serverApi}/${product.productImages[0]}`;
                              const secondHand = 
                              product.productCondition === ProductCondition.USED ?  " USED " : "NEW";
                                return (
                                    <Stack key={product._id} className={"product-card"}
                                    onClick={() => chooseDishHandler(product._id)}>
                                        <Stack
                                        className={"product-img"}
                                        sx={{backgroundImage: `url(${imagePath})`}}
                                        >
                                            <div className={"product-sale"}>{secondHand}</div>
                                            <Button className={"shop-btn"}
                                            onClick={(e) => {
                                             
                                              onAdd({
                                                _id: product._id,
                                                quantity: 1,
                                                name: product.productName,
                                                price: product.productPrice,
                                                image: product.productImages[0],
                                              });
                                              e.stopPropagation();
                                              
                                            }}>
                                            

                                                <img 
                                                src={"/icons/shopping-cart.svg"}
                                                style={{ display: "flex"}} alt="Add to Cart"/>
                                            </Button>
                                            <Button className={"view-btn"} sx={{right: "36px"}}>
                                            <Badge badgeContent={product.productViews} color="secondary">
                                                <RemoveRedEyeIcon
                                                sx={{
                                                    color: product.productViews === 0 ? "gray" : "white",
                                                }}
                                                />
                                            </Badge>
                                            </Button>
                                            </Stack>
                                            <Box className={"product-desc"}>
                                                <span className={"product-title"}>
                                                    {product.productName}
                                                </span>
                                                <div className={"product-desc"}>
                                                    <MonetizationOnIcon />
                                                    {product.productPrice}
                                                </div>
                                            </Box>
                                            </Stack>
                                );
                            })
                        ) : (
                            <Box className="no-data">Cars are not available!</Box>
                        )}
                    </Stack>
                </Stack>

                <Stack className={"pagination-section"}>
                  <Pagination
                    count={
                      products.length !== 0
                        ? productSearch.page + 1
                        : productSearch.page
                    }
                    page={productSearch.page}
                    renderItem={(item) => (
                      <PaginationItem
                        components={{
                          previous: ArrowBackIcon,
                          next: ArrowForwardIcon,
                        }}
                        {...item}
                        color={"secondary"}
                      />
                    )}
                    onChange={paginationHandler}
                  />
                </Stack>
          </Stack>
        </Container>

        <div className={"brands-logo"}>
  <Container>
    <Box className={"brands-title"}>Curated Timepiece Highlights</Box>
    {/* Use a div instead of Stack to ensure CSS Grid takes full control */}
    <div className={"video-grid"}>
      <Box className={"video-box"}>
        <video src={"/video/BMW.mp4"} autoPlay loop muted playsInline />
      </Box>
      <Box className={"video-box"}>
        <video src={"/video/Bugatti.mp4"} autoPlay loop muted playsInline />
      </Box>
      <Box className={"video-box"}>
        <video src={"/video/Lamborghini.mp4"} autoPlay loop muted playsInline />
      </Box>
      <Box className={"video-box"}>
        <video src={"/video/Benz.mp4"} autoPlay loop muted playsInline />
      </Box>
    </div>
  </Container>
</div>

        <div className={"address"}>
            <Container>
                <Stack className={"address-area"}>
                    <Box className={"title"}>Our address</Box>
                    <iframe
                    style={{marginTop: "60px" }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.045733255449!2d69.23497807646164!3d41.30786870092324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8ba862628adf%3A0x35cbda4b6948a351!2sKamolon%20Osh!5e0!3m2!1sen!2skr!4v1771503124621!5m2!1sen!2skr" 
                    width="1320"
                    height="500"
                    referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </Stack>
            </Container>
        </div>
    </div>
  );
}