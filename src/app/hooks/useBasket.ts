import { useState } from "react";
import { CartItem } from "../../lib/types/search";


const useBasket = () => {

    
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("cartData") || "[]");
        return Array.isArray(stored) ? stored.filter(item => item && typeof item._id === "string" &&
          Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100 &&
          typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0) : [];
      } catch { return []; }
    });


const onAdd = (input: CartItem) => {
  const exist: any = cartItems.find(
    (item: CartItem) => item._id === input._id );
  if (exist) {
   if (exist.quantity >= 100) return;
   const cartUpdate = cartItems.map((item: CartItem) =>
  item._id === input._id
  ? {...exist, quantity: exist.quantity +1 }
: item 
);
setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  } else {
    const cartUpdate = [...cartItems, {...input}];
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
  }

};

const onRemove =  (input: CartItem) => {
    const exist : any = cartItems.find (
        (item: CartItem) => item._id === input._id
    );
    if (!exist) return;
    if (exist.quantity === 1) {
        const cartUpdate = cartItems.filter(
            (item: CartItem) => item._id !== input._id
        );
 setCartItems(cartUpdate);
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
    }else {
        const cartUpdate = cartItems.map((item: CartItem) => 
        item._id === input._id
         ? {...exist, quantity: exist.quantity -1 }
        :item)
          setCartItems(cartUpdate);
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));

    }

};
const onDelete = (input: CartItem) => {
    const cartUpdate = cartItems.filter(
        (item: CartItem) => item._id !== input._id
    );
      setCartItems(cartUpdate);
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
};


const onDeleteAll = () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
}

return  {
cartItems,
onAdd,
onRemove,
onDelete,
onDeleteAll
};

};



export default useBasket;