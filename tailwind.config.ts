import type { Config } from "tailwindcss";

const config: Config = {
      content: [
            "./pages/**/*.{js,ts,jsx,tsx,mdx}",
            "./components/**/*.{js,ts,jsx,tsx,mdx}",
            "./app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
            extend: {
                  colors: {
                        primary: {
                              50: '#e6f2f5',
                              100: '#cce5eb',
                              200: '#99cbd7',
                              300: '#66b1c3',
                              400: '#3397af',
                              500: '#007d9b',
                              600: '#00647c',
                              700: '#004b5d',
                              800: '#00323e',
                              900: '#00191f',
                        },
                  },
            },
      },
      plugins: [],
};
export default config;
