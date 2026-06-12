// ===== V2 Journey: QUIET progress spine + content that performs on arrival =====
const { useEffect: useEffect2, useRef: useRef2, useState: useState2 } = React;

// A thin, low-key progress spine at the far-left edge with a tiny car marker.
// It is deliberately understated — the CONTENT is the show (see Chapter below).
function Rail() {
  const carRef = useRef2(null);
  const fillRef = useRef2(null);

  useEffect2(() => {
    const journey = document.querySelector(".journey");
    const scroller = document.querySelector(".page");
    if (!journey || !scroller) return;
    const car = carRef.current, fill = fillRef.current;
    let raf = null, lastTop = scroller.scrollTop, idleTimer = null;

    const setDrive = (cls) => {
      car.classList.remove("adv", "rev", "brake");
      if (cls) car.classList.add(cls);
    };

    const update = () => {
      raf = null;
      const sr = scroller.getBoundingClientRect();
      const jr = journey.getBoundingClientRect();
      const vh = scroller.clientHeight;
      const focus = vh * 0.4;
      const y = Math.max(0, Math.min(jr.height, focus - (jr.top - sr.top)));
      car.style.transform = `translateY(${y}px)`;
      fill.style.height = y + "px";
      const started = (jr.top - sr.top) < vh * 0.5 && (jr.bottom - sr.top) > 0;
      car.classList.toggle("on", started);
      journey.querySelectorAll(".node").forEach((n) => {
        const nr = n.getBoundingClientRect();
        const ny = nr.top - jr.top + nr.height / 2;
        n.classList.toggle("on", y >= ny - 2);
      });
    };

    const onScroll = () => {
      const top = scroller.scrollTop;
      if (top > lastTop + 0.6) setDrive("adv");        // scrolling down → moving forward
      else if (top < lastTop - 0.6) setDrive("rev");   // scrolling up → reversing
      lastTop = top;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setDrive("brake"), 170); // stopped → braking
      if (!raf) raf = requestAnimationFrame(update);
    };

    setDrive("brake");
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = setTimeout(update, 400);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t); clearTimeout(idleTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="spine" />
      <div className="spine-fill" ref={fillRef} />
      <span className="rail-start" />
      <div className="rail-dest"><Icon name="mapPin" size={15} /></div>
      <div className="rail-car" ref={carRef}>
        <div className="car">
          <div className="body" />
          <div className="glass rear" />
          <div className="roof" />
          <div className="glass front" />
          <span className="wheel fl" /><span className="wheel fr" />
          <span className="wheel rl" /><span className="wheel rr" />
          <span className="light hl l" /><span className="light hl r" />
          <span className="light tl l" /><span className="light tl r" />
        </div>
      </div>
    </React.Fragment>
  );
}

// A chapter that choreographs its own entrance when scrolled into view
// (which lines up with the car reaching it). The heading number appears,
// the rule line draws across, the tag fades in, then the label rises —
// a small signature before the content's own staggered reveals play.
function Chapter({ n, tag, label, children }) {
  const ref = useRef2(null);
  const [show, setShow] = useState2(false);
  useEffect2(() => {
    const el = ref.current; if (!el) return;
    const root = document.querySelector(".page");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShow(true); io.unobserve(el); } }),
      { root: root || null, threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    const fb = setTimeout(() => setShow(true), 1400);
    return () => { io.disconnect(); clearTimeout(fb); };
  }, []);
  return (
    <section ref={ref} className={"chapter" + (show ? " show" : "")} data-screen-label={`Chương ${n}`}>
      <span className="node" />
      <div className="chapter-head">
        <span className="chapter-num">{n}</span>
        <span className="chapter-rule" />
        <span className="chapter-tag">{tag}</span>
      </div>
      {label ? <h2 className="h2 chapter-label">{label}</h2> : null}
      {children}
    </section>
  );
}

Object.assign(window, { Rail, Chapter });
