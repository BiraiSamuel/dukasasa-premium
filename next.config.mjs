/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
	domains: ["dukasasa.co.ke", "jezkimhardware.dukasasa.co.ke"],
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: ""
          },
        ],
      },
};

export default nextConfig;
