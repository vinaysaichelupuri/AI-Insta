import { Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

type TokenPayload = {
  id?: string;
};

export async function resolveRequestUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    try {
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
      if (payload.id) {
        const user = await User.findById(payload.id);
        if (user) {
          return user;
        }
      }
    } catch (error) {
      console.warn("Invalid auth token on request", error);
    }
  }

  const emailFromBody = typeof req.body?.email === "string" ? req.body.email : null;
  const emailFromQuery = typeof req.query?.email === "string" ? req.query.email : null;
  const email = emailFromBody || emailFromQuery;

  if (!email) {
    return null;
  }

  return User.findOne({ email: email.toLowerCase() });
}
