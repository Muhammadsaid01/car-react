/**Product**/
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import SearchIcon from "@mui/icons-material/Search"
import { Badge, Box, Button, Container, Pagination, PaginationItem, Stack } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"

import { Dispatch } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createSelector } from "reselect"
import { serverApi } from '../../../lib/config'
import { ProductCollection } from '../../../lib/enums/product.enum'
import { Product, ProductInquery } from '../../../lib/types/product'
import { CartItem } from '../../../lib/types/search'
import ProductService from '../../services/ProductService'
import { retrieveProducts } from './selector'
import { setProducts } from './slice'


/** Redux Slice & Selector **/
const actionDispatch = (dispatch: Dispatch)=>({
  setProducts:(data:Product[])=>dispatch(setProducts(data)),
});

const productsRetriever = createSelector(
  retrieveProducts,
  (products) =>({products})
);

const brands = [
  { name: "GURME", image: "/img/gurme.webp" },
  { name: "SEAFOOD", image: "/img/seafood.webp" },
  { name: "SWEETS", image: "/img/sweets.webp" },
  { name: "DÖNER", image: "/img/doner.webp" },
];


interface ProductsPageProps {
  onAdd : (item :CartItem) => void;
}


export default function Products(props: ProductsPageProps) {
const {onAdd } = props;
const { setProducts } = actionDispatch(useDispatch());
const {products} = useSelector(productsRetriever);
const [ productSearch, setProductSearch]  = useState<ProductInquery>(
  {
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.DISH,
    search: "",
  }
);
 const [searchText, setSearchText] = useState<string>("");
 const history = useHistory();

useEffect (() => {
  const product = new ProductService();
  product
  .getProducts(productSearch)
  .then(data => setProducts(data))
  .catch((err) => console.log(err));
}, [productSearch]);

useEffect(() => {
  if (searchText === "") {
    productSearch.search = "";
    setProductSearch({ ...productSearch});
  }
}, [searchText]);

/** HANDLERS **/

const searchCollectionHandler = (collection:ProductCollection) => {
  productSearch.page = 1;
  productSearch.productCollection = collection;
  setProductSearch({ ...productSearch});
};

const searchOrderHandler = (order: string) => {
  productSearch.page = 1;
  productSearch.order = order;
  setProductSearch({ ...productSearch});
}

const searchProductHandler = () => {
  productSearch.search = searchText;
  setProductSearch({...productSearch});
};

const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
};

const paginationHandler = (e: ChangeEvent<any>, value:number) => {
  productSearch.page = value;
  setProductSearch({...productSearch});
};
const chooseDishHandler = (id: string) => {
  history.push(`/products/${id}`);
};
  const filteredProducts = products.filter  ((product) =>
    product.productName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="products">
        <Container>
          <Stack className="avatar-big-fox">
            <Stack className="top-text">
              <p>Burak Restaurant</p>
              <Box className="single-search-big box">
                <Stack className="single-search-form">
                  <input
                    type="search"
                    className="single-search-input"
                    placeholder="Type here"
                    value={searchText}
                    onChange={handleSearchInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") searchProductHandler();
                    }}
                  />
                  <Button className={"single-button-search"}
                  variant='contained'
                  endIcon = { <SearchIcon />}
                  onClick={searchProductHandler}>
                    SEARCH
                  </Button>
                </Stack>
              </Box>
            </Stack>

            <Stack className="dishes-filter-section">
              <Stack className="dishes-filter-box">
                <Button variant="contained" color={
                  productSearch.order === "createdAt"
                  ?"primary" 
                  : "secondary"}
                   className="order"
                onClick={
                  ()=> searchOrderHandler('createdAt')}
                  >New</Button>
                <Button variant="contained" color={productSearch.order === "productPrice"?"primary" : "secondary"}
                 className="order" onClick={()=> searchOrderHandler('productPrice')}>Price</Button>
                <Button variant="contained" color={productSearch.order === "productViews"?"primary" : "secondary"} className="order"
                 onClick={
                  () => searchOrderHandler('productViews')}>Views</Button>
              </Stack>
            </Stack>

            <Stack className="list-category-section">
              <Stack className="product-category">
                <div className="category-main">
                  <Button variant="contained" color={
                    productSearch.productCollection ===  ProductCollection.OTHER
                     ? "primary"
                     : "secondary"}
                   onClick={() => searchCollectionHandler(ProductCollection.OTHER)}
                   >Other</Button>
                  <Button variant="contained" color={
                    productSearch.productCollection ===  ProductCollection.DESERT
                     ? "primary"
                     : "secondary"}
                  onClick={() => searchCollectionHandler(ProductCollection.DESERT)}
                  >Dessert</Button>
                  <Button variant="contained" color={
                    productSearch.productCollection ===  ProductCollection.DRINK
                     ? "primary"
                     : "secondary"}
                  onClick={() => searchCollectionHandler(ProductCollection.DRINK)}
                  >Drink</Button>
                  <Button variant="contained" color={
                    productSearch.productCollection ===  ProductCollection.SALAD
                     ? "primary"
                     : "secondary"}
                  onClick={() => searchCollectionHandler(ProductCollection.SALAD)}
                  >Salad</Button>
                  <Button variant="contained" color={
                    productSearch.productCollection ===  ProductCollection.DISH
                     ? "primary"
                     : "secondary"}
                  onClick={() => searchCollectionHandler(ProductCollection.DISH)}
                  >Dish</Button>
                </div>
              </Stack>

              <Stack className="product-wrapper">
                {filteredProducts.length !== 0 ? (
                  filteredProducts.map((product: Product) => {
                    const imagePath = `${serverApi}/${product.productImages[0]}`;
                    const sizeVolume = product.productCollection === ProductCollection.DRINK ? product.productVolume + "l" : product.productSize + " size";
                    return (
                      <Stack key={product._id}
                       className="product-card"
                       onClick ={()=> chooseDishHandler(product._id)}>
                        <Stack
                          className="product-img"
                          sx={{ backgroundImage: `url(${imagePath})` }}
                        >
                          <div className="product-sale">{sizeVolume}</div>
                          <Button className="shop-btn" onClick={(e) => {
                             console.log("BUTTON PRESSED!");
                             onAdd({
                              _id:  product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                             });
                             e.stopPropagation();
                          }}>
                            <img src="/icons/shopping-cart.svg" alt="cart" />
                          </Button>
                          <Button className="view-btn">
                            <Badge badgeContent={product.productViews} color="secondary">
                              <RemoveRedEyeIcon sx={{ color: product.productViews === 0 ? "grey" : "white" }} />
                            </Badge>
                          </Button>
                        </Stack>
                        <Box className="product-desc">
                          <span className="product-title">{product.productName}</span>
                          <div className="product-desc">
                            <MonetizationOnIcon />
                            {product.productPrice}
                          </div>
                        </Box>
                      </Stack>
                    );
                  })
                ) : (
                  <Box className="no-data">Products are not available!</Box>
                )}
              </Stack>
            </Stack>

            <Stack className="pagination-section">
              <Pagination
                count={products.length !== 0 ? productSearch.page + 1 
                  : productSearch.page}
                page={productSearch.page}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    color="secondary"
                  />
                )}
                onChange={paginationHandler}
              />
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className="brands-logo">
        <Container>
          <Stack flexDirection="column" alignItems="center">
            <Box className="brands-title">Our Family Brands</Box>
            <Stack className="brands-wrapper" flexDirection="row">
              {brands.map((brand, index) => (
                <Box key={index} className="brand-card">
                  <img src={brand.image} alt={brand.name} className='b' />
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className="address">
        <Container>
          <Stack className="address-area">
            <Box className="title">Our address</Box>
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?..."
              width="100%"
              height="500"
              style={{ marginTop: "60px", border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}


