import { defineConfig } from "umi";

export default defineConfig({
  request: {},
  proxy: {
    '/api/': {
      'target': 'http://127.0.0.1:5210/',
      'changeOrigin': true,
    }
  },
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
    { path: "/input", component: "input" },
    { path: "/result", component: "result" },
    { path: "/auth", component: "auth" },
  ],
  npmClient: 'npm',
});
