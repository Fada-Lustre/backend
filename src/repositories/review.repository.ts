import db from "../db";

// ── Create ─────────────────────────────────────────────────────────────

export async function create(data: {
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  review_text?: string | null;
}): Promise<{ id: string }> {
  const rows = await db.query(
    `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, review_text)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [data.booking_id, data.reviewer_id, data.reviewee_id, data.rating, data.review_text ?? null]
  ) as { id: string }[];
  return rows[0]!;
}

// ── List ───────────────────────────────────────────────────────────────

export async function listByReviewee(
  revieweeId: string,
  limit = 20
): Promise<{ rating: number; review_text: string | null; created_at: string }[]> {
  return await db.query(
    `SELECT r.rating, r.review_text, r.created_at
     FROM reviews r WHERE r.reviewee_id = $1 ORDER BY r.created_at DESC LIMIT $2`,
    [revieweeId, limit]
  ) as { rating: number; review_text: string | null; created_at: string }[];
}
