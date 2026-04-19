import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: Активувати після переносу на dovira.medok.vn.ua
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       has: [{ type: 'host', value: 'medok.check-up.in.ua' }],
  //       destination: 'https://dovira.medok.vn.ua/:path*',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
