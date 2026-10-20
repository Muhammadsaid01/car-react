export type LoadState = "loading" | "ready" | "error";
export default function SectionState({ state, empty, retry }: { state: LoadState; empty: string; retry: () => void }) {
  return <div className="lux-section-state" role={state === "error" ? "alert" : "status"}>
    <p>{state === "loading" ? "Ma’lumotlar yuklanmoqda…" : state === "error" ? "Ma’lumotlarni yuklab bo‘lmadi. Qayta urinib ko‘ring." : empty}</p>
    {state === "error" && <button type="button" className="lux-text-button" onClick={retry}>Qayta urinish <span aria-hidden="true">↻</span></button>}
  </div>;
}
