import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        specificCategory: resolve(__dirname, "src/specificCategory/index.html"),
        aichat: resolve(__dirname, "src/specificCategory/aichat.html"),
        comment: resolve(__dirname, "src/specificCategory/comment.html"),
        favorite: resolve(__dirname, "src/favorite/index.html"),
        workshop: resolve(__dirname, "src/workshopdirectory/workshop.html")

      },
    },
  },
});
