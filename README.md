<p align="center">
  <img src="banner.png" width="80%" />
</p>

<h3 align="center">A clean, interactive map for visualizing your Google Maps review history</h3>



# 🌍 Google Maps Review Visualizer  
用你的 Google Maps 評論 JSON 自動生成互動地圖  
Interactive map that visualizes your Google Maps review history

---

## 📌 Overview｜專案介紹

**Google Maps Review Visualizer** 是一個前端網站工具，只要使用者上傳  
Google Takeout 產生的 **評論.json**，網站就會自動解析資料並顯示在地圖上：

- ⭐ 評分  
- 🏠 店家名稱  
- 🗺 地址  
- 📝 評論內容  
- 📍 評論地點（經緯度）  
- 🔗 Google Maps 原始連結  
- 📂 類別分類（餐飲、景點、交通、其他…）  
- 🔍 關鍵字搜尋  
- ⭐ 最低評分過濾  
- 📂 類別分類過濾  

📌 **所有資料都只在使用者瀏覽器端處理，不上傳、不儲存。**  
完全隱私友善、快速、安全。

👉 適合作為 **Side Project / 個人作品集 Portfolio**  
👉 不需要後端、不需要資料庫、不需要 API Key  

---

## 🚀 Live Demo｜線上展示

（將你的 GitHub Pages 網址貼在這裡）

👉 https://69523abc.github.io/Map-site/

---

## 📂 Screenshot｜畫面示意

<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/b92baf77-dc64-410a-8911-ba6f3b6eaeef" />
<img width="1914" height="862" alt="image" src="https://github.com/user-attachments/assets/d3057ce7-1eb7-4c68-862c-d6c024dc048a" />



---

## 🧩 Features｜功能特色

### ✔ 支援 Google Takeout「評論.json」
自動從 Takeout 官方格式取出需要的欄位。

### ✔ 地圖顯示全部評論座標  
使用 Leaflet.js 即時渲染 Marker。

### ✔ 關鍵字搜尋（店名 / 評論內容）  
輸入任意字詞即可即時過濾結果。

### ✔ 評分過濾（3★、4★、5★）  
篩出你真正喜歡的地點。

### ✔ 自動分類（餐飲 / 景點 / 交通 / 其他）  
根據名稱自動預估類別，可再自訂擴充。

### ✔ 100% 前端運作（無伺服器）  
資料不會離開你的瀏覽器。

### ✔ 可自由分享  
只要對方有自己的 `評論.json`，任何人都能使用你的網站。

---

## 📥 How to Use｜如何使用

### Step 1️⃣ — 前往 Google Takeout
網址：  
👉 https://takeout.google.com

登入後請依照：

1. **點「取消全選」**  
2. 只勾選：**「地圖（你的地點）」**  
3. 點 **下一步**  
4. 匯出選項：  
   - 匯出一次  
   - ZIP 檔案  
5. 按 **建立匯出**

等待 Google 寄送下載連結（通常 1–5 分鐘）

---

### Step 2️⃣ — 解壓縮下載的 ZIP

解壓後你會看到類似以下的資料夾結構：<br>
✔ 請務必選用 **評論.json**<br>  
✘ 不要使用 **已儲存的地點.json**（那是你收藏的星號地點，不是評論）<br>  
---

### Step 3️⃣ — 開啟你的網站並上傳 json

打開你的 GitHub Pages 網站：

👉 https://YOUR_NAME.github.io/Map-site/

左側會看到：
📁 上傳 Google Takeout 的「評論.json」

上傳後即可看到：

- 地圖上的所有評論座標  
- 點擊 Marker 查看詳細內容  
- 側邊欄可搜尋 / 過濾 / 分類  

---

## 🛠 Tech Stack｜技術堆疊

| 技術 | 說明 |
|------|------|
| **HTML / CSS / JavaScript** | 全站純前端 |
| **Leaflet.js** | 地圖渲染與 Marker 顯示 |
| **GitHub Pages** | 靜態網站部署 |
| **FileReader API** | 讀取使用者上傳的 JSON |
| **無後端、無資料庫** | 所有資料在 Client 端處理 |

---

## 🧪 Development｜本地開發方式

下載專案後：

```bash
cd map-site
python -m http.server 8000
然後開啟：
http://localhost:8000

Map-site/
│── index.html
│── style.css
│── script.js
│── README.md
└── （可選）sample_reviews.json
---
🔒 Privacy｜隱私聲明

本工具 不會上傳 使用者資料。

所有資料都只存在使用者瀏覽器記憶體。

關閉頁面後資料即消失，不會被儲存。

🙌 About

這是一個個人 Side Project，主要目的：

讓自己的 Google Maps 評論以更美、更直覺的方式呈現

提供一般使用者一個簡單的評論視覺化工具

作為 Portfolio 展示 Web 技術能力
