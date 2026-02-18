import { CssVarsProvider, Typography } from "@mui/joy"
import AspectRatio from "@mui/joy/AspectRatio"
import Card from "@mui/joy/Card"
import CardOverflow from "@mui/joy/CardOverflow"
import { Box, Container, Stack } from "@mui/material"
const activeUsers = [
  {productName: "Martin", imagePath: "/img/martin.webp" },
  {productName: "Justin", imagePath: "/img/justin.webp"},
  {productName: "Rose", imagePath: "/img/rose.webp" },
  {productName: "Nusret", imagePath: "/img/nusret.webp"},
];

export default function ActiveUsers() {
  return (
  <div className={"active-users-frame"}>
  <Container>
      <Stack className={"main"}>
      <Box className={"category-title"}>Active Users</Box>
      <Stack className={"cards-frame"}>
        <CssVarsProvider>
         {activeUsers.length !== 0 ? (
          activeUsers.map((ele, index)=> {
            return (
              <Card key={index} variant="outlined" className={"card"}>
                <CardOverflow>
                     <AspectRatio ratio="1">
                  <img src={ele.imagePath} alt="" />
                  </AspectRatio>
                </CardOverflow>
                <CardOverflow variant="soft" className="product-detail">
                <Stack flexDirection="row"> 
                    <Typography className={"title"}>
                      {ele.productName}
                    </Typography>
                </Stack>
                </CardOverflow>
              </Card>
            );
          })
        ) : (
          <Box className="no-data">No Active Users!</Box>
         )}
        </CssVarsProvider>
      </Stack>
    </Stack>
    </Container>  
  </div>
  );
}