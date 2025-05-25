import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'app')]
  },
  images: {
    unoptimized: true,
  },
  // Ensure output: 'export' is removed if it exists here
};

export default nextConfig; 