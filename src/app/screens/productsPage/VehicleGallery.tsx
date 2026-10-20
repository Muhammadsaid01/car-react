import { useRef, useState } from "react";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward, Close, OpenInFull } from "@mui/icons-material";
import { vehicleImageUrl } from "../../../lib/vehiclePresentation";

const placeholder = "/assets/luxavto/car-placeholder.svg";
export default function VehicleGallery({ name, paths }: { name: string; paths: string[] }) {
  const images = Array.from(new Set(paths.filter(path => typeof path === "string").map(vehicleImageUrl).filter((path): path is string => Boolean(path))));
  const [selected, setSelected] = useState(0);
  const [broken, setBroken] = useState<Set<string>>(() => new Set());
  const [open, setOpen] = useState(false);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const index = selected < images.length ? selected : 0;
  const current = images[index];
  const unavailable = !current || broken.has(current);
  const choose = (next: number, focusThumbnail = false) => {
    const position = (next + images.length) % images.length;
    setSelected(position);
    if (focusThumbnail) thumbnails.current[position]?.focus();
  };
  const failed = (src: string) => setBroken(previous => new Set(previous).add(src));
  const picture = (src: string | undefined, alt: string, main = false) => <img src={!src || broken.has(src) ? placeholder : src} alt={alt} width="1200" height="800" decoding="async" onError={src && !broken.has(src) ? () => failed(src) : undefined} className={main ? "lux-detail-main-image" : undefined} />;
  const arrows = (inDialog = false) => images.length > 1 && <div className="lux-detail-gallery-arrows">
    <button type="button" aria-label={inDialog ? "Katta oynada oldingi rasm" : "Oldingi rasm"} onClick={() => choose(index - 1)}><ArrowBack aria-hidden="true" /></button>
    <span aria-live="polite" aria-atomic="true">{index + 1} / {images.length}</span>
    <button type="button" aria-label={inDialog ? "Katta oynada keyingi rasm" : "Keyingi rasm"} onClick={() => choose(index + 1)}><ArrowForward aria-hidden="true" /></button>
  </div>;
  return <section className="lux-detail-gallery" aria-label={`${name} rasmlari`}>
    <div className="lux-detail-primary">
      {picture(current, unavailable ? `${name} — rasm mavjud emas` : `${name} — ${index + 1}-rasm`, true)}
      {unavailable && <p className="lux-detail-image-note" role="status">{images.length ? "Bu rasmni yuklab bo‘lmadi." : "Bu avtomobil uchun rasm kiritilmagan."}</p>}
      <button className="lux-detail-expand" type="button" aria-label="Rasmni kattalashtirish" disabled={unavailable} onClick={() => setOpen(true)}><OpenInFull aria-hidden="true" /></button>
      {arrows()}
    </div>
    {images.length > 0 && <div className="lux-detail-thumbnails" aria-label="Avtomobil rasmini tanlash">{images.map((src, position) => <button ref={element => { thumbnails.current[position] = element; }} type="button" key={src} aria-label={`${position + 1}-rasmni ko‘rish${broken.has(src) ? " — yuklab bo‘lmadi" : ""}`} aria-pressed={position === index} onClick={() => choose(position)} onKeyDown={event => {
      if (images.length < 2) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); choose(position + (event.key === "ArrowRight" ? 1 : -1), true); }
      if (event.key === "Home" || event.key === "End") { event.preventDefault(); choose(event.key === "Home" ? 0 : images.length - 1, true); }
    }}>{picture(src, `${name} — ${position + 1}-rasm eskizi`)}</button>)}</div>}
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth transitionDuration={0} aria-labelledby="vehicle-lightbox-title" aria-describedby="vehicle-lightbox-hint" PaperProps={{ className: "lux-detail-lightbox" }} onKeyDown={event => {
      if (images.length < 2 || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); choose(index + (event.key === "ArrowRight" ? 1 : -1)); }
      if (event.key === "Home" || event.key === "End") { event.preventDefault(); choose(event.key === "Home" ? 0 : images.length - 1); }
    }}>
      <DialogTitle id="vehicle-lightbox-title">{name}<IconButton autoFocus aria-label="Katta rasm oynasini yopish" onClick={() => setOpen(false)}><Close /></IconButton></DialogTitle>
      <div className="lux-detail-lightbox-image">{picture(current, unavailable ? `${name} — rasm mavjud emas` : `${name} — ${index + 1}-rasm`, true)}{unavailable && <p role="status">Bu rasmni yuklab bo‘lmadi.</p>}</div>
      {arrows(true)}
      <p id="vehicle-lightbox-hint" className="lux-detail-lightbox-hint">{images.length > 1 ? "Rasmlarni ← → tugmalari bilan almashtiring. " : ""}Yopish uchun Esc bosing.</p>
    </Dialog>
  </section>;
}
