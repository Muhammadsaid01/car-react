import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tab, Tabs } from "@mui/material";
import { ArrowForward, Close, DirectionsCarOutlined, EditOutlined, LocationOnOutlined } from "@mui/icons-material";
import { serverApi } from "../../../lib/config";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { Member } from "../../../lib/types/member";
import { Order } from "../../../lib/types/order";
import { useGlobals } from "../../hooks/useGlobal";
import OrderService from "../../services/OrderService";
import OrderCard from "./OrderCard";
import PaymentPanel from "./PaymentPanel";
import { money, orderReference, orderTabs, OrderAction, nextStatus } from "./orderPresentation";
import "../../../css/order.css";

const PAGE_SIZE = 5;
const actionCopy = {
  cancel: { title: "Buyurtma bekor qilinsinmi?", description: "Bekor qilingan buyurtma kutilayotganlar ro‘yxatidan olib tashlanadi.", success: "Buyurtma bekor qilindi." },
  confirm: { title: "Buyurtma tasdiqlansinmi?", description: "Buyurtma jarayonga o‘tkaziladi. Bu amal pul yechmaydi.", success: "Buyurtma tasdiqlandi. To‘lov amalga oshirilmadi." },
  finish: { title: "Buyurtma yakunlansinmi?", description: "Buyurtmani qabul qilgan bo‘lsangiz, yakunlashni tasdiqlang.", success: "Buyurtma yakunlandi." },
};

export default function OrdersPage() {
  const { authReady, authMember } = useGlobals();
  const history = useHistory();
  useEffect(() => { if (authReady && !authMember) history.replace("/"); }, [authReady, authMember, history]);
  if (!authReady || !authMember) return null;
  return <OrdersWorkspace key={authMember._id} member={authMember} />;
}

function OrdersWorkspace({ member }: { member: Member }) {
  const { orderBuilder, setOrderBuilder, setAuthMember } = useGlobals();
  const [status, setStatus] = useState(OrderStatus.PENDING);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{ phase: "loading" | "error" | "ready"; orders: Order[]; page: number; more: boolean; moreError: boolean; loadingMore: boolean }>({ phase: "loading", orders: [], page: 1, more: false, moreError: false, loadingMore: false });
  const [selection, setSelection] = useState<Order | null>(null);
  const [action, setAction] = useState<{ order: Order; kind: OrderAction } | null>(null);
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const requestVersion = useRef(0), actionLock = useRef(false), moreLock = useRef(false);
  const alive = useRef(true);
  const paymentTarget = useRef<HTMLDivElement>(null);
  const focusTab = useRef<OrderStatus | null>(null);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    const version = ++requestVersion.current;
    let active = true; moreLock.current = false;
    setSelection(null);
    setState({ phase: "loading", orders: [], page: 1, more: false, moreError: false, loadingMore: false });
    new OrderService().getMyOrders({ page: 1, limit: PAGE_SIZE, orderStatus: status }).then(orders => {
      if (active && version === requestVersion.current) setState({ phase: "ready", orders, page: 1, more: orders.length === PAGE_SIZE, moreError: false, loadingMore: false });
    }).catch(error => {
      if (!active || version !== requestVersion.current) return;
      if ([401, 403].includes(error.response?.status)) setAuthMember(null);
      else setState({ phase: "error", orders: [], page: 1, more: false, moreError: false, loadingMore: false });
    });
    return () => { active = false; };
  }, [status, orderBuilder, revision, member._id, setAuthMember]);
  const loadMore = async () => {
    if (moreLock.current || state.loadingMore || !state.more) return;
    moreLock.current = true;
    const version = requestVersion.current;
    setState(current => ({ ...current, loadingMore: true, moreError: false }));
    try {
      const orders = await new OrderService().getMyOrders({ page: state.page + 1, limit: PAGE_SIZE, orderStatus: status });
      if (alive.current && version === requestVersion.current) setState(current => ({ ...current, orders: [...current.orders, ...orders.filter(order => !current.orders.some(existing => existing._id === order._id))], page: current.page + 1, more: orders.length === PAGE_SIZE, loadingMore: false }));
    } catch (error: any) {
      if (alive.current && version === requestVersion.current) {
        if ([401, 403].includes(error.response?.status)) setAuthMember(null);
        else setState(current => ({ ...current, loadingMore: false, moreError: true }));
      }
    } finally { if (version === requestVersion.current) moreLock.current = false; }
  };
  const selectPayment = (order: Order) => {
    setSelection(order);
    paymentTarget.current?.focus({ preventScroll: true });
    paymentTarget.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  };
  const beginAction = (order: Order, kind: OrderAction) => { setActionError(""); setAction({ order, kind }); };
  const applyAction = async () => {
    if (!action || actionLock.current) return;
    const allowed = action.kind === "finish" ? OrderStatus.PROCESS : OrderStatus.PENDING;
    if (action.order.orderStatus !== allowed) return;
    actionLock.current = true; setPending(true); setActionError("");
    try {
      await new OrderService().updateOrder({ orderId: action.order._id, orderStatus: nextStatus[action.kind] });
      if (!alive.current) return;
      focusTab.current = action.kind === "confirm" ? OrderStatus.PROCESS : action.kind === "finish" ? OrderStatus.FINISH : status;
      setNotice(actionCopy[action.kind].success); setSelection(null); setAction(null);
      if (action.kind === "confirm") setStatus(OrderStatus.PROCESS);
      if (action.kind === "finish") setStatus(OrderStatus.FINISH);
      setOrderBuilder(new Date());
    } catch (error: any) {
      if (alive.current) {
        if ([401, 403].includes(error.response?.status)) setAuthMember(null);
        else setActionError("Buyurtmani o‘zgartirib bo‘lmadi. Qayta urinib ko‘ring.");
      }
    } finally { actionLock.current = false; if (alive.current) setPending(false); }
  };
  const currentLabel = orderTabs.find(tab => tab.value === status)!.label;
  return <main className="lux-orders">
    <div className="lux-container">
      <header className="lux-orders-intro"><nav aria-label="Sahifa yo‘li"><Link to="/">Bosh sahifa</Link><span aria-hidden="true"> / </span><span aria-current="page">Buyurtmalar</span></nav><h1>Buyurtmalarim</h1><p>Buyurtmalaringiz va ularning holatini shu yerda kuzating.</p></header>
      <div className="lux-orders-layout">
        <div className="lux-orders-list">
          <Tabs value={status} onChange={(_event, value) => { setSelection(null); setNotice(""); setStatus(value); }} aria-label="Buyurtma holatlari" className="lux-order-tabs">
            {orderTabs.map(tab => <Tab key={tab.value} value={tab.value} label={tab.label} id={`order-tab-${tab.value}`} aria-controls={`order-panel-${tab.value}`} disabled={pending} />)}
          </Tabs>
          {notice && <p className="lux-order-notice" role="status">{notice}</p>}
          <section role="tabpanel" id={`order-panel-${status}`} aria-labelledby={`order-tab-${status}`} aria-busy={state.phase === "loading"} className="lux-orders-results">
            {state.phase === "loading" ? <div className="lux-orders-state" role="status"><span className="lux-orders-spinner" aria-hidden="true" /><p>Buyurtmalar yuklanmoqda…</p></div> : state.phase === "error" ? <div className="lux-orders-state" role="alert"><h2>Buyurtmalarni yuklab bo‘lmadi.</h2><p>Ulanishni tekshiring va qayta urinib ko‘ring.</p><button className="lux-order-button" onClick={() => setRevision(value => value + 1)}>Qayta urinish</button></div> : state.orders.length === 0 ? <div className="lux-orders-state"><DirectionsCarOutlined aria-hidden="true" /><h2>Bu bo‘limda buyurtmalar yo‘q.</h2><p>{currentLabel} holatidagi buyurtmalar shu yerda ko‘rinadi.</p><Link className="lux-order-button is-gold" to="/products">Katalogga o‘tish <ArrowForward aria-hidden="true" /></Link></div> : <>
              {state.orders.map(order => <OrderCard key={order._id} order={order} busy={pending} selected={selection?._id === order._id} onSelect={selectPayment} onAction={beginAction} />)}
              {state.more && <div className="lux-orders-more">{state.moreError && <p role="alert">Keyingi buyurtmalarni yuklab bo‘lmadi.</p>}<button className="lux-order-button" disabled={state.loadingMore || pending} onClick={loadMore}>{state.loadingMore ? "Yuklanmoqda…" : state.moreError ? "Yana urinib ko‘rish" : "Yana buyurtmalarni ko‘rsatish"}</button></div>}
            </>}
          </section>
        </div>
        <aside className="lux-orders-sidebar" aria-label="Hisob va to‘lov">
          <section className="lux-order-panel lux-order-profile" aria-label="Shaxsiy hisob"><div className="lux-order-member"><div className="lux-order-avatar">{member.memberImage && !avatarFailed ? <img src={`${serverApi}/${member.memberImage}`} alt={`${member.memberNick} profil rasmi`} onError={() => setAvatarFailed(true)} /> : <span aria-hidden="true">{(member.memberNick.trim().includes(" ") ? member.memberNick.trim().split(/\s+/).map(part => part[0]).join("").slice(0, 2) : member.memberNick.trim().slice(0, 2)).toUpperCase()}</span>}</div><div><h2>{member.memberNick}</h2><p>Shaxsiy hisob</p></div></div><p className="lux-order-address"><LocationOnOutlined aria-hidden="true" /><span>{member.memberAddress?.trim() || "Manzil kiritilmagan"}</span></p><Link to="/member-page"><EditOutlined aria-hidden="true" />Profilni tahrirlash<ArrowForward aria-hidden="true" /></Link></section>
          <div ref={paymentTarget} tabIndex={-1} className="lux-order-payment-target" aria-label="Tanlangan buyurtma to‘lovi"><PaymentPanel key={selection?._id || "unselected"} order={selection} /></div>
        </aside>
      </div>
    </div>
    <section className="lux-orders-catalog"><div className="lux-container"><DirectionsCarOutlined aria-hidden="true" /><div><h2>Keyingi avtomobilingizni topishga tayyormisiz?</h2><p>Orzularingizdagi avtomobil sizni kutmoqda.</p></div><Link to="/products">Katalogga qaytish <ArrowForward aria-hidden="true" /></Link></div></section>
    <Dialog TransitionProps={{ onExited: () => { if (focusTab.current) { document.getElementById(`order-tab-${focusTab.current}`)?.focus(); focusTab.current = null; } } }} open={Boolean(action)} onClose={() => { if (!pending) setAction(null); }} aria-labelledby="order-action-title" aria-describedby="order-action-description" maxWidth="xs" fullWidth className="lux-order-dialog">
      {action && <><DialogTitle id="order-action-title">{actionCopy[action.kind].title}<IconButton aria-label="Buyurtma oynasini yopish" disabled={pending} onClick={() => setAction(null)}><Close /></IconButton></DialogTitle><DialogContent><p id="order-action-description">{actionCopy[action.kind].description}</p><div className="lux-order-dialog-summary"><span>{orderReference(action.order._id)}</span><strong>{money(action.order.orderTotal)} USD</strong></div>{actionError && <p role="alert" className="lux-payment-error">{actionError}</p>}</DialogContent><DialogActions><button className="lux-order-button" disabled={pending} onClick={() => setAction(null)} autoFocus>Ortga</button><button className="lux-order-button is-gold" disabled={pending} onClick={applyAction}>{pending ? "Kutilmoqda…" : "Ha, tasdiqlash"}</button></DialogActions></>}
    </Dialog>
  </main>;
}
