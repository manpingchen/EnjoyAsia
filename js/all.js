/* =========================
   手機主選單
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".mobile-menu-overlay");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  if (!menuToggle || !menuOverlay || !mobileMenu) return;

  menuToggle.addEventListener("click", () => {
    menuOverlay.style.display = "block";
    setTimeout(() => {
      mobileMenu.classList.add("is-active");
      body.classList.add("menu-open");
    }, 10);
  });

  menuOverlay.addEventListener(
    "click",
    (event) => {
      if (event.target === menuOverlay || event.target.closest(".close-icon")) {
        mobileMenu.classList.remove("is-active");
        body.classList.remove("menu-open");
        mobileMenu.addEventListener(
          "transitionend",
          () => {
            menuOverlay.style.display = "none";
          },
          { once: true }
        );
      }
    },
    { passive: true }
  );
});

/* =========================
   手機分類選單
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".category-toggle");
  const menuOverlay = document.querySelector(".mobile-category-overlay");
  const mobileMenu = document.querySelector(".category-menu");
  const body = document.body;

  if (!menuToggle || !menuOverlay || !mobileMenu) return;

  menuToggle.addEventListener("click", () => {
    menuOverlay.style.display = "block";
    setTimeout(() => {
      mobileMenu.classList.add("is-active");
      body.classList.add("menu-open");
    }, 10);
  });

  menuOverlay.addEventListener(
    "click",
    (event) => {
      if (event.target === menuOverlay || event.target.closest(".close-icon")) {
        mobileMenu.classList.remove("is-active");
        body.classList.remove("menu-open");
        mobileMenu.addEventListener(
          "transitionend",
          () => {
            menuOverlay.style.display = "none";
          },
          { once: true }
        );
      }
    },
    { passive: true }
  );
});

/* =========================
   首頁文章卡片滑動
========================= */
(() => {
  const lists = document.querySelectorAll(".slide-article-list");

  lists.forEach((list) => {
    const prevBtn = list.parentElement?.querySelector(".scroll li:first-child") || null;
    const nextBtn = list.parentElement?.querySelector(".scroll li:last-child") || null;

    const EPS = 1; // 容差
    const maxScrollLeftOf = (el) => Math.max(0, el.scrollWidth - el.clientWidth);

    function updateArrows() {
      if (!prevBtn || !nextBtn) return;
      const max = maxScrollLeftOf(list);
      const x = list.scrollLeft;

      if (max <= EPS) {
        prevBtn.style.opacity = "0.4";
        nextBtn.style.opacity = "0.4";
        prevBtn.style.pointerEvents = "none";
        nextBtn.style.pointerEvents = "none";
        return;
      }
      const atStart = x <= EPS;
      const atEnd = x >= max - EPS;
      prevBtn.style.opacity = atStart ? "0.4" : "1";
      prevBtn.style.pointerEvents = atStart ? "none" : "";
      nextBtn.style.opacity = atEnd ? "0.4" : "1";
      nextBtn.style.pointerEvents = atEnd ? "none" : "";
    }

    // ---------- 自訂拖曳（禁止橡皮筋、邊界即時鉗制） ----------
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    let pointerId = null;

    const onDown = (clientX, e) => {
      isDragging = true;
      startX = clientX;
      startLeft = list.scrollLeft;
      list.style.scrollBehavior = "auto"; // 拖曳期間關閉平滑，以免干擾
      list.classList.add("grabbing");
      if (e && "pointerId" in e && list.setPointerCapture) {
        pointerId = e.pointerId;
        try { list.setPointerCapture(pointerId); } catch (_) {}
      }
    };

    const onMove = (clientX, e) => {
      if (!isDragging) return;
      // 阻止瀏覽器預設橫向橡皮筋
      if (e && typeof e.preventDefault === "function") e.preventDefault();

      const dx = clientX - startX;
      let next = startLeft - dx; // 右拖增加 scrollLeft
      const max = maxScrollLeftOf(list);
      if (next < 0) next = 0;
      if (next > max) next = max;
      if (list.scrollLeft !== next) list.scrollLeft = next;
      updateArrows();
    };

    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      list.classList.remove("grabbing");
      list.style.scrollBehavior = "smooth"; // 還原
    };

    // Pointer 事件（新瀏覽器）
    list.addEventListener("pointerdown", (e) => {
      // 僅處理主鍵/觸控
      if (e.button !== 0 && e.pointerType !== "touch") return;
      onDown(e.clientX, e);
    });
    list.addEventListener("pointermove", (e) => onMove(e.clientX, e), { passive: false });
    list.addEventListener("pointerup", onUp, { passive: true });
    list.addEventListener("pointercancel", onUp, { passive: true });
    list.addEventListener("pointerleave", onUp, { passive: true });

    // Touch 回退（舊 iOS）
    list.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX, e), { passive: true });
    list.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX, e), { passive: false });
    list.addEventListener("touchend", onUp, { passive: true });
    list.addEventListener("touchcancel", onUp, { passive: true });

    // 滾動時只更新箭頭（不再做 clamp，因為拖曳已經鉗住）
    list.addEventListener("scroll", updateArrows, { passive: true });

    // 左右箭頭：一次兩張
    function getStep() {
      const card = list.querySelector(".article-card");
      if (!card) return 0;
      const cardW = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(list).gap || "0") || 0;
      return cardW + gap;
    }
    function scrollByTwo(dir = 1) {
      const step = getStep();
      if (!step) return;
      const max = maxScrollLeftOf(list);
      const target = Math.max(0, Math.min(list.scrollLeft + dir * step * 2, max));
      list.style.scrollBehavior = "smooth";
      list.scrollTo({ left: target, behavior: "smooth" });
    }
    prevBtn?.addEventListener("click", () => scrollByTwo(-1));
    nextBtn?.addEventListener("click", () => scrollByTwo(1));

    // 初始化
    updateArrows();
    window.addEventListener("resize", updateArrows, { passive: true });
  });
})();


/* =========================
   FAQ 展開收合
========================= */
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    button.classList.toggle("active");
    if (button.classList.contains("active")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});

/* =========================
   浮動官方聯絡（中間對齊放大）
========================= */
(() => {
  const widget = document.querySelector(".support-float");
  if (!widget) return;

  const inner = widget.querySelector(".support-inner");
  const items = Array.from(widget.querySelectorAll(".support-item"));

  function setActive(index) {
    items.forEach((it, i) => {
      if (i === index) it.classList.add("active");
      else it.classList.remove("active");
    });
  }

  function findClosestIndex() {
    const rect = inner.getBoundingClientRect();
    const containerCenter = rect.top + rect.height / 2;
    let closest = { idx: 0, dist: Infinity };
    items.forEach((it, i) => {
      const r = it.getBoundingClientRect();
      const itemCenter = r.top + r.height / 2;
      const d = Math.abs(itemCenter - containerCenter);
      if (d < closest.dist) closest = { idx: i, dist: d };
    });
    return closest.idx;
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const idx = findClosestIndex();
        setActive(idx);
        ticking = false;
      });
      ticking = true;
    }
  }

  // 初始標記
  setTimeout(() => setActive(findClosestIndex()), 50);

  inner.addEventListener("scroll", onScroll, { passive: true });

  // 點擊跳轉
  items.forEach((it) => {
    it.addEventListener("click", () => {
      const href = it.dataset.href;
      if (!href) return;
      if (href.startsWith("tel:")) {
        window.location.href = href;
      } else {
        window.open(href, "_blank");
      }
    });
    it.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        it.click();
      }
    });
  });

  window.addEventListener(
    "resize",
    () => {
      setActive(findClosestIndex());
    },
    { passive: true }
  );
})();

/* =========================
   iOS 100vh 修正
========================= */
(function fixMobileVh() {
  function setVhVar() {
    const h =
      (window.visualViewport ? window.visualViewport.height : window.innerHeight) ||
      window.innerHeight;
    document.documentElement.style.setProperty("--vh", `${h}px`);
  }
  setVhVar();
  window.addEventListener("resize", setVhVar, { passive: true });
  window.addEventListener("orientationchange", setVhVar, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) setVhVar();
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setVhVar, { passive: true });
  }
})();
