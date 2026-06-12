// ===== CAR DETAIL SCREEN =====

const CAR_MODEL_URL = "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/ToyCar/glTF-Binary/ToyCar.glb";

function Car3DViewer({ car }) {
  const mvRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mv = mvRef.current;
    if (!mv) return;
    const onLoad = () => setLoaded(true);
    const onErr = () => { setFailed(true); setLoaded(true); };
    mv.addEventListener("load", onLoad);
    mv.addEventListener("error", onErr);
    const t = setTimeout(() => { if (!mv.loaded) setLoaded(true); }, 9000);
    return () => { mv.removeEventListener("load", onLoad); mv.removeEventListener("error", onErr); clearTimeout(t); };
  }, []);

  return (
    <section className="mv-stage" style={{ background: "var(--stage)", position: "relative", height: 420 }}>
      {/* model-viewer */}
      {!failed && (
        <model-viewer
          ref={mvRef}
          src={CAR_MODEL_URL}
          loading="eager"
          reveal="auto"
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="3000"
          rotation-per-second="14deg"
          interaction-prompt="none"
          touch-action="pan-y"
          shadow-intensity="1.1"
          shadow-softness="1"
          exposure="0.9"
          ar=""
          ar-modes="webxr scene-viewer quick-look"
          style={{ position: "absolute", inset: 0, opacity: loaded ? 1 : 0, transition: "opacity .6s ease" }}
        ></model-viewer>
      )}

      {/* Loading / fallback poster */}
      {(!loaded || failed) && (
        <div className="imgph dark" style={{
          position: "absolute", inset: 0, borderRadius: 0, flexDirection: "column", gap: 16,
        }}>
          {!failed
            ? <><div className="spin" /><span className="lbl">Đang tải mô hình 3D…</span></>
            : <span className="lbl">Poster ảnh xe · {car.name}</span>}
        </div>
      )}

      {/* Top chrome label */}
      <div style={{ position: "absolute", top: 16, left: 18, display: "flex", alignItems: "center", gap: 8, color: "var(--stage-muted)" }}>
        <Icon name="cube" size={16} />
        <span className="mono" style={{ fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase" }}>Mô hình 3D</span>
      </div>

      {/* Gesture hint */}
      {loaded && !failed && (
        <div className="fade-hint" style={{
          position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, color: "var(--stage-ink)",
            background: "rgba(11,11,12,.55)", border: "1px solid var(--stage-hairline)",
            padding: "8px 14px", borderRadius: 99, fontSize: 13.5, fontWeight: 500, backdropFilter: "blur(6px)",
          }}>
            <Icon name="rotate3d" size={16} /> Vuốt để xoay · chụm để zoom
          </span>
        </div>
      )}

      {/* AR button */}
      <button
        onClick={() => { const mv = mvRef.current; if (mv && mv.activateAR) mv.activateAR(); }}
        style={{
          position: "absolute", right: 16, bottom: 16, display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--stage-ink)", color: "var(--ink)", border: "none",
          padding: "11px 16px", borderRadius: 12, fontSize: 14.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
        }}>
        <Icon name="cube" size={17} /> Xem trong sân nhà bạn
      </button>
    </section>
  );
}

function CarGallery({ car }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const count = car.photos;

  const go = (dir) => {
    const el = ref.current; if (!el) return;
    const next = Math.min(count - 1, Math.max(0, idx + dir));
    setIdx(next);
    const child = el.children[next];
    if (child) el.scrollTo({ left: child.offsetLeft - 22, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const w = el.children[0] ? el.children[0].offsetWidth + 10 : 1;
    setIdx(Math.round(el.scrollLeft / w));
  };

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Eyebrow>Ảnh thật của xe</Eyebrow>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => go(-1)} className="gbtn" aria-label="Trước"
            style={galleryBtn(idx === 0)}><Icon name="chevronLeft" size={18} /></button>
          <button onClick={() => go(1)} className="gbtn" aria-label="Sau"
            style={galleryBtn(idx === count - 1)}><Icon name="chevronRight" size={18} /></button>
        </div>
      </div>
      <div ref={ref} onScroll={onScroll} style={{
        marginTop: 16, display: "flex", gap: 10, overflowX: "auto", scrollSnapType: "x mandatory",
        paddingLeft: 22, paddingRight: 22, scrollbarWidth: "none",
      }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ flex: "0 0 84%", scrollSnapAlign: "start" }}>
            <Photo label={`Ảnh ${i + 1}/${count}`} ratio="4 / 3" radius={14} />
          </div>
        ))}
      </div>
      <div className="container" style={{ display: "flex", gap: 5, marginTop: 14 }}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} style={{
            height: 3, flex: 1, borderRadius: 99,
            background: i === idx ? "var(--ink)" : "var(--hairline)", transition: "background .25s ease",
          }} />
        ))}
      </div>
    </section>
  );
}
function galleryBtn(disabled) {
  return {
    width: 38, height: 38, borderRadius: 10, border: "1px solid var(--hairline)",
    background: "var(--surface)", color: disabled ? "var(--hairline)" : "var(--ink)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "default" : "pointer",
  };
}

function PriceTable({ car }) {
  const rows = [
    { label: "Có tài xế", price: car.driver, was: car.oldDriver, note: "Đã gồm tài xế · đi về trong ngày" },
    { label: "Tự lái", price: car.self, was: car.oldSelf, note: car.self ? "Đặt cọc theo quy định · giao xe tận nhà" : "Hiện chưa áp dụng cho dòng xe này" },
  ];
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Eyebrow>Bảng giá</Eyebrow>
          {car.promo && (
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".02em", padding: "5px 10px", borderRadius: 99, border: "1px solid var(--ink)", color: "var(--ink)", whiteSpace: "nowrap" }}>{car.promo}</span>
          )}
        </div>
        <div style={{ marginTop: 18, border: "1px solid var(--hairline)", borderRadius: 16, overflow: "hidden" }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              padding: "20px 18px", borderTop: i ? "1px solid var(--hairline)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 16.5, fontWeight: 600 }}>{r.label}</span>
                <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  {r.price && r.was && (
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", textDecoration: "line-through" }}>{r.was}</span>
                  )}
                  <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em" }}>
                    {r.price ? <>{r.price}<span className="muted" style={{ fontSize: 14, fontWeight: 500 }}> đ/ngày</span></>
                      : <span className="muted" style={{ fontSize: 16, fontWeight: 600 }}>Liên hệ</span>}
                  </span>
                </span>
              </div>
              <div className="muted" style={{ fontSize: 13.5, marginTop: 7 }}>{r.note}</div>
            </div>
          ))}
        </div>
        <div className="muted" style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
          * Giá tham khảo. Đi xa, qua đêm hoặc ngày lễ có thể phụ phí — vui lòng gọi để báo giá chính xác.
        </div>
      </div>
    </section>
  );
}

function OwnerCard() {
  return (
    <section className="section">
      <div className="container">
        <div className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
          <div className="imgph" style={{ width: 60, height: 60, borderRadius: 99, flexShrink: 0 }}>
            <span className="mono muted" style={{ fontSize: 10 }}>ẢNH</span>
          </div>
          <div style={{ flex: 1 }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 500 }}>Chủ xe</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 2 }}>{BRAND.owner}</div>
          </div>
          <div className="linkrow" style={{ gap: 7, color: "var(--accent)", fontSize: 13.5, fontWeight: 600 }}>
            <Icon name="shield" size={17} /> Uy tín
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailScreen({ car, onBack, onCall, onZalo }) {
  return (
    <div className="screen">
      {/* Back bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30, padding: "12px 16px",
        background: "rgba(11,11,12,.6)", backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onBack} aria-label="Quay lại" style={{
          width: 40, height: 40, borderRadius: 11, border: "1px solid var(--stage-hairline)",
          background: "rgba(255,255,255,.06)", color: "var(--stage-ink)", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}><Icon name="chevronLeft" size={20} /></button>
        <span style={{ color: "var(--stage-ink)", fontSize: 15.5, fontWeight: 600 }}>{car.name}</span>
      </div>

      <Car3DViewer car={car} />

      <div className="container" style={{ paddingTop: 26 }}>
        <Reveal>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em" }}>{car.name}</h1>
          <div className="muted linkrow" style={{ fontSize: 15.5, marginTop: 8, gap: 8 }}>
            <span className="linkrow" style={{ gap: 6 }}><Icon name="users" size={17} /> {car.seats} chỗ</span>
            <span style={{ color: "var(--hairline)" }}>·</span>
            <span>{car.type.split("·")[0].trim()}</span>
          </div>
        </Reveal>
      </div>

      <Reveal><CarGallery car={car} /></Reveal>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <Reveal variant="left"><Eyebrow>Mô tả</Eyebrow></Reveal>
          <Reveal variant="up" delay={60}>
            <p className="body" style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6 }}>{car.desc}</p>
          </Reveal>
        </div>
      </section>

      <Reveal variant="up"><PriceTable car={car} /></Reveal>
      <Reveal variant="scale"><OwnerCard /></Reveal>

      <section className="section" style={{ paddingBottom: 130 }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn btn-primary" onClick={onCall}>
            <Icon name="phone" size={19} /> Gọi ngay · {BRAND.phone}
          </button>
          <button className="btn btn-ghost" onClick={onZalo}>
            <Icon name="chat" size={19} /> Nhắn Zalo
          </button>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { DetailScreen });
