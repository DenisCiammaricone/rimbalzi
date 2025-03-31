import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
	reactStrictMode: true,
	env: {
		NEXTAUTH_URL: 'https://labinformaticaescuola.it',
	},
	eslint: {
    	ignoreDuringBuilds: true,
    }
};

export default nextConfig;