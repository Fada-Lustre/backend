let app: any;

try {
  app = require("../src/index").default;
} catch (err: any) {
  const express = require("express");
  app = express();
  app.use((_req: any, res: any) => {
    res.status(500).json({
      error: "App failed to initialize",
      message: err?.message ?? String(err),
      stack: err?.stack?.split("\n").slice(0, 5),
    });
  });
}

export default app;
