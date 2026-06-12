// ===== V2 HOME — cinematic hero + numbered journey =====
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

function HeroShowcase() {
  const heroCars = CARS.slice(0, 3);
  const [idx, setIdx] = useStateH(0);
  const paused = useRefH(false);
  useEffectH(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % heroCars.length);
    }, 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero-show"
      onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}
      onTouchStart={() => (paused.current = true)}>
      <div className="hero-show-track" style={{ transform: `translateX(${-idx * 100}%)` }}>
        {heroCars.map((c, i) => (
          <div className="hero-slide" key={c.id}>
            <Photo className={i === idx ? "hero-photo" : ""} label={`Ảnh xe · ${c.name}`} ratio="16 / 11" dark radius={0} />
            <span className="hero-cap">{c.name} <span className="muted" style={{ fontWeight: 500 }}>· {c.seats} chỗ</span></span>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {heroCars.map((_, i) => (
          <button key={i} className={i === idx ? "on" : ""} onClick={() => setIdx(i)} aria-label={`Xe ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

function Hero2({ onCall, onZalo }) {
  return (
    <header className="hero2">
      <div className="container" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: 99, background: "var(--accent)", display: "inline-block" }} />
            <Eyebrow dark>{BRAND.tagline} · An Giang</Eyebrow>
          </div>
        </Reveal>
        <h1 className="display" style={{ color: "var(--stage-ink)" }}>
          {["Đi xa thật dễ.", "Chỉ một", "cuộc gọi."].map((ln, i) => (
            <span className="hero-line" key={i} style={{ "--i": i }}>{ln}</span>
          ))}
        </h1>
        <Reveal delay={130}>
          <p className="lead" style={{ color: "var(--stage-muted)", marginTop: 20, maxWidth: 330 }}>
            Cuộn xuống để bắt đầu hành trình — từ chiếc xe đầu tiên đến tận cửa nhà xe.
          </p>
        </Reveal>
      </div>

      <Reveal delay={170} variant="scale">
        <div className="container">
          <HeroShowcase />
        </div>
      </Reveal>

      <Reveal delay={220}>
        <div className="container" style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10, paddingBottom: 56 }}>
          <button className="btn btn-on-dark" onClick={onCall}>
            <Icon name="phone" size={19} /> Gọi ngay · {BRAND.phone}
          </button>
          <button className="btn btn-ghost-on-dark" onClick={onZalo}>
            <Icon name="chat" size={19} /> Nhắn Zalo
          </button>
        </div>
      </Reveal>

      <div className="scroll-cue">
        <span className="mono" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase" }}>Cuộn</span>
        <span className="ln" />
      </div>
    </header>
  );
}

function CarCard2({ car, onOpen, onCall }) {
  return (
    <div className="card car-card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <Photo label={`Ảnh xe · ${car.name}`} ratio="16 / 10" radius={0} />
        {car.accent && (
          <span style={{ position: "absolute", top: 12, left: 12, fontSize: 11.5, fontWeight: 600, padding: "6px 11px", borderRadius: 99, background: "rgba(11,11,12,.88)", color: "#fff", backdropFilter: "blur(4px)" }}>{car.accent}</span>
        )}
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.035em" }}>{car.name}</h3>
          {car.promo && <span className="promo-chip">{car.promo}</span>}
        </div>
        <div className="muted linkrow" style={{ fontSize: 14.5, marginTop: 6 }}>
          <span className="linkrow" style={{ gap: 6 }}><Icon name="users" size={16} /> {car.seats} chỗ</span>
          <span style={{ color: "var(--hairline)" }}>·</span>
          <span>{car.type.split("·")[0].trim()}</span>
        </div>
        <div style={{ display: "flex", marginTop: 16, borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ flex: 1, padding: "13px 0" }}>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>Có tài xế</div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 3 }}>{car.driver}<span className="muted" style={{ fontSize: 13, fontWeight: 500 }}> đ/ngày</span></div>
            {car.oldDriver && <div className="was">{car.oldDriver} đ</div>}
          </div>
          <div style={{ width: 1, background: "var(--hairline)" }} />
          <div style={{ flex: 1, padding: "13px 0 13px 16px" }}>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>Tự lái</div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 3 }}>{car.self ? <>{car.self}<span className="muted" style={{ fontSize: 13, fontWeight: 500 }}> đ/ngày</span></> : <span className="muted" style={{ fontSize: 15, fontWeight: 600 }}>Liên hệ</span>}</div>
            {car.oldSelf && <div className="was">{car.oldSelf} đ</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => onOpen(car)}>Xem chi tiết <Icon name="arrowRight" size={17} /></button>
          <button className="btn btn-primary btn-sm" style={{ width: 52, padding: 0, flexShrink: 0 }} onClick={onCall} aria-label="Gọi ngay"><Icon name="phone" size={18} /></button>
        </div>
      </div>
    </div>
  );
}

function EstimatorChapter({ onQuote }) {
  const [carId, setCarId] = useStateH(CARS[0].id);
  const [mode, setMode] = useStateH("driver");
  const [days, setDays] = useStateH(1);
  const [far, setFar] = useStateH(false);
  const [pulse, setPulse] = useStateH(false);
  const car = CARS.find((c) => c.id === carId);
  useEffectH(() => { if (mode === "self" && !car.self) setMode("driver"); }, [carId]);
  const parse = (s) => parseInt(String(s).replace(/\./g, ""), 10) || 0;
  const fmt = (n) => n.toLocaleString("vi-VN");
  const unit = parse(mode === "self" ? car.self : car.driver);
  const total = unit * days;
  useEffectH(() => { setPulse(true); const t = setTimeout(() => setPulse(false), 260); return () => clearTimeout(t); }, [total]);
  const shortName = (n) => n.replace(/^(Toyota|Mazda|Ford)\s/, "");
  return (
    <Chapter n="03" tag="Báo giá" label="Tính nhanh chi phí">
      <div className="est-card">
        <div className="est-label">Chọn xe</div>
        <div className="est-chips">
          {CARS.map((c) => (
            <button key={c.id} className={"est-chip" + (c.id === carId ? " on" : "")} onClick={() => setCarId(c.id)}>{shortName(c.name)}</button>
          ))}
        </div>

        <div className="est-label" style={{ marginTop: 18 }}>Hình thức</div>
        <div className="seg">
          <button className={mode === "driver" ? "on" : ""} onClick={() => setMode("driver")}>Có tài xế</button>
          <button className={mode === "self" ? "on" : ""} disabled={!car.self} onClick={() => car.self && setMode("self")}>Tự lái{!car.self ? " · không có" : ""}</button>
        </div>

        <div className="est-label" style={{ marginTop: 18 }}>Số ngày thuê</div>
        <div className="step">
          <button onClick={() => setDays((d) => Math.max(1, d - 1))} aria-label="Bớt ngày">–</button>
          <span className="val">{days}</span>
          <button onClick={() => setDays((d) => Math.min(30, d + 1))} aria-label="Thêm ngày">+</button>
        </div>

        <div className="est-toggle" style={{ marginTop: 20 }}>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 600 }}>Đi xa / qua đêm</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>Có thể phụ phí — báo giá khi gọi</div>
          </div>
          <button className={"switch" + (far ? " on" : "")} onClick={() => setFar((f) => !f)} aria-label="Đi xa" />
        </div>

        <div style={{ borderTop: "1px solid var(--hairline)", marginTop: 20, paddingTop: 18, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="muted" style={{ fontSize: 13, fontWeight: 500 }}>Tạm tính</div>
            <div className={"est-total" + (pulse ? " pulse" : "")}>{fmt(total)}<span className="muted" style={{ fontSize: 15, fontWeight: 500 }}> đ</span></div>
          </div>
          <div className="muted" style={{ fontSize: 13, textAlign: "right", lineHeight: 1.5 }}>{fmt(unit)} đ<br />× {days} ngày</div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => onQuote({ car, mode, days, far, total })}>
          <Icon name="chat" size={18} /> Gửi yêu cầu này
        </button>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 12, lineHeight: 1.5 }}>* Số tiền tạm tính theo giá ngày. Phụ phí đi xa, qua đêm, ngày lễ báo riêng khi gọi.</div>
      </div>
    </Chapter>
  );
}

function HomeScreen2({ onOpen, onCall, onZalo, onService, onQuote }) {
  const drive = [
    { icon: "steering", cls: "drive-steer", title: "Có tài xế", body: "Bác tài quen đường, đón tận nơi. Bạn chỉ việc lên xe — hợp người lớn tuổi, đi khám bệnh, sự kiện." },
    { icon: "keyRound", cls: "drive-key", title: "Tự lái", body: "Tự cầm lái, chủ động giờ giấc. Thủ tục gọn nhẹ, giao xe tận nhà — hợp đi gần và du lịch ngắn ngày." },
  ];
  const tItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="screen">
      <Hero2 onCall={onCall} onZalo={onZalo} />

      <div className="journey">
        <Rail />

        {/* 01 — Dịch vụ */}
        <Chapter n="01" tag="Dịch vụ" label="Bạn cần đi đâu?">
          <div style={{ borderTop: "1px solid var(--hairline)" }}>
            {SERVICES.map((s, i) => (
              <Reveal as="div" key={i} variant="left" delay={i * 70}>
                <button className="svc-row" onClick={() => onService(s)}>
                  <span className="svc-ico"><Icon name={s.icon} size={22} /></span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 17.5, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.label}</span>
                    <span className="muted" style={{ display: "block", fontSize: 14.5, marginTop: 2 }}>{s.sub}</span>
                  </span>
                  <Icon name="arrowRight" size={19} className="svc-go" />
                </button>
              </Reveal>
            ))}
          </div>
        </Chapter>

        {/* 02 — Đội xe */}
        <Chapter n="02" tag="Đội xe" label="Xe của chúng tôi">
          <div className="stack-hint"><Icon name="cube" size={15} /> Cuộn để lật qua {CARS.length} xe</div>
          <div className="car-stack">
            {CARS.map((car, i) => (
              <div className="car-stack-item" key={car.id}
                style={{ top: 78 + i * 12, zIndex: i + 1, marginBottom: i === CARS.length - 1 ? 0 : 22, paddingBottom: 22 }}>
                <CarCard2 car={car} onOpen={onOpen} onCall={onCall} />
              </div>
            ))}
          </div>
        </Chapter>

        {/* 03 — Báo giá nhanh */}
        <EstimatorChapter onQuote={onQuote} />

        {/* 04 — Lựa chọn */}
        <Chapter n="04" tag="Lựa chọn" label="Tự lái hay có tài xế?">
          <div>
            {drive.map((o, i) => (
              <Reveal key={i} delay={i * 60} variant="left">
                <div style={{ display: "flex", gap: 16, padding: "20px 0", borderTop: "1px solid var(--hairline)", borderBottom: i === drive.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                  <span className="drive-ico"><Icon name={o.icon} size={26} className={o.cls} /></span>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.025em" }}>{o.title}</div>
                    <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.55, marginTop: 6 }}>{o.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Chapter>

        {/* 05 — Đánh giá (marquee) */}
        <Chapter n="05" tag="Đánh giá" label="Bà con tin tưởng">
          <Reveal variant="scale">
            <div className="marquee" style={{ marginLeft: -46, marginRight: -22 }}>
              <div className="marquee-track">
                {tItems.map((t, i) => (
                  <div key={i} className="card tcard" style={{ padding: "20px 18px" }} aria-hidden={i >= TESTIMONIALS.length}>
                    <Stars n={t.stars} color="var(--accent)" />
                    <p className="body" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, letterSpacing: "-0.015em" }}>“{t.quote}”</p>
                    <div className="muted" style={{ fontSize: 14, marginTop: 14, fontWeight: 500 }}>— {t.name}, {t.place}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* 06 — Đối tác */}
        <Chapter n="06" tag="Đối tác" label="">
          <Reveal>
            <div style={{ border: "1px solid var(--hairline)", borderRadius: 16, padding: "26px 22px", background: "var(--surface)" }}>
              <h2 className="h2" style={{ fontSize: 24 }}>Bạn có xe muốn cho thuê?</h2>
              <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, marginTop: 10 }}>Để xe nhàn rỗi sinh lời. Chúng tôi lo khách, lịch và hợp đồng — bạn nhận thu nhập hàng tháng.</p>
              <button className="btn btn-ghost" style={{ marginTop: 18 }}>Trở thành đối tác <Icon name="arrowUpRight" size={18} /></button>
            </div>
          </Reveal>
        </Chapter>

        {/* 07 — Vị trí */}
        <Chapter n="07" tag="Vị trí" label="Ghé nhà xe">
          <Reveal><p className="muted" style={{ fontSize: 16, lineHeight: 1.55 }}>{BRAND.address}</p></Reveal>
          <Reveal delay={90} variant="scale">
            <div style={{ marginTop: 18, borderRadius: 16, overflow: "hidden", border: "1px solid var(--hairline)", position: "relative" }}>
              <div className="imgph" style={{ position: "absolute", inset: 0, borderRadius: 0 }}><span className="lbl">Đang tải bản đồ…</span></div>
              <iframe title="Bản đồ nhà xe Trung Hiếu" src={BRAND.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ position: "relative", width: "100%", height: 210, border: 0, display: "block", filter: "grayscale(.15) contrast(1.02)" }}></iframe>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <a href={BRAND.mapLink} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 14 }}><Icon name="navigation" size={18} /> Chỉ đường tới nhà xe</a>
          </Reveal>
        </Chapter>
      </div>

      {/* Arrival / footer */}
      <footer className="arrival">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>08</span>
          <span style={{ flex: 1, height: 1, background: "var(--stage-hairline)" }} />
          <span className="eyebrow on-dark">Đến nơi</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em" }}>{BRAND.name}</div>
        <div style={{ marginTop: 4 }}><Eyebrow dark>Chủ xe · {BRAND.owner}</Eyebrow></div>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { icon: "mapPin", label: BRAND.address, action: () => window.open(BRAND.mapLink, "_blank") },
            { icon: "phone", label: BRAND.phone, action: onCall },
            { icon: "chat", label: "Zalo · " + BRAND.zalo, action: onZalo },
            { icon: "facebook", label: BRAND.facebook, action: null },
          ].map((r, i) => (
            <div key={i} onClick={r.action || undefined} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 0", borderTop: "1px solid var(--stage-hairline)", cursor: r.action ? "pointer" : "default", borderBottom: i === 3 ? "1px solid var(--stage-hairline)" : "none" }}>
              <Icon name={r.icon} size={20} style={{ color: "var(--stage-muted)", flexShrink: 0 }} />
              <span style={{ fontSize: 15.5, flex: 1 }}>{r.label}</span>
              {r.action && <Icon name="arrowUpRight" size={17} style={{ color: "var(--stage-muted)" }} />}
            </div>
          ))}
        </div>
        <div className="muted mono" style={{ fontSize: 11.5, marginTop: 26, color: "var(--stage-muted)" }}>© 2026 {BRAND.name}</div>
      </footer>
    </div>
  );
}

window.HomeScreen2 = HomeScreen2;
