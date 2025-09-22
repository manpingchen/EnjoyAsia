document.addEventListener("DOMContentLoaded", () => {
  // 選取 DOM 元素
  const menuToggle = document.querySelector(".js-menu-toggle");
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

// 首頁文章卡片滑動效果

const articleList = document.querySelector(".article-list");
const prevBtn = document.querySelector(".scroll li:first-child");
const nextBtn = document.querySelector(".scroll li:last-child");

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
const cardWidth = 280; // 卡片寬度 + gap
prevBtn.addEventListener("click", () => {
  articleList.scrollBy({ left: -cardWidth, behavior: "smooth" });
});
nextBtn.addEventListener("click", () => {
  articleList.scrollBy({ left: cardWidth, behavior: "smooth" });
});
