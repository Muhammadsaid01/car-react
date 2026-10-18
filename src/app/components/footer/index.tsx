import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobal";
import styled from "styled-components";

const Footers = styled.div`
  width: 100%;
  height: 590px;
  display: flex;
  background: #343434;
  background-size: cover;
`;

export default function Footer() {
  const { authMember } = useGlobals();

  return (
    <Footers className="site-footer">
      <Container>
        <Stack className="footer-main" flexDirection={"row"} sx={{ mt: "94px" }}>
          <Stack className="footer-about" flexDirection={"column"} style={{ width: "340px" }}>
            <Box>
              <img alt="Burak Gurme Logo" width={"100px"} src={"/icons/logo-text-white.svg"} />
            </Box>
            <Box className={"foot-desc-txt"}>
              Focusing on luxury automobiles and modern driving culture, our showroom aims to redefine the premium car experience. Combining elegance, performance, and innovation, Lux Motors creates a unique atmosphere where passion for automobiles comes to life.
            </Box>
            <Box className="sns-context">
              <img  src={"/icons/facebook.svg"} />
              <img  src={"/icons/twitter.svg"} />
              <img  src={"/icons/instagram.svg"} />
              <img  src={"/icons/youtube.svg"} />
            </Box>
          </Stack>
          <Stack className="footer-navigation" sx={{ ml: "288px" }} flexDirection={"row"}>
            <Stack>
              <Box>
                <Box className={"foot-category-title"}>Pages</Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">Home</Link>
                  <Link to="/products">Products</Link>
                  {authMember && <Link to="/orders">Orders</Link>}
                  <Link to="/help">Help</Link>
                </Box>
              </Box>
            </Stack>
            <Stack className="footer-contact" sx={{ ml: "100px" }}>
              <Box>
                <Box className={"foot-category-title"}>Find us</Box>
                <Box
                  flexDirection={"column"}
                  sx={{ mt: "20px" }}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div>Downtown, Dubai</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>+8210 8054 2811</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>bugatti@gmail.com</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>Visit 24 hours</div>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #C5C8C9", width: "100%", opacity: "0.2" }}
          sx={{ mt: "80px" }}
        ></Stack>
        <Stack className={"copyright-txt"}>
          © Copyright Lux Motors, All rights reserved.
        </Stack>
      </Container>
    </Footers>
  );
}
