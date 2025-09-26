// === 手機主選單 ===
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

  menuOverlay.addEventListener("click", (event) => {
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
  });
});

// === 手機分類選單 ===
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

  menuOverlay.addEventListener("click", (event) => {
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
  });
});

// === 首頁文章卡片滑動 ===
const articleLists = document.querySelectorAll(".slide-article-list");

articleLists.forEach((list) => {
  const prevBtn = list.parentElement.querySelector(".scroll li:first-child");
  const nextBtn = list.parentElement.querySelector(".scroll li:last-child");

  const EPS = 1;
  const maxScrollLeftOf = (el) => el.scrollWidth - el.clientWidth;

  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    const max = maxScrollLeftOf(list);
    const x = list.scrollLeft;

    if (max <= EPS) {
      prevBtn.style.opacity = 0.4;
      nextBtn.style.opacity = 0.4;
      prevBtn.style.pointerEvents = "none";
      nextBtn.style.pointerEvents = "none";
      return;
    }

    const atStart = x <= EPS;
    const atEnd = x >= max - EPS;

    prevBtn.style.opacity = atStart ? 0.4 : 1;
    prevBtn.style.pointerEvents = atStart ? "none" : "";
    nextBtn.style.opacity = atEnd ? 0.4 : 1;
    nextBtn.style.pointerEvents = atEnd ? "none" : "";
  }

  function clampAndSet(x) {
    const max = maxScrollLeftOf(list);
    if (x < 0) x = 0;
    if (x > max) x = max;
    list.scrollLeft = x;
    updateArrows();
  }

  function getStep() {
    const card = list.querySelector(".article-card");
    if (!card) return 0;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(list).gap || "0") || 0;
    return cardW + gap;
  }

  // --- 滑鼠拖曳（自由捲動，不吸附）---
  let isDown = false, startX = 0, startScrollLeft = 0;
  list.addEventListener("mousedown", (e) => {
    isDown = true;
    list.classList.add("grabbing");
    startX = e.pageX - list.offsetLeft;
    startScrollLeft = list.scrollLeft;
  });
  list.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - list.offsetLeft;
    const walk = (x - startX) * 1.5;
    clampAndSet(startScrollLeft - walk);
  });
  list.addEventListener("mouseup", () => {
    isDown = false;
    list.classList.remove("grabbing");
  });
  list.addEventListener("mouseleave", () => {
    if (!isDown) return;
    isDown = false;
    list.classList.remove("grabbing");
  });

  // --- 觸控（自由捲動，不吸附）---
  let lastTouchX = 0;
  list.addEventListener("touchstart", (e) => {
    isDown = true;
    lastTouchX = e.touches[0].pageX;
    startX = lastTouchX - list.offsetLeft;
    startScrollLeft = list.scrollLeft;
  }, { passive: true });

  list.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const currX = e.touches[0].pageX;
    const deltaX = currX - lastTouchX;
    lastTouchX = currX;

    const max = maxScrollLeftOf(list);
    const atStart = list.scrollLeft <= EPS;
    const atEnd = list.scrollLeft >= max - EPS;
    if ((atStart && deltaX > 0) || (atEnd && deltaX < 0)) e.preventDefault();

    const x = currX - list.offsetLeft;
    const walk = (x - startX) * 1.5;
    clampAndSet(startScrollLeft - walk);
  }, { passive: false });

  list.addEventListener("touchend", () => {
    isDown = false;
  }, { passive: true });

  // --- 更新箭頭 ---
  let scrollTicking = false;
  list.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const max = maxScrollLeftOf(list);
        const x = list.scrollLeft;
        if (x < 0 || x > max) clampAndSet(x);
        else updateArrows();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // --- 左右箭頭：一次兩張 ---
  function scrollByTwo(dir = 1) {
    const step = getStep();
    if (!step) return;
    const max = maxScrollLeftOf(list);
    const target = Math.max(0, Math.min(list.scrollLeft + dir * step * 2, max));
    list.scrollTo({ left: target, behavior: "smooth" });
  }
  prevBtn?.addEventListener("click", () => scrollByTwo(-1));
  nextBtn?.addEventListener("click", () => scrollByTwo(1));

  updateArrows();
  window.addEventListener("resize", () => updateArrows());
});

// === FAQ 展開收合 ===
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

// === 浮動官方聯絡 ===
(function () {
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

  setTimeout(() => {
    const idx = findClosestIndex();
    setActive(idx);
  }, 50);

  inner.addEventListener("scroll", onScroll, { passive: true });

  items.forEach((it) => {
    it.addEventListener("click", () => {
      const href = it.dataset.href;
      if (href) {
        if (href.startsWith("tel:")) {
          window.location.href = href;
        } else {
          window.open(href, "_blank");
        }
      }
    });
    it.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        it.click();
      }
    });
  });

  window.addEventListener("resize", () => {
    const idx = findClosestIndex();
    setActive(idx);
  });
})();

// === iOS vh 修正 ===
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
