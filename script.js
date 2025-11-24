let map;
let allData = [];
let allMarkers = [];

// 當前篩選狀態
const state = {
  keyword: "",
  year: "all",
  minRating: 4,
  category: "all",
};

function initMap() {
  map = L.map("map").setView([23.7, 121], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);
}

// 從 Google Takeout 的原始 JSON 轉成內部格式
function normalizeFromTakeout(raw) {
  const features = raw.features || [];
  const result = [];

  for (const feat of features) {
    const geom = feat.geometry || {};
    const props = feat.properties || {};
    const loc = props.location || {};

    const coords = geom.coordinates;
    if (!coords || coords.length < 2) continue;
    const [lon, lat] = coords;

    const date = props.date || null;
    const year = getYear(date);
    const name = loc.name || null;
    const address = loc.address || null;
    const rating = props.five_star_rating_published ?? null;
    const comment = props.review_text_published || null;
    const url = props.google_maps_url || null;

    const category = guessCategory(name);

    result.push({
      name,
      address,
      rating,
      comment,
      lat,
      lng: lon,
      date,
      year,
      category,
      url,
    });
  }

  return result;
}

function getYear(dateStr) {
  if (!dateStr) return null;
  try {
    // "2025-11-24T04:23:57.576822Z"
    const s = dateStr.endsWith("Z") ? dateStr.slice(0, -1) : dateStr;
    const d = new Date(s);
    const year = d.getFullYear();
    return isNaN(year) ? null : year;
  } catch {
    return null;
  }
}

function guessCategory(name) {
  if (!name) return "其他";
  if (["火鍋", "燒肉", "食堂", "餐廳", "拉麵", "咖啡", "早午餐", "麵", "食堂"].some(k => name.includes(k))) {
    return "餐飲";
  }
  if (["公園", "景點", "廟", "寺", "風景", "樂園"].some(k => name.includes(k))) {
    return "景點";
  }
  if (["車站", "機場", "站"].some(k => name.includes(k))) {
    return "交通";
  }
  return "其他";
}

// 處理檔案上傳
function setupFileInput() {
  const fileInput = document.getElementById("file-input");
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rawJson = JSON.parse(text);
        allData = normalizeFromTakeout(rawJson);
        if (!allData.length) {
          alert("解析不到任何評論，請確認檔案是否為 Google Maps 的評論.json");
          return;
        }
        initFiltersFromData(allData);
        applyFilters();
        enableControls();
      } catch (err) {
        console.error(err);
        alert("解析 JSON 失敗，請確認檔案內容格式正確。");
      }
    };
    reader.readAsText(file, "utf-8");
  });
}

function enableControls() {
  ["search-input", "year-select", "rating-select", "category-select"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.disabled = false;
    }
  );
}

function initFiltersFromData(data) {
  // 年份
  const yearSelect = document.getElementById("year-select");
  // 先清空（保留 "全部年份"）
  yearSelect.innerHTML = '<option value="all">全部年份</option>';

  const years = Array.from(
    new Set(
      data
        .map((d) => d.year)
        .filter((y) => y !== null && y !== undefined)
    )
  ).sort((a, b) => b - a);

  years.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  });

  // 類別
  const catSelect = document.getElementById("category-select");
  catSelect.innerHTML = '<option value="all" selected>全部</option>';

  const cats = Array.from(new Set(data.map((d) => d.category || "其他"))).sort();
  cats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    catSelect.appendChild(opt);
  });

  // 綁定事件（只要綁一次即可）
  const searchInput = document.getElementById("search-input");
  searchInput.oninput = (e) => {
    state.keyword = e.target.value.trim();
    applyFilters();
  };

  yearSelect.onchange = (e) => {
    state.year = e.target.value;
    applyFilters();
  };

  const ratingSelect = document.getElementById("rating-select");
  ratingSelect.onchange = (e) => {
    state.minRating = Number(e.target.value);
    applyFilters();
  };

  catSelect.onchange = (e) => {
    state.category = e.target.value;
    applyFilters();
  };
}

function applyFilters() {
  const kw = state.keyword.toLowerCase();

  const filtered = allData.filter((item) => {
    // 關鍵字
    if (kw) {
      const text = `${item.name || ""} ${item.comment || ""}`.toLowerCase();
      if (!text.includes(kw)) return false;
    }

    // 年份
    if (state.year !== "all") {
      if (!item.year || String(item.year) !== state.year) return false;
    }

    // 評分
    const rating = Number(item.rating || 0);
    if (rating < state.minRating) return false;

    // 類別
    if (state.category !== "all") {
      if ((item.category || "其他") !== state.category) return false;
    }

    return true;
  });

  renderMarkers(filtered);
  updateStats(filtered.length);
}

function renderMarkers(data) {
  allMarkers.forEach((m) => map.removeLayer(m));
  allMarkers = [];

  data.forEach((item) => {
    if (!item.lat || !item.lng) return;

    const marker = L.marker([item.lat, item.lng]);

    const popup = `
      <b>${item.name || "未命名地點"}</b><br/>
      ⭐ 評分：${item.rating ?? "N/A"}<br/>
      <small>${item.address || ""}</small><br/>
      <small>${item.date || ""}</small>
      <p style="margin-top:6px;">${item.comment || ""}</p>
      ${item.url ? `<a href="${item.url}" target="_blank">在 Google Maps 中開啟</a>` : ""}
    `;

    marker.bindPopup(popup);
    marker.addTo(map);
    allMarkers.push(marker);
  });

  if (allMarkers.length > 0) {
    const group = L.featureGroup(allMarkers);
    map.fitBounds(group.getBounds().pad(0.15));
  }
}

function updateStats(count) {
  const el = document.getElementById("stats-count");
  el.textContent = `顯示 ${count} 筆評論`;
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  setupFileInput();
});
