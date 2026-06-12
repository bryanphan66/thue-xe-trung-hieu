// ===== V2 App: routing + sticky + sheet =====

function StickyBar2({ onCall, onZalo }) {
  return (
    <div className="stickybar">
      <button className="btn btn-primary" onClick={onCall}><Icon name="phone" size={18} /> Gọi ngay</button>
      <button className="btn btn-ghost" onClick={onZalo} style={{ background: "rgba(255,255,255,.55)" }}><Icon name="chat" size={18} /> Nhắn Zalo</button>
    </div>
  );
}

const SVC_SUGGEST = {
  stethoscope: ["Toyota Vios", "Toyota Innova"],
  heart: ["Mazda CX-5", "Toyota Innova"],
  palm: ["Toyota Innova", "Ford Transit"],
  navigation: ["Toyota Innova", "Ford Transit"],
};

function ContactSheet2({ sheet, onClose, onPickCar }) {
  if (!sheet) return null;
  const isService = typeof sheet === "object" && sheet.kind === "service";
  const isQuote = typeof sheet === "object" && sheet.kind === "quote";
  const svc = isService ? sheet.service : null;
  const q = isQuote ? sheet.data : null;
  const isCall = sheet === "call";
  const heading = isQuote ? "Yêu cầu báo giá" : isService ? ("Cần xe · " + svc.label) : (isCall ? "Gọi cho nhà xe" : "Nhắn Zalo cho nhà xe");
  const suggest = isService ? (SVC_SUGGEST[svc.icon] || []) : [];
  const fmt = (n) => Number(n).toLocaleString("vi-VN");
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(11,11,12,.4)", backdropFilter: "blur(2px)", display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "screenIn .25s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", width: "100%", maxWidth: 448, borderRadius: "22px 22px 0 0", padding: "10px 22px calc(28px + env(safe-area-inset-bottom,0))", animation: "sheetUp2 .32s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: "var(--hairline)", margin: "0 auto 22px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={isQuote ? "sparkle" : isService ? svc.icon : (isCall ? "phone" : "chat")} size={24} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: 13.5, fontWeight: 500 }}>{heading}</div>
            <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 2 }}>{BRAND.phone}</div>
          </div>
        </div>

        {isQuote && (
          <div style={{ marginTop: 18, padding: "14px 16px", border: "1px solid var(--hairline)", borderRadius: 12, background: "var(--bg)" }}>
            {[
              ["Xe", q.car.name],
              ["Hình thức", q.mode === "self" ? "Tự lái" : "Có tài xế"],
              ["Số ngày", q.days + " ngày"],
              ...(q.far ? [["Lưu ý", "Đi xa / qua đêm"]] : []),
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "4px 0", fontSize: 14.5 }}>
                <span className="muted">{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--hairline)" }}>
              <span style={{ fontWeight: 600 }}>Tạm tính</span>
              <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.03em" }}>{fmt(q.total)} đ</span>
            </div>
          </div>
        )}

        {isService && (
          <div style={{ marginTop: 18, padding: "14px 16px", border: "1px solid var(--hairline)", borderRadius: 12, background: "var(--bg)" }}>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>Đang sẵn xe phù hợp · bấm để xem</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {suggest.map((nm) => {
                const c = CARS.find((x) => x.name === nm);
                return (
                  <button key={nm} onClick={() => onPickCar(c)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 600, fontFamily: "inherit", padding: "8px 12px", borderRadius: 99, border: "1px solid var(--hairline)", background: "var(--surface)", color: "inherit", cursor: "pointer" }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--accent)" }} />{nm}
                    <Icon name="arrowRight" size={15} className="muted" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <a href={`tel:${BRAND.phoneRaw}`} className="btn btn-primary" style={{ marginTop: 18 }}>
          <Icon name="phone" size={19} /> Gọi ngay
        </a>
        <a href={`https://zalo.me/${BRAND.zalo}`} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 10 }}>
          <Icon name="chat" size={19} /> Nhắn Zalo
        </a>
        <button className="btn btn-ghost" style={{ marginTop: 10, border: "none" }} onClick={onClose}>Đóng</button>
      </div>
      <style>{`@keyframes sheetUp2{from{transform:translateY(100%);}to{transform:none;}}`}</style>
    </div>
  );
}

function App2() {
  const [screen, setScreen] = useState("home");
  const [car, setCar] = useState(null);
  const [sheet, setSheet] = useState(null);

  useEffect(() => {
    const sc = document.querySelector(".page");
    if (sc) sc.scrollTo({ top: 0, behavior: "auto" });
  }, [screen, car]);

  const openCar = (c) => { setSheet(null); setCar(c); setScreen("detail"); };
  const onCall = () => setSheet("call");
  const onZalo = () => setSheet("zalo");
  const onService = (s) => setSheet({ kind: "service", service: s });
  const onQuote = (data) => setSheet({ kind: "quote", data });

  return (
    <div className="page">
      {screen === "home"
        ? <HomeScreen2 onOpen={openCar} onCall={onCall} onZalo={onZalo} onService={onService} onQuote={onQuote} />
        : <DetailScreen car={car} onBack={() => setScreen("home")} onCall={onCall} onZalo={onZalo} />}
      <StickyBar2 onCall={onCall} onZalo={onZalo} />
      <ContactSheet2 sheet={sheet} onClose={() => setSheet(null)} onPickCar={openCar} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App2 />);
