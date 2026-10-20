import { AccessTimeOutlined, CheckCircleOutline, HourglassEmpty } from "@mui/icons-material";
import { serverApi } from "../../../lib/config";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Order } from "../../../lib/types/order";
import { money, orderDate, orderReference, orderTabs, OrderAction, canPay } from "./orderPresentation";

interface Props { order: Order; busy: boolean; selected: boolean; onAction: (order: Order, action: OrderAction) => void; onSelect: (order: Order) => void; }
export default function OrderCard({ order, busy, selected, onAction, onSelect }: Props) {
  const StatusIcon = order.orderStatus === OrderStatus.FINISH ? CheckCircleOutline : order.orderStatus === OrderStatus.PROCESS ? HourglassEmpty : AccessTimeOutlined;
  return <article className={`lux-order-card${selected ? " is-selected" : ""}`} aria-label={`Buyurtma ${orderReference(order._id)}`}>
    <header><div><strong>{orderReference(order._id)}</strong><span className="lux-order-date">{orderDate(order.createdAt)}</span></div><span className={`lux-order-badge status-${order.orderStatus.toLowerCase()}`}><StatusIcon aria-hidden="true" />{orderTabs.find(tab => tab.value === order.orderStatus)?.label || "Holat ko‘rsatilmagan"}</span></header>
    <div className="lux-order-items">
      {(order.orderItems || []).map(item => {
        const product = order.productData?.find(value => String(value._id) === String(item.productId));
        const name = product?.productName || "Avtomobil mavjud emas";
        return <div className="lux-order-item" key={item._id}>
          <img src={product?.productImages?.[0] ? `${serverApi}/${product.productImages[0]}` : "/assets/luxavto/car-placeholder.svg"} alt={name} onError={event => { const fallback = "/assets/luxavto/car-placeholder.svg"; if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback; }} />
          <div className="lux-order-item-info"><h3>{name}</h3><p className="lux-order-details">{product?.productYear ? <span>{product.productYear}</span> : null}{typeof product?.productMileage === "number" ? <span>{new Intl.NumberFormat("uz-UZ").format(product.productMileage)} km</span> : null}</p>
            <div className="lux-order-item-price"><div><span>Soni: {item.itemQuantity}</span><small>Bir dona: {money(item.itemPrice)}</small></div><strong>{money(Math.round(item.itemPrice * 100) * item.itemQuantity / 100)}</strong></div>
          </div>
        </div>;
      })}
      {!order.orderItems?.length && <p className="lux-order-missing">Buyurtma tarkibi ko‘rsatilmagan.</p>}
    </div>
    {order.orderDelivery > 0 && <div className="lux-order-charge"><span>Qo‘shimcha xarajat</span><span>{money(order.orderDelivery)}</span></div>}
    <div className="lux-order-total"><strong>Buyurtma summasi</strong><strong>{money(order.orderTotal)}</strong></div>
    {canPay(order.orderStatus) && <div className="lux-order-actions">
      <button className="lux-order-select" disabled={busy} aria-pressed={selected} onClick={() => onSelect(order)}>{selected ? "To‘lov uchun tanlangan" : "To‘lov uchun tanlash"}</button>
      {order.orderStatus === OrderStatus.PENDING ? <><button className="lux-order-button" disabled={busy} onClick={() => onAction(order, "cancel")}>Bekor qilish</button><button className="lux-order-button is-gold" disabled={busy} onClick={() => onAction(order, "confirm")}>Buyurtmani tasdiqlash</button></> : <button className="lux-order-button is-gold" disabled={busy} onClick={() => onAction(order, "finish")}>Buyurtmani yakunlash</button>}
    </div>}
  </article>;
}
