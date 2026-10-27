(function () {
  let currentIndex = 0;
  let lang = "vi";
  const slides = window.EXECUTIVE_SLIDES;

  const stageEl = document.getElementById("slide-stage");
  const counterEl = document.getElementById("slide-counter");
  const progressEl = document.getElementById("progress-fill");
  const dotsEl = document.getElementById("dot-indicators");
  const notesDrawer = document.getElementById("notes-drawer");
  const notesContent = document.getElementById("notes-content");

  function renderDots() {
    dotsEl.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("div");
      dot.className = "dot" + (idx === currentIndex ? " active" : "");
      dot.addEventListener("click", () => goToSlide(idx));
      dotsEl.appendChild(dot);
    });
  }

  function buildSlideHTML(slide) {
    const kicker = lang === "vi" ? slide.kicker_vi : slide.kicker_en;
    const title = lang === "vi" ? slide.title_vi : slide.title_en;
    const lead = lang === "vi" ? slide.lead_vi : slide.lead_en;
    const cards = lang === "vi" ? slide.cards_vi : slide.cards_en;

    const cardsHTML = cards
      .map(
        (c) => `
        <div class="exec-card">
          <div class="exec-card-icon">${c.icon}</div>
          <h3>${c.title}</h3>
          <p>${c.desc}</p>
          <span class="exec-metric">${c.metric}</span>
        </div>
      `
      )
      .join("");

    const ribbonHTML =
      currentIndex === 0 || currentIndex === 2
        ? `
        <div class="flow-ribbon">
          <div class="flow-step">
            <span class="step-emoji">🛒</span>
            <strong>${lang === "vi" ? "1. Phát sinh giao dịch" : "1. Customer Action"}</strong>
            <span>${lang === "vi" ? "Web, App & Giao vận" : "Web, App & Delivery"}</span>
          </div>
          <span class="flow-arrow">➜</span>
          <div class="flow-step">
            <span class="step-emoji">📨</span>
            <strong>${lang === "vi" ? "2. Tiếp nhận & Lọc lỗi" : "2. Ingest & Filter"}</strong>
            <span>${lang === "vi" ? "Tách riêng dữ liệu hỏng" : "Auto-Quarantine Bad Data"}</span>
          </div>
          <span class="flow-arrow">➜</span>
          <div class="flow-step">
            <span class="step-emoji">🏛️</span>
            <strong>${lang === "vi" ? "3. Kho dữ liệu sạch" : "3. Governed Vault"}</strong>
            <span>${lang === "vi" ? "Bảo mật & Phân quyền" : "Privacy & Instant Search"}</span>
          </div>
          <span class="flow-arrow">➜</span>
          <div class="flow-step">
            <span class="step-emoji">📈</span>
            <strong>${lang === "vi" ? "4. Báo cáo & Dự báo AI" : "4. AI & Decisions"}</strong>
            <span>${lang === "vi" ? "Dự đoán doanh thu & rời bỏ" : "Forecasting & Retention"}</span>
          </div>
        </div>
      `
        : "";

    return `
      <div class="slide-frame">
        <span class="slide-kicker">${kicker}</span>
        <h1 class="slide-headline">${title}</h1>
        <p class="slide-lead">${lead}</p>
        <div class="cards-grid">${cardsHTML}</div>
        ${ribbonHTML}
      </div>
    `;
  }

  function renderCurrentSlide() {
    const slide = slides[currentIndex];
    const updateDOM = () => {
      stageEl.innerHTML = buildSlideHTML(slide);
      counterEl.textContent = `${currentIndex + 1} / ${slides.length}`;
      progressEl.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
      notesContent.textContent = lang === "vi" ? slide.notes_vi : slide.notes_en;
      renderDots();
    };

    if (document.startViewTransition) {
      document.startViewTransition(updateDOM);
    } else {
      updateDOM();
    }
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    renderCurrentSlide();
  }

  document.getElementById("btn-prev").addEventListener("click", () => goToSlide(currentIndex - 1));
  document.getElementById("btn-next").addEventListener("click", () => goToSlide(currentIndex + 1));

  document.getElementById("btn-notes").addEventListener("click", () => {
    notesDrawer.classList.toggle("hidden");
  });

  document.getElementById("btn-close-notes").addEventListener("click", () => {
    notesDrawer.classList.add("hidden");
  });

  document.getElementById("btn-deck-lang").addEventListener("click", () => {
    lang = lang === "vi" ? "en" : "vi";
    document.getElementById("deck-header-title").textContent =
      lang === "vi"
        ? "Nền Tảng Dữ Liệu Thông Minh & Tối Ưu Chi Phí Trên Google Cloud"
        : "Smart & Cost-Optimized Data Platform on Google Cloud";
    document.getElementById("btn-prev").textContent = lang === "vi" ? "← Slide Trước" : "← Previous";
    document.getElementById("btn-next").textContent = lang === "vi" ? "Slide Tiếp Theo →" : "Next Slide →";
    renderCurrentSlide();
  });

  document.getElementById("btn-fullscreen").addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    }
  });

  renderCurrentSlide();
})();
