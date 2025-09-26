document.addEventListener("DOMContentLoaded", () => {
  // 選取 DOM 元素
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".mobile-menu-overlay");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  // 開啟選單
  menuToggle.addEventListener("click", () => {
    menuOverlay.style.display = "block"; // 顯示遮罩
    setTimeout(() => {
      mobileMenu.classList.add("is-active"); // 選單滑入
      body.classList.add("menu-open"); // 鎖定背景捲軸
    }, 10); // 確保 display:block 生效後再觸發過渡效果
  });

  // 關閉選單 (點擊箭頭或遮罩)
  menuOverlay.addEventListener("click", (event) => {
    // 確保只有點擊到遮罩或關閉按鈕才執行
    if (event.target === menuOverlay || event.target.closest(".close-icon")) {
      mobileMenu.classList.remove("is-active"); // 選單滑出
      body.classList.remove("menu-open"); // 解鎖背景捲軸

      // 過渡結束後再隱藏遮罩
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

document.addEventListener("DOMContentLoaded", () => {
  // 選取 DOM 元素
  const menuToggle = document.querySelector(".category-toggle");
  const menuOverlay = document.querySelector(".mobile-category-overlay");
  const mobileMenu = document.querySelector(".category-menu");
  const body = document.body;

  // 開啟選單
  menuToggle.addEventListener("click", () => {
    menuOverlay.style.display = "block"; // 顯示遮罩
    setTimeout(() => {
      mobileMenu.classList.add("is-active"); // 選單滑入
      body.classList.add("menu-open"); // 鎖定背景捲軸
    }, 10); // 這裡使用 setTimeout 是為了確保 display:block 生效後再觸發過渡效果
  });

  // 關閉選單 (點擊箭頭或遮罩)
  menuOverlay.addEventListener("click", (event) => {
    // 確保只有點擊到遮罩或關閉按鈕才執行
    if (event.target === menuOverlay || event.target.closest(".close-icon")) {
      mobileMenu.classList.remove("is-active"); // 選單滑出
      body.classList.remove("menu-open"); // 解鎖背景捲軸

      // 過渡結束後再隱藏遮罩
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

// 首頁文章卡片滑動效果（箭頭=每次兩張；拖曳=自由滑）
const articleLists = document.querySelectorAll(".slide-article-list");

articleLists.forEach((list) => {
  const prevBtn = list.parentElement.querySelector(".scroll li:first-child");
  const nextBtn = list.parentElement.querySelector(".scroll li:last-child");

  // 動態抓單卡步距：卡片寬 + gap
  function getStep() {
    const card = list.querySelector(".article-card");
    if (!card) return 0;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(list).gap || "0") || 0;
    return cardW + gap;
  }
  const maxScrollLeftOf = (el) => el.scrollWidth - el.clientWidth;

  // 夾住邊界 + 箭頭狀態
  function clampAndSet(x) {
    const max = maxScrollLeftOf(list);
    if (x < 0) x = 0;
    if (x > max) x = max;
    if (list.scrollLeft !== x) list.scrollLeft = x;

    if (prevBtn) {
      prevBtn.style.opacity = x <= 0 ? 0.4 : 1;
      prevBtn.style.pointerEvents = x <= 0 ? "none" : "";
    }
    if (nextBtn) {
      nextBtn.style.opacity = x >= max ? 0.4 : 1;
      nextBtn.style.pointerEvents = x >= max ? "none" : "";
    }
  }

  // --- 滑鼠拖曳（自由滑，不吸附兩張）---
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

  // --- 觸控（自由滑＋iOS 邊界阻擋）---
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
    const atStart = list.scrollLeft <= 0;
    const atEnd = list.scrollLeft >= max;
    if ((atStart && deltaX > 0) || (atEnd && deltaX < 0)) e.preventDefault(); // 阻擋邊界橡皮筋

    const x = currX - list.offsetLeft;
    const walk = (x - startX) * 1.5;
    clampAndSet(startScrollLeft - walk);
  }, { passive: false });

  list.addEventListener("touchend", () => {
    isDown = false;
  }, { passive: true });

  // --- 慣性滑動期間保邊界 ---
  let scrollTicking = false;
  list.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const max = maxScrollLeftOf(list);
        const x = list.scrollLeft;
        if (x < 0 || x > max) clampAndSet(x);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // --- 左右箭頭：一次兩張 ---
  function scrollByTwo(dir = 1) {
    const step = getStep();
    if (!step) return;
    const target = list.scrollLeft + dir * step * 2;
    // 用 smooth 更順（也會再被 clamp）
    list.scrollTo({ left: Math.max(0, Math.min(target, maxScrollLeftOf(list))), behavior: "smooth" });
  }
  prevBtn?.addEventListener("click", () => scrollByTwo(-1));
  nextBtn?.addEventListener("click", () => scrollByTwo(1));

  // 初始化
  clampAndSet(list.scrollLeft);
  window.addEventListener("resize", () => clampAndSet(list.scrollLeft));
});


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

// 浮動官方聯絡: 自動標記置中 item 為 active，並支援點擊
(function () {
  const widget = document.querySelector(".support-float");
  if (!widget) return;
  const inner = widget.querySelector(".support-inner");
  const items = Array.from(widget.querySelectorAll(".support-item"));

  // helper: 設定 active（移除其他）
  function setActive(index) {
    items.forEach((it, i) => {
      if (i === index) it.classList.add("active");
      else it.classList.remove("active");
    });
  }

  // 找距離容器中點最近的 item index
  function findClosestIndex() {
    const rect = inner.getBoundingClientRect();
    const containerCenter = rect.top + rect.height / 2;
    let closest = { idx: 0, dist: Infinity };
    items.forEach((it, i) => {
      const r = it.getBoundingClientRect();
      const itemCenter = r.top + r.height / 2;
      const d = Math.abs(itemCenter - containerCenter);
      if (d < closest.dist) {
        closest = { idx: i, dist: d };
      }
    });
    return closest.idx;
  }

  // on scroll：使用 rAF 更新 active（避免過度觸發）
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

  // 初始計算
  setTimeout(() => {
    // 若想預設讓第二個 (index 1) 在中間，將 scrollTop 調整到該位置
    // 例如 inner.scrollTop = items[1].offsetTop - inner.clientHeight/2 + items[1].clientHeight/2;
    const idx = findClosestIndex();
    setActive(idx);
  }, 50);

  inner.addEventListener("scroll", onScroll, { passive: true });

  // 點擊時：讀取 data-href 或觸發行為
  items.forEach((it) => {
    it.addEventListener("click", (e) => {
      const href = it.dataset.href;
      if (href) {
        // 若是電話 (tel:) 或外部網址，用 location.href 或 open
        if (href.startsWith("tel:")) {
          window.location.href = href;
        } else {
          // 新分頁打開外部連結
          window.open(href, "_blank");
        }
      } else {
        // 若沒有 href，可當作內部互動：例如開啟聊天視窗
        console.log("support item clicked", it);
      }
    });

    // 鍵盤啟動（Enter / Space）
    it.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        it.click();
      }
    });
  });

  // 可選：當視窗尺寸改變，重新設 active
  window.addEventListener("resize", () => {
    const idx = findClosestIndex();
    setActive(idx);
  });
})();

(function fixMobileVh() {
  function setVhVar() {
    const h =
      (window.visualViewport ? window.visualViewport.height : window.innerHeight) ||
      window.innerHeight;
    document.documentElement.style.setProperty("--vh", `${h}px`);
  }
  setVhVar();

  // 監聽各種可能改變可視高度的事件
  window.addEventListener("resize", setVhVar, { passive: true });
  window.addEventListener("orientationchange", setVhVar, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) setVhVar();
  });

  // iOS 上地址列伸縮時會觸發
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setVhVar, { passive: true });
  }
})();
