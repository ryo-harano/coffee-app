import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発環境ではbasePathを使わない
  ...(process.env.NODE_ENV === 'production' && {
    output: "export",  // 静的サイトとして書き出す設定
    basePath: "/coffee-app", // リポジトリ名と同じパスを設定
  }),
  images: {
    unoptimized: true, // GitHub Pagesで画像を表示させるための設定
  },
};

export default nextConfig;