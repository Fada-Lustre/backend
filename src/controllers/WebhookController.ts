import { Router, Request, Response } from "express";
import * as bookingRepo from "../repositories/booking.repository";
import * as txRepo from "../repositories/transaction.repository";
import * as notificationRepo from "../repositories/notification.repository";

const webhookRouter = Router();

webhookRouter.post("/webhook", async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    res.status(401).json({ code: "UNAUTHORIZED", message: "Missing Stripe signature" });
    return;
  }

  const raw = Buffer.isBuffer(req.body) ? req.body.toString() : (typeof req.body === "string" ? req.body : JSON.stringify(req.body));
  let event: { id: string; type: string; data: { object: { id: string; metadata?: { booking_id?: string }; status?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    res.status(400).json({ code: "BAD_REQUEST", message: "Invalid JSON" });
    return;
  }

  if (!event || !event.type) {
    res.status(400).json({ code: "BAD_REQUEST", message: "Invalid event" });
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const bookingId = event.data.object.metadata?.booking_id;
        if (bookingId) {
          await bookingRepo.updatePaymentStatusIfPending(bookingId, "successful");
          await txRepo.updateStatusByBookingIdIfPending(bookingId, "successful");
          await notificationRepo.createForBookingCustomer(bookingId, "payment", "Payment Confirmed", "Your booking payment was successful.");
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const bookingId = event.data.object.metadata?.booking_id;
        if (bookingId) {
          await bookingRepo.updatePaymentStatus(bookingId, "failed");
          await txRepo.updateStatusByBookingIdIfPending(bookingId, "failed");
          await notificationRepo.createForBookingCustomer(bookingId, "payment", "Payment Failed", "Your booking payment failed. Please try again.");
        }
        break;
      }
      case "transfer.completed":
        break;
      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ code: "SERVER_ERROR", message: "Webhook processing failed" });
  }
});

export default webhookRouter;
