import express, { Request, Response } from "express";
import db from "../db";

const blogRouter = express.Router();

blogRouter.get("/categories", async (_req: Request, res: Response) => {
  try {
    const rows = await db.query(
      "SELECT * FROM blog_categories ORDER BY name ASC"
    );
    res.json({ data: rows });
  } catch (err) {
    console.error("Error fetching blog categories:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch categories" } });
  }
});

blogRouter.get("/posts", async (req: Request, res: Response) => {
  try {
    const { category, q, page = "1", limit = "20" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM blog_posts p
      LEFT JOIN blog_categories c ON p.category_id = c.id
      WHERE p.published_at IS NOT NULL AND p.published_at <= NOW()
        AND p.deleted_at IS NULL
    `;
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (category && typeof category === "string") {
      query += ` AND c.slug = $${paramIndex++}`;
      values.push(category);
    }

    if (q && typeof q === "string") {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.body ILIKE $${paramIndex})`;
      values.push(`%${q}%`);
      paramIndex++;
    }

    const countQuery = query.replace(/SELECT p\.\*, c\.name.*?FROM/, "SELECT COUNT(*) AS total FROM");
    const countResult = await db.query(countQuery, values);
    const total = parseInt(countResult[0]?.total ?? "0", 10);

    query += ` ORDER BY p.published_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    values.push(limitNum, offset);

    const rows = await db.query(query, values);

    const data = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      image_url: row.image_url,
      published_at: row.published_at,
      category: row.category_id
        ? { id: row.category_id, name: row.category_name, slug: row.category_slug }
        : null,
    }));

    res.json({ data, meta: { page: pageNum, limit: limitNum, total } });
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch posts" } });
  }
});

blogRouter.get("/posts/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const rows = await db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.deleted_at IS NULL`,
      [slug]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Post not found" } });
      return;
    }

    const row: any = rows[0];
    res.json({
      ...row,
      category: row.category_id
        ? { id: row.category_id, name: row.category_name, slug: row.category_slug }
        : null,
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch post" } });
  }
});

export default blogRouter;
