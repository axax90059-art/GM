# FIH E/EA Solutions 展會網站

## 在 VS Code 開啟
1. VS Code → File → Open Folder → 選 `D:\FIH\網站\website`
2. 安裝擴充套件 **Live Server**（作者 Ritwick Dey）
3. 在 `index.html` 按右鍵 → **Open with Live Server**，瀏覽器會自動開啟並即時更新

## 檔案結構
```
website/
├─ index.html          頁面結構（開場動畫 → Banner → About → 產品 → Venue & Directions）
├─ css/fonts.css       本機字型設定（離線可用）
├─ css/style.css       所有樣式與動畫
├─ js/products.js      產品資料（名稱 / 分類 / 圖片 / 說明）← 改產品改這裡
├─ js/main.js          開場動畫、背景動畫、輪播、倒數、Google 地圖彈窗
└─ assets/
   ├─ fonts/              Google 開源字型檔 .woff2（SIL OFL 授權）
   ├─ banner-desktop.svg  橫版 Banner（電腦）
   ├─ banner-mobile.svg   直版 Banner（手機 767px 以下）
   ├─ video-desktop.mp4   開場影片
   ├─ logo.svg / fihlogo.svg
   └─ products/p01.png … p19.png
```

## 常見修改
| 要改什麼 | 在哪裡 |
|---|---|
| 新增 / 修改產品 | `js/products.js` |
| 換產品圖 | 覆蓋 `assets/products/pXX.png`（去背 PNG，最長邊約 900px），**同時**覆蓋縮圖 `assets/products/thumb/pXX.png`（最長邊約 200px），再把 `js/products.js` 裡該圖的 `?v=` 改一下 |
| 活動時間（倒數計時） | `js/main.js` 最上方 `EVENT_START` / `EVENT_END` |
| Banner | 覆蓋 `assets/banner-desktop.svg`、`assets/banner-mobile.svg` |
| 自動輪播速度 | `js/main.js` 的 `AUTOPLAY_MS` |
| 地圖地址 | `index.html` 的 Google 地圖 iframe 與按鈕連結、`js/main.js` 的 `MAP_EMBED` |
| 主色 | `css/style.css` 最上方 `:root` 的 `--cyan` / `--blue` |

## 字型（離線可用）
字型檔已放在 `assets/fonts/`，由 `css/fonts.css` 載入，不需要網路。
全部是 Google Fonts 開源字型（SIL Open Font License，可免費商用）。

## 開場動畫
- 打開網頁時全螢幕播放 `assets/video-desktop.mp4`（手機、電腦共用同一支橫版影片）
- 電腦：滿版播放
- 手機：影片完整置中（左右各裁約 12%），上下用同一支影片的模糊放大版填滿，logo 不會被切到
- 播完、按 Skip 或按 Esc 就淡出進入網站
- 瀏覽器規定自動播放必須靜音，所以開場沒有聲音
- 保護機制：瀏覽器擋播放 → 直接進網站；6 秒還沒開始播 → 跳過；最多 16 秒一定進網站
- 換影片：用同樣檔名覆蓋 `assets/video-desktop.mp4` 即可（建議 H.264 MP4、16:9、logo 放中間）

## Google 地圖
- 「Exhibition Venue」區塊與右側懸浮的 MAP 按鈕都顯示：General Motors LLC, 29755 Louis Chevrolet Rd., Warren, MI 48093
- 「Open in Google Maps」會開 Google 地圖；「Directions」直接導航
- 地圖需要網路才會顯示（離線時會是空白）
