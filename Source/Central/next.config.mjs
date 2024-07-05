/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  redirects: () => {
    return [
      {
        source: "/docs",
        destination: "https://docs.phijudge.ranzeplay.space",
        permanent: false,
      },
    ];
  }
};

export default nextConfig;
