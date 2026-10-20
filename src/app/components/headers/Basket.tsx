import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Button, Stack } from "@mui/material";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import React from "react";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobal";
import OrderService from "../../services/OrderService";


interface BasketProps {
  cartItems: CartItem[];
    onAdd: (item: CartItem) => void;
   onRemove: (item: CartItem) => void;
   onDelete: (item: CartItem) => void;
   onDeleteAll: () => void;
}



export default function Basket(props: BasketProps) {
 const { cartItems , onAdd, onRemove, onDelete, onDeleteAll} = props;
  const {authMember, setOrderBuilder} = useGlobals();
  const history = useHistory();
  const itemsPrice:  number = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity*c.price, 0);


    const shippingCost: number = itemsPrice < 100 ? 5 : 0 ;
    const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try {
 handleClose();
 if(!authMember) throw new Error ("Avval hisobingizga kiring.");

  const order = new OrderService();
   await order.createOrder(cartItems);
   

   onDeleteAll();

   setOrderBuilder(new Date());

   history.push("/orders");


    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }

  }

  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="Savat"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <img src={"/icons/shopping-cart.svg"} alt="" />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack className={"basket-frame"}>
          <Box className={"all-check-box"}>
           {cartItems.length ===0 ? <div>Savat bo‘sh.</div> :
           <Stack flexDirection="row">  <div>Savatdagi avtomobillar:</div>
           <IconButton size="small" aria-label="Savatni tozalash" onClick={onDeleteAll}><DeleteForeverIcon color="primary" /></IconButton></Stack>}
            
            
          </Box>

          <Box className={"orders-main-wrapper"}>
            <Box className={"orders-wrapper"}>
              {cartItems.map((item: CartItem) => {
                const imagePath = item.image ? `${serverApi}/${item.image}` : "/assets/luxavto/car-placeholder.svg";
                return (
                      <Box className={"basket-info-box"} key={item._id}>
                <div className={"cancel-btn"}>
                  <IconButton size="small" aria-label={`${item.name} — savatdan o‘chirish`} onClick={() => onDelete(item)}><CancelIcon color="primary" /></IconButton>
                </div>
                <img src={imagePath} className={"product-img"}  alt={item.name} onError={event => { const fallback = "/assets/luxavto/car-placeholder.svg"; if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback; }}/>
                <span className={"product-name"}> {item.name}</span>
                <p className={"product-price"}>${item.price} x {item.quantity}</p>
                <Box sx={{ minWidth: 120 }}>
                  <div className="col-2">
                    <button onClick={() => onRemove (item)}aria-label={`${item.name} — miqdorini kamaytirish`} className="remove">-</button>{" "}
                    <button  onClick={() => onAdd(item)} aria-label={`${item.name} — miqdorini oshirish`} className="add">+</button>
                  </div>
                </Box>
              </Box>

                );
              }) }
          
            </Box>
          </Box>
          {cartItems.length !== 0 ?  ( <Box className={"basket-order"}>
            <span className={"price"}>Jami: ${totalPrice} ({itemsPrice} +{shippingCost})</span>
            <Button onClick={proceedOrderHandler} 
            startIcon={<ShoppingCartIcon />} 
            variant={"contained"}>
              Buyurtma berish
            </Button>
          </Box>) : ("")}
         
        </Stack>
      </Menu>
    </Box>
  );
}
