// 產品資料（來源：FIH Product Catelog_Design File.docx）
// 要新增 / 修改產品，只要改這個陣列即可。
// cat 用於分類篩選與攤位圖連動。
const PRODUCTS = [
  {
    name: "Mobile Demo Kit with Dual Modem",
    cat: "ZCU",
    img: "assets/products/p01.png",
    desc: "Portable dual modem and ZCU demo kit for ASIL-C/D redundant control, smart power distribution, secure networking, FOTA, and multistream data transmission via dual NAD.",
  },
  {
    name: "TCU with Shark Fin Antenna",
    cat: "TCU",
    img: "assets/products/p02.png",
    desc: "EU eCall-certified 4G shark-fin TCU integrating cellular, Wi-Fi, GNSS, and fusion/dead-reckoning positioning in an aerodynamic module. Enables cloud services, data exchange, and remote diagnostics.",
  },
  {
    name: "TCU with External Antenna",
    cat: "TCU",
    img: "assets/products/p03.png",
    desc: "EU eCall-certified, compact 4G LTE TCU with external antenna design, combining cellular, Wi-Fi, GNSS, and fusion/dead-reckoning positioning, without compromising styling, with Ethernet (AVB) integration.",
  },
  {
    name: "TCU with Shark Fin Antenna",
    cat: "TCU",
    img: "assets/products/p04.png",
    desc: "EU eCall-certified 5G shark-fin TCU integrating cellular, Wi-Fi, GNSS, and fusion/dead-reckoning positioning in an aerodynamic module. Enables cloud services, data exchange, and remote diagnostics.",
  },
  {
    name: "TCU with Conformal Antenna",
    cat: "TCU",
    img: "assets/products/p05.png",
    desc: "EU eCall-certified 5G TCU for conformal antenna designs, combining 5G NR Sub-6, 4G LTE, Wi-Fi 6, GNSS, C-V2X, eCall, radio tuner, and smart access.",
  },
  {
    name: "TCU Lite",
    cat: "TCU",
    img: "assets/products/p06.png",
    desc: "External-antenna TCU Lite with FIH NAD design, 4G/5G options, 100Base-T1, GNSS, eCall, cybersecurity, and OTA compliance.",
  },
  {
    name: "Modem-only TCU with Antenna",
    cat: "TCU",
    img: "assets/products/p07.png",
    desc: "Modem-only TCU delivering essential 5G RedCap or 4G LTE connectivity, GNSS L1+L5, 100Base-T1 Ethernet, and passive cooling.",
  },
  {
    name: "Multi-Modem TCU for L4",
    cat: "TCU",
    img: "assets/products/p08.png?v=20261007n",
    desc: "High-performance 5G TCU for advanced L4 autonomous driving function for instant safety reporting, with dual 5G redundancy, GNSS, C-V2X, and GbE ports.",
  },
  {
    name: "TCU for 2W",
    cat: "TCU",
    img: "assets/products/p09.png",
    desc: "Compact and rugged TCU for 2-wheeler applications, supporting 4G LTE or 5G NR, GNSS, Ethernet, passive cooling, and IP69 protection.",
  },
  {
    name: '15" Tandem OLED Display',
    cat: "IVI",
    img: "assets/products/p10.png",
    desc: "15-inch dual-layer OLED architecture, 2560 x 1600 resolution, 800 nit, 100% NTSC and wide viewing angle (Contrast > 1000 at 80°).",
  },
  {
    name: '29.5" Tandem OLED Display',
    cat: "IVI",
    img: "assets/products/p11.png",
    desc: "29.5-inch dual-layer OLED architecture, 5040 x 216 resolution, 1000 nit, 100% NTSC and wide viewing angle (Contrast > 1000 at 80°).",
  },
  {
    name: "High-Performance Computing Platform (IVI + ADAS)",
    cat: "HPC",
    img: "assets/products/p12.png",
    desc: "Combining IVI and ADAS with wireless Android Auto, Apple CarPlay, Wi-Fi, Bluetooth, radio tuner, and GNSS, while integrating cluster, BCM, security gateway, liquid cooling design, ASIL B/D and GSR V2 compliance.",
  },
  {
    name: "Active Damping Control Module",
    cat: "Chassis",
    img: "assets/products/p13.png",
    desc: "Compact active damping ECU with NXP S32K324, AUTOSAR 4.3, CAN, and PSI5 support for responsive chassis-control applications.",
  },
  {
    name: "Eagleye Smart Camera",
    cat: "ADAS",
    img: "assets/products/p14.png",
    desc: "8.3MP smart camera for vision-only Level 2 ADAS, GSR V2/NCAP, ASIL B, and HDR imaging.",
  },
  {
    name: "Premium I/O Aggregator (ZCU)",
    cat: "ZCU",
    img: "assets/products/p15.png",
    desc: "Premium ZCU for regional I/O aggregation and power distribution, supporting Ethernet-to-HPC, CAN FD, LIN, 10Base-T1S with RCP, and ASIL B.",
  },
  {
    name: "Cyber Security Gateway Module",
    cat: "Security",
    img: "assets/products/p16.png",
    desc: "AUTOSAR security gateway with Infineon TC377TX, firewall routing, network mirroring, IDS, and cybersecurity protection.",
  },
  {
    name: "Smart Phone As Access Key",
    cat: "Access",
    img: "assets/products/p17.png",
    desc: "CCC-compliant digital key solution with UWB 802.15.4z/4ab, Bluetooth 6.0 Channel Sounding, and secure smartphone-based vehicle access.",
  },
  {
    name: "UWB Anchor",
    cat: "Access",
    img: "assets/products/p18.png",
    desc: "Compact UWB anchor with NXP platform, 6.5–8.0GHz UWB, BLE 2.4GHz, CAN, and small-form-factor packaging.",
  },
];
