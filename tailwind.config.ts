import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 「心语」品牌色板（规格书第八章）
        bamboo: "#6B8E6B", // 主色·竹青
        plain: "#8B8B8B", // 辅助色·素灰
        cinnabar: "#C24B40", // 强调色·朱砂
        moonlit: "#F5F5F0", // 背景色·月白
        xuan: "#FEFEFA", // 卡片背景·宣纸白
        ink: "#2C2C2C", // 墨色·正文
        "ink-light": "#666666", // 浅墨·次要文字
        pine: "#5BA89D", // 松石绿·成功
        amber: "#D4A84B", // 琥珀·警告
        "jiang-zi": "#8B477C", // 绛紫·危险
      },
      fontFamily: {
        kai: ["STKaiti", "KaiTi", "楷体", "serif"],
        song: ["Songti SC", "SimSun", "宋体", "serif"],
        sans: ["PingFang SC", "Microsoft YaHei", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(44, 44, 44, 0.06)",
        lift: "0 4px 16px rgba(44, 44, 44, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
