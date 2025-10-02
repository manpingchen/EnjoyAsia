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

    // 只需要原生滾動：不要自訂拖曳、不要 preventDefault
    list.style.scrollBehavior = "auto"; // 讓手指拖曳時完全原生
    // 若你有在 CSS 設定 smooth，可保留，下面會在按鈕時再動態開啟

    const EPS = 1;
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

    // 捲動時只更新箭頭；不 clamp，保留原生慣性
    list.addEventListener("scroll", updateArrows, { passive: true });

    // 捲動「結束」時做一次邊界校正（避免 iOS 橡皮筋殘留 > 5vw）
    let endTimer = 0;
    const onScrollEnd = () => {
      const max = maxScrollLeftOf(list);
      let x = list.scrollLeft;
      if (x < 0 || x > max) {
        list.scrollTo({ left: Math.max(0, Math.min(x, max)), behavior: "smooth" });
      }
    };
    list.addEventListener(
      "scroll",
      () => {
        clearTimeout(endTimer);
        endTimer = setTimeout(onScrollEnd, 90); // 90ms 無事件視為「結束」
      },
      { passive: true }
    );

    // 左右箭頭保留（一次兩張）
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
      // 按鈕行為用 smooth，不影響手指拖曳
      list.style.scrollBehavior = "smooth";
      list.scrollTo({ left: target, behavior: "smooth" });
      // 下一次手指拖曳仍是原生
      setTimeout(() => (list.style.scrollBehavior = "auto"), 300);
    }
    prevBtn?.addEventListener("click", () => scrollByTwo(-1));
    nextBtn?.addEventListener("click", () => scrollByTwo(1));

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
