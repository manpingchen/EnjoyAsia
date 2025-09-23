document.addEventListener("DOMContentLoaded", () => {
  // 選取 DOM 元素
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".mobile-menu-overlay");
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeIcon = document.querySelector(".close-icon");
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

document.addEventListener("DOMContentLoaded", () => {
  // 選取 DOM 元素
  const menuToggle = document.querySelector(".category-toggle");
  const menuOverlay = document.querySelector(".mobile-category-overlay");
  const mobileMenu = document.querySelector(".category-menu");
  const closeIcon = document.querySelector(".close-icon");
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

// 首頁文章卡片滑動效果

const articleLists = document.querySelectorAll(".slide-article-list");

articleLists.forEach((articleList) => {
  const prevBtn = articleList.parentElement.querySelector(".scroll li:first-child");
  const nextBtn = articleList.parentElement.querySelector(".scroll li:last-child");

  let isDown = false;
  let startX;
  let scrollLeft;

  // 滑鼠拖曳
  articleList.addEventListener("mousedown", (e) => {
    isDown = true;
    articleList.classList.add("grabbing");
    startX = e.pageX - articleList.offsetLeft;
    scrollLeft = articleList.scrollLeft;
  });
  articleList.addEventListener("mouseleave", () => {
    isDown = false;
    articleList.classList.remove("grabbing");
  });
  articleList.addEventListener("mouseup", () => {
    isDown = false;
    articleList.classList.remove("grabbing");
  });
  articleList.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - articleList.offsetLeft;
    const walk = (x - startX) * 1.5; // 滑動速度
    articleList.scrollLeft = scrollLeft - walk;
  });

  // 左右箭頭
  const cardWidth = 304;
  prevBtn.addEventListener("click", () => {
    articleList.scrollBy({ left: -cardWidth, behavior: "smooth" });
  });
  nextBtn.addEventListener("click", () => {
    articleList.scrollBy({ left: cardWidth, behavior: "smooth" });
  });
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
