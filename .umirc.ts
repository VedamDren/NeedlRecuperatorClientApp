import { defineConfig } from "umi";

export default defineConfig({
  initialState: {},
  model: {},
  request: {},
  proxy: {
    '/api/': {
      'target': 'http://127.0.0.1:5210/',
      'changeOrigin': true,
    }
  },
  routes: [
    { path: "/", component: "index" },
    { path: "/input", component: "input" },
    { path: "/variants", component: "variants" },
    { path: "/result", component: "result" },
    { path: "/auth", component: "auth" },
  ],
  npmClient: 'npm',
});
