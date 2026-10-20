import { useRef, useState } from "react";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { Close, PlayArrow } from "@mui/icons-material";
export default function Advertisement() {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  function close() { video.current?.pause(); setOpen(false); }
  return <section className="lux-video-banner" aria-labelledby="video-heading">
    <img className="lux-banner-image" src="/assets/luxavto/video-poster.jpg" alt="" width="2172" height="724" loading="lazy" />
    <div className="lux-container lux-video-copy"><h2 id="video-heading">Harakatdagi<br />mukammallik.</h2><button className="lux-play-button" onClick={() => { setFailed(false); setOpen(true); }}><span><PlayArrow aria-hidden="true" /></span>Videoni tomosha qilish</button></div>
    <Dialog open={open} onClose={close} maxWidth="lg" fullWidth aria-labelledby="promo-title" PaperProps={{ className: "lux-video-dialog" }}>
      <DialogTitle id="promo-title">LuxAvto — harakatdagi mukammallik<IconButton aria-label="Videoni yopish" onClick={close}><Close /></IconButton></DialogTitle>
      {open && <video ref={video} controls autoPlay muted playsInline preload="metadata" poster="/assets/luxavto/video-poster.jpg" onError={() => setFailed(true)} src="/video/advertisement.mp4" aria-label="LuxAvto tanishtiruv videosi" />}
      {failed && <p role="alert">Videoni yuklab bo‘lmadi. Keyinroq qayta urinib ko‘ring.</p>}
    </Dialog>
  </section>;
}
