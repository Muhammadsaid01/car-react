import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import SearchIcon from "@mui/icons-material/Search"
import { Badge, Box, Button, Container, Pagination, PaginationItem, Stack } from "@mui/material"
import { ChangeEvent, useState } from "react"


const products = [
  { productName: "Cutlet", imagePath: "/img/cutlet.webp" },
  { productName: "Kebab Fresh", imagePath: "/img/kebab-fresh.webp" },
  { productName: "Kebab", imagePath: "/img/kebab.webp" },
  { productName: "Lavash", imagePath: "/img/lavash.webp" },
  { productName: "Gourmet Lavash", imagePath: "/img/lavash.webp" },
  { productName: "Spicy Cutlet", imagePath: "/img/cutlet.webp" },
  { productName: "Steak Kebab", imagePath: "/img/kebab.webp" },
  { productName: "Mixed Kebab", imagePath: "/img/kebab-fresh.webp" },
];

const brands = [
  { name: "GURME", image: "/img/gurme.webp" },
  { name: "SEAFOOD", image: "/img/seafood.webp" },
  { name: "SWEETS", image: "/img/sweets.webp" },
  { name: "DÖNER", image: "/img/doner.webp" },
];

export default function Products() {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
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
                  />
                  <Button className="single-button-search">
                    SEARCH <SearchIcon />
                  </Button>
                </Stack>
              </Box>
            </Stack>

            <Stack className="dishes-filter-section">
              <Stack className="dishes-filter-box">
                <Button variant="contained" color="primary" className="order">New</Button>
                <Button variant="contained" color="secondary" className="order">Price</Button>
                <Button variant="contained" color="secondary" className="order">Views</Button>
              </Stack>
            </Stack>

            <Stack className="list-category-section">
              <Stack className="product-category">
                <div className="category-main">
                  <Button variant="contained" color="secondary">Other</Button>
                  <Button variant="contained" color="secondary">Dessert</Button>
                  <Button variant="contained" color="secondary">Drink</Button>
                  <Button variant="contained" color="secondary">Salad</Button>
                  <Button variant="contained" color="primary">Dish</Button>
                </div>
              </Stack>

							<Stack className="product-wrapper">
                {filteredProducts.length !== 0 ? (
                  filteredProducts.map((product, index) => (
                    <Stack key={index} className="product-card">
                      <Stack
                        className="product-img"
                        sx={{ backgroundImage: `url(${product.imagePath})` }}
                      >
                        <div className="product-sale">Normal size</div>
                        <Button className="shop-btn">
                          <img src="/icons/shopping-cart.svg" alt="cart" />
                        </Button>
                        <Button className="view-btn">
                          <Badge badgeContent={20} color="secondary">
                            <RemoveRedEyeIcon sx={{ color: "gray" }} />
                          </Badge>
                        </Button>
                      </Stack>
                      <Box className="product-desc">
                        <span className="product-title">{product.productName}</span>
                        <div className="product-desc">
                          <MonetizationOnIcon />
                          {12}
                        </div>
                      </Box>
                    </Stack>
                  ))
                ) : (
                  <Box className="no-data">Products are not available!</Box>
                )}
              </Stack>
            </Stack>

            <Stack className="pagination-section">
              <Pagination
                count={3}
                page={1}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    color="secondary"
                  />
                )}
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