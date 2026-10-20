import { FormEvent, useRef, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close, CreditCardOutlined } from "@mui/icons-material";
import { Order } from "../../../lib/types/order";
import { CardFields, CardErrors, emptyCard, formatCardNumber, formatExpiry, validateCard } from "./cardValidation";
import { money, orderReference } from "./orderPresentation";

/** Local demonstration only. Card values never leave this component or enter persistence. */
export default function PaymentPanel({ order }: { order: Order | null }) {
  const [fields, setFields] = useState(emptyCard);
  const [errors, setErrors] = useState<CardErrors>({});
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  const confirmed = useRef(false);
  const fieldRefs = useRef<Partial<Record<keyof CardFields, HTMLInputElement | null>>>({});
  const update = (key: keyof CardFields, value: string) => {
    setFields(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined })); setResult("");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!order) { setResult("To‘lov uchun buyurtmani tanlang."); return; }
    const found = validateCard(fields); setErrors(found);
    const first = (Object.keys(found) as (keyof CardFields)[])[0];
    if (first) { fieldRefs.current[first]?.focus(); return; }
    confirmed.current = false; setResult(""); setOpen(true);
  };
  const confirm = () => {
    if (confirmed.current) return;
    confirmed.current = true;
    // There is no payment provider. Do not send card data or update an order.
    setOpen(false); setFields(emptyCard()); setErrors({});
    setResult("To‘lovni hozir amalga oshirib bo‘lmadi.");
  };
  const field = (key: keyof CardFields, label: string, placeholder: string, maxLength: number, type = "text") => <div className={`lux-payment-field field-${key}`}>
    <label htmlFor={`order-card-${key}`}>{label}</label>
    <input ref={element => { fieldRefs.current[key] = element; }} id={`order-card-${key}`} name={`demo-${key}`} type={type} inputMode={key === "holder" ? "text" : "numeric"} autoComplete="off" maxLength={maxLength} value={fields[key]} placeholder={placeholder} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `card-error-${key}` : undefined} onChange={event => update(key, key === "number" ? formatCardNumber(event.target.value) : key === "expiry" ? formatExpiry(event.target.value) : key === "cvv" ? event.target.value.replace(/\D/g, "").slice(0, 4) : event.target.value)} />
    {errors[key] && <p className="lux-payment-error" id={`card-error-${key}`}>{errors[key]}</p>}
  </div>;
  return <section className="lux-order-panel lux-payment" aria-labelledby="order-payment-title">
    <h2 id="order-payment-title"><CreditCardOutlined aria-hidden="true" />Karta ma’lumotlari</h2>
    <p className="lux-payment-caption">Namoyish uchun sinov ma’lumotlarini kiriting.</p>
    <div className="lux-payment-preview" aria-label="Karta raqamining yashirilgan ko‘rinishi"><span className="lux-payment-chip" aria-hidden="true" /><span>•••• •••• •••• {fields.number.replace(/\D/g, "").length >= 4 ? fields.number.replace(/\D/g, "").slice(-4) : "••••"}</span></div>
    <div className="lux-payment-target">{order ? <><span>Tanlangan buyurtma</span><strong>{orderReference(order._id)}</strong><b>{money(order.orderTotal)} <small>USD</small></b></> : <p>To‘lov uchun buyurtmani tanlang.</p>}</div>
    <form onSubmit={submit} noValidate aria-label="To‘lov namoyishi" autoComplete="off">
      {field("number", "Karta raqami", "Karta raqamini kiriting", 23)}
      <div className="lux-payment-row">{field("expiry", "Amal qilish muddati", "OO/YY", 5)}{field("cvv", "CVV", "•••", 4, "password")}</div>
      {field("holder", "Karta egasi", "Ism va familiya", 100)}
      <button className="lux-order-button is-gold" type="submit" disabled={!order}>To‘lov qilish</button>
      {result && <p className="lux-payment-result" role="status">{result}</p>}
    </form>
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="payment-confirm-title" aria-describedby="payment-confirm-description" maxWidth="xs" fullWidth className="lux-order-dialog">
      <DialogTitle id="payment-confirm-title">To‘lov amalga oshirilsinmi?<IconButton aria-label="To‘lov oynasini yopish" onClick={() => setOpen(false)}><Close /></IconButton></DialogTitle>
      <DialogContent><p id="payment-confirm-description">Tanlangan buyurtma uchun to‘lovni tasdiqlang.</p><div className="lux-order-dialog-summary"><span>{order && orderReference(order._id)}</span><strong>{order && money(order.orderTotal)} USD</strong></div></DialogContent>
      <DialogActions><button className="lux-order-button" autoFocus onClick={() => setOpen(false)}>Bekor qilish</button><button className="lux-order-button is-gold" onClick={confirm}>Ha, tasdiqlash</button></DialogActions>
    </Dialog>
  </section>;
}
