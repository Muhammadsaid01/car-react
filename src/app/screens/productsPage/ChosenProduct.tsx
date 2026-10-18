/* eslint-disable jsx-a11y/alt-text */
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box, Container, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { Dispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import { A11y, FreeMode, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import Divider from "../../components/divider";
import MemberService from "../../services/MemberService";
import ProductService from "../../services/ProductService";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { setChosenProduct, setRestaurant } from "./slice";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({ restaurant })
);


interface ChosenProductsProps {
  onAdd: (item: CartItem) =>  void;
}



export default function ChosenProduct(props: ChosenProductsProps) {
 const {onAdd} = props;
  const { productId } = useParams<{ productId: string }>();
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const {chosenProduct} =useSelector(chosenProductRetriever);
  const {restaurant} = useSelector(restaurantRetriever);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => { if (active) setChosenProduct(data); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
    return () => { active = false; };
  }, [productId]);

  if (loading) return <Box className="no-data">Loading car...</Box>;
  if (failed || !chosenProduct) return <Box className="no-data">Car is not available.</Box>;

  return (
    <div className={"chosen-product"}>
      <Box className={"title"}>Product Detail</Box>
      <Container className={"product-container"}>
        <Stack className={"chosen-product-slider"}>
          <Swiper
            loop={chosenProduct.productImages.length > 1}
            spaceBetween={10}
            navigation={true}
            modules={[A11y, FreeMode, Navigation, Thumbs]}
            a11y={{ prevSlideMessage: "Previous car image", nextSlideMessage: "Next car image" }}
            className="swiper-area"
          >
            {chosenProduct?.productImages.map(
              (ele: string, index: number) => {
                const imagePath = `${serverApi}/${ele}`
                return (
                  <SwiperSlide key={index}>
                    <img className="slider-image" src={imagePath} alt={`${chosenProduct.productName} ${index + 1}`} />
                  </SwiperSlide>
                );
              }
            )}
          </Swiper>
        </Stack>
        <Stack className={"chosen-product-info"}>
          <Box className={"info-box"}>
            <strong className={"product-name"}>{chosenProduct?.productName}</strong>
            <span className={"resto-name"}>{chosenProduct?.productCategory}</span>
            <Box className={"rating-box"}>
              <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              <div className={"evaluation-box"}>
                <div className={"product-view"}>
                  <RemoveRedEyeIcon sx={{ mr: "10px" }} />
                  <span>{chosenProduct?.productViews}</span>
                </div>
              </div>
            </Box>
            <p className={"product-desc"}>{chosenProduct?.productDesc? chosenProduct?.productDesc : "No Description"}</p>
            <Divider height="1" width="100%" bg="#000000" />
            <div className={"product-price"}>
              <span>Price:</span>
              <span>${chosenProduct?.productPrice}</span>
            </div>
            <div className={"button-box"}>
              <Button variant="contained"
              onClick={(e) => {
                                             
                                              onAdd({
                                                _id: chosenProduct._id,
                                                quantity: 1,
                                                name: chosenProduct.productName,
                                                price: chosenProduct.productPrice,
                                                image: chosenProduct.productImages[0],
                                              });
                                              e.stopPropagation();
                                              
                                            }}  
              
              
              
              >Add To Basket</Button>
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
