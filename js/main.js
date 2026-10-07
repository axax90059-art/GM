/* =========================================================
   FIH – E/EA Solutions  |  main script
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const REDUCE_MOTION = reduceMotion;

  /* ---------- 設定 ---------- */
  const EVENT_START = new Date("2026-11-17T09:30:00"); // 活動開始時間（使用者本地時區）
  const EVENT_END = new Date("2026-11-17T14:00:00");
  const AUTOPLAY_MS = 6000; // 產品自動輪播間隔

  /* ---------- 開場動畫：播完 / Skip / 出錯 / 逾時 都會進入網站 ---------- */
  // 開場動畫結束的時間點：背景動畫、產品圖預載等「重的工作」等開場結束才開始，避免跟影片搶資源造成卡頓
  let introResolve;
  const introDone = new Promise((r) => (introResolve = r));

  function playIntro(onDone) {
    const intro = $("#intro"), video = $("#introVideo"), bgCanvas = $("#introBg"), bar = $("#introProgress");
    const mobileMQ = matchMedia("(max-width: 767px)");
    let finished = false;
    const timers = [];
    const finish = () => {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      intro.classList.add("done");
      document.body.classList.remove("intro-on");
      video.pause();
      setTimeout(() => intro.remove(), 1000);
      onDone();
      setTimeout(introResolve, 300);   // 等淡出開始後再啟動背景動畫等工作，讓轉場順暢
    };
    if (REDUCE_MOTION) { intro.remove(); document.body.classList.remove("intro-on"); onDone(); introResolve(); return; }

    timers.push(setTimeout(finish, 16000));   // 保險：不管任何狀況，最多 16 秒一定進網站

    // 開場期間先把 Banner 解碼好，淡出時就不會卡一下
    const banner = $(".hero-img");
    if (banner && banner.decode) banner.decode().catch(() => {});

    // 影片真的開始播放才淡入，避免先閃黑畫面
    video.addEventListener("playing", () => intro.classList.add("playing"));

    // 手機：用 64×36 的小畫布複製影片畫面再放大，當作上下的模糊背景（比第二支影片＋即時模糊輕很多）
    const ctx = bgCanvas.getContext("2d");
    const paintBg = () => {
      if (finished) return;
      if (mobileMQ.matches && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, bgCanvas.width, bgCanvas.height);
        ctx.fillStyle = "rgba(2, 10, 20, 0.55)";
        ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      }
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(paintBg);
      else requestAnimationFrame(paintBg);
    };
    paintBg();

    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);
    video.addEventListener("timeupdate", () => {
      if (video.duration) bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
    });
    $("#introSkip").addEventListener("click", finish);
    addEventListener("keydown", (e) => { if (e.key === "Escape") finish(); });

    const tryPlay = (retries) => {
      const p = video.play();
      if (!p) return;
      p.catch((err) => {
        if (err.name === "NotAllowedError") return finish();          // 瀏覽器禁止自動播放 → 直接進網站
        if (retries > 0) setTimeout(() => tryPlay(retries - 1), 500); // 其他中斷（例如省電暫停）→ 稍後重試
      });
    };
    const start = () => {
      // 影片已在 HTML 裡設定 autoplay、一打開就開始下載；緩衝足夠時瀏覽器會自動播放，這裡只是保險
      if (video.paused) {
        if (video.readyState >= 4) tryPlay(6);
        else video.addEventListener("canplaythrough", () => tryPlay(6), { once: true });
      }
      timers.push(setTimeout(() => { if (video.currentTime === 0) tryPlay(2); }, 3000));   // 3 秒還沒播：再試一次
      timers.push(setTimeout(() => { if (video.currentTime === 0) finish(); }, 7000));    // 7 秒還沒開始（網路很慢）→ 跳過
    };
    if (!document.hidden) start();
    else document.addEventListener("visibilitychange", function onShow() {          // 在背景分頁開啟：切回來才開始播
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", onShow);
      start();
    });
  }

  /* ---------- Banner：視窗寬度跨過 767px 時，強制重新挑選橫版／直版 ---------- */
  const heroImg = $(".hero-img");
  const bannerMQ = matchMedia("(max-width: 767px)");
  bannerMQ.addEventListener("change", () => { heroImg.src = heroImg.getAttribute("src"); });

  /* =========================================================
     1. 背景：電路板粒子動畫
     ========================================================= */
  const canvas = $("#bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, nodes = [], pulses = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    const count = Math.round((innerWidth * innerHeight) / 18000);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  function drawBg() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const maxD = 130;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > innerWidth) a.vx *= -1;
      if (a.y < 0 || a.y > innerHeight) a.vy *= -1;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxD) {
          // 用直角折線，模擬 PCB 走線
          ctx.strokeStyle = `rgba(56,214,255,${(1 - d / maxD) * 0.18})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if (!reduceMotion && Math.random() < 0.0006) pulses.push({ a, b, t: 0 });
        }
      }
      ctx.fillStyle = "rgba(127,227,255,0.8)";
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    // 沿走線跑的光點
    pulses = pulses.filter((p) => p.t <= 1);
    for (const p of pulses) {
      p.t += 0.02;
      const seg1 = Math.abs(p.b.x - p.a.x), seg2 = Math.abs(p.b.y - p.a.y);
      const total = seg1 + seg2 || 1;
      const dist = p.t * total;
      let x, y;
      if (dist < seg1) { x = p.a.x + Math.sign(p.b.x - p.a.x) * dist; y = p.a.y; }
      else { x = p.b.x; y = p.a.y + Math.sign(p.b.y - p.a.y) * (dist - seg1); }
      const g = ctx.createRadialGradient(x, y, 0, x, y, 8);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(1, "rgba(56,214,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(drawBg);
  }
  addEventListener("resize", resize);
  resize();
  introDone.then(() => requestAnimationFrame(drawBg));   // 開場結束後才開始畫背景

  /* =========================================================
     2. 導覽列 / 捲動出現動畫
     ========================================================= */
  const topbar = $("#topbar");
  addEventListener("scroll", () => topbar.classList.toggle("scrolled", scrollY > 20), { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  // 開場動畫結束後，才開始畫面淡入
  playIntro(() => {
    $$(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 0.08}s`;
      // 第一屏看得到的直接淡入（不必等捲動偵測），其他的捲到才淡入
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
      else io.observe(el);
    });
  });

  // 數字跳動
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.count, suffix = el.dataset.suffix || "";
      const dec = (el.dataset.count.split(".")[1] || "").length;   // 支援小數，例如 3.6
      const t0 = performance.now(), dur = 1600;
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* =========================================================
     3. 倒數計時
     ========================================================= */
  const cd = $("#countdown");
  function tick() {
    const now = new Date();
    if (now >= EVENT_END) { cd.classList.add("live"); cd.innerHTML = "<div><b>Thank you for visiting!</b></div>"; return; }
    if (now >= EVENT_START) { cd.classList.add("live"); cd.innerHTML = '<div><b>● LIVE NOW</b><span>Visit our booth</span></div>'; return; }
    let s = Math.floor((EVENT_START - now) / 1000);
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    const pad = (n) => String(n).padStart(2, "0");
    $('[data-cd="d"]', cd).textContent = d;
    $('[data-cd="h"]', cd).textContent = pad(h);
    $('[data-cd="m"]', cd).textContent = pad(m);
    $('[data-cd="s"]', cd).textContent = pad(s);
    setTimeout(tick, 1000);
  }
  tick();

  /* =========================================================
     4. 產品輪播
     ========================================================= */
  const card = $("#card");
  const pImg = $("#pImg"), pName = $("#pName"), pDesc = $("#pDesc"), pCat = $("#pCat");
  const pIdx = $("#pIdx"), pTotal = $("#pTotal"), bar = $("#progressBar");
  const thumbsEl = $("#thumbs"), filtersEl = $("#filters");

  let list = PRODUCTS.map((p, i) => ({ ...p, i })); // 目前篩選後的清單
  let cur = 0;
  let busy = false;
  let timer = null, barAnim = null;

  // 預載所有圖片，避免換頁閃爍
  introDone.then(() => PRODUCTS.forEach((p) => { const im = new Image(); im.src = p.img; }));   // 開場結束後才預載

  // 分類按鈕（固定順序；不在 MAIN_CATS 裡的分類，例如 Chassis / Security / Access，都歸到 Others）
  const MAIN_CATS = ["TCU", "ZCU", "HPC", "ADAS", "IVI"];
  const groupOf = (p) => (MAIN_CATS.includes(p.cat) ? p.cat : "Others");
  const cats = ["All", ...MAIN_CATS.filter((c) => PRODUCTS.some((p) => p.cat === c)),
    ...(PRODUCTS.some((p) => groupOf(p) === "Others") ? ["Others"] : [])];
  filtersEl.innerHTML = cats
    .map((c) => `<button class="chip${c === "All" ? " active" : ""}" role="tab" data-cat="${c}">${c}</button>`)
    .join("");
  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (btn) applyFilter(btn.dataset.cat);
  });

  // 縮圖
  thumbsEl.innerHTML = PRODUCTS.map(
    (p, i) => `<button class="thumb" data-i="${i}" aria-label="${p.name}"><img data-src="${p.img}" alt="" /></button>`
  ).join("");
  const thumbBtns = $$(".thumb", thumbsEl);
  // 縮圖等開場動畫結束才載入，避免跟影片搶頻寬
  introDone.then(() => $$("img[data-src]", thumbsEl).forEach((im) => (im.src = im.dataset.src)));
  thumbsEl.addEventListener("click", (e) => {
    const t = e.target.closest(".thumb");
    if (!t) return;
    const k = list.findIndex((p) => p.i === +t.dataset.i);
    if (k >= 0) go(k, k > cur ? 1 : -1);
  });

  function applyFilter(cat, scroll) {
    $$(".chip", filtersEl).forEach((c) => c.classList.toggle("active", c.dataset.cat === cat));
    list = PRODUCTS.map((p, i) => ({ ...p, i })).filter((p) => cat === "All" || groupOf(p) === cat);
    thumbBtns.forEach((t) => t.classList.toggle("hidden", !list.some((p) => p.i === +t.dataset.i)));
    cur = -1;
    busy = false;
    card.classList.remove("leaving", "entering");
    go(0, 1, true);
    if (scroll) $("#products").scrollIntoView({ behavior: "smooth" });
  }

  // 標題「解碼」文字特效
  function decode(el, text) {
    if (reduceMotion) { el.textContent = text; return; }
    const chars = "!<>-_\\/[]{}=+*^?#01ABCDEF";
    let frame = 0;
    const total = 22;
    const run = () => {
      const reveal = Math.floor((frame / total) * text.length);
      el.textContent = text
        .split("")
        .map((ch, i) => (i < reveal || ch === " " ? ch : chars[(Math.random() * chars.length) | 0]))
        .join("");
      if (++frame <= total) el._decode = setTimeout(run, 28);
      else el.textContent = text;
    };
    clearTimeout(el._decode);
    run();
  }

  function render(dir) {
    const p = list[cur];
    card.style.setProperty("--dir", dir);
    card.style.setProperty("--flash-x", dir > 0 ? "80%" : "20%");
    pImg.src = p.img;
    pImg.alt = p.name;
    pCat.textContent = p.cat;
    pDesc.textContent = p.desc;
    decode(pName, p.name);
    pIdx.textContent = String(cur + 1).padStart(2, "0");
    pTotal.textContent = String(list.length).padStart(2, "0");

    thumbBtns.forEach((t) => t.classList.toggle("active", +t.dataset.i === p.i));
    const active = thumbBtns[p.i];
    // 只捲動縮圖列本身，不影響整頁
    thumbsEl.scrollTo({ left: active.offsetLeft - thumbsEl.clientWidth / 2 + active.clientWidth / 2, behavior: "smooth" });
  }

  function go(next, dir = 1, instant = false) {
    if (busy || !list.length) return;
    next = (next + list.length) % list.length;
    if (next === cur) return;
    busy = true;
    card.style.setProperty("--dir", dir);
    const swap = () => {
      cur = next;
      card.classList.remove("leaving");
      render(dir);
      void card.offsetWidth; // restart animation
      card.classList.add("entering");
      setTimeout(() => { card.classList.remove("entering"); busy = false; }, 820);
      restartAutoplay();
    };
    if (instant || reduceMotion) { swap(); return; }
    card.classList.remove("entering");
    card.classList.add("leaving");
    setTimeout(swap, 360);
  }

  const next = () => go(cur + 1, 1);
  const prev = () => go(cur - 1, -1);
  $("#nextBtn").addEventListener("click", next);
  $("#prevBtn").addEventListener("click", prev);

  // 自動播放 + 進度條
  // 開場動畫結束前不自動換產品（換頁特效很吃效能，會讓開場影片卡頓）
  let introFinished = false;
  introDone.then(() => { introFinished = true; restartAutoplay(); });

  function restartAutoplay() {
    clearTimeout(timer);
    barAnim?.cancel();
    if (!introFinished || list.length < 2) return;
    barAnim = bar.animate([{ width: "0%" }, { width: "100%" }], { duration: AUTOPLAY_MS, easing: "linear", fill: "forwards" });
    timer = setTimeout(next, AUTOPLAY_MS);
  }
  const pause = () => { clearTimeout(timer); barAnim?.pause(); };
  const resume = () => {
    if (!introFinished) return;
    if (!barAnim || list.length < 2) return;
    barAnim.play();
    const remain = AUTOPLAY_MS - (barAnim.currentTime || 0);
    clearTimeout(timer);
    timer = setTimeout(next, Math.max(remain, 0));
  };
  card.addEventListener("mouseenter", pause);
  card.addEventListener("mouseleave", resume);
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));

  // 鍵盤左右鍵
  addEventListener("keydown", (e) => {
    const r = $("#products").getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // 手機滑動
  let sx = 0, sy = 0;
  card.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; pause(); }, { passive: true });
  card.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    else resume();
  });

  // 滑鼠 3D 傾斜
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  }

  cur = -1;
  go(0, 1, true);
})();
