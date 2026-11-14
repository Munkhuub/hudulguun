import jwt from "jsonwebtoken";

// Attaches req.userId / req.isAdmin when a valid token is sent; never rejects.
export const optionalAuthMiddleware: any = (req, _res, next) => {
  const header: string | undefined = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : header;
  if (token && process.env.JWT_SECRET) {
    try {
      const { userId, isAdmin } = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        isAdmin: boolean;
      };
      req.userId = userId;
      req.isAdmin = isAdmin;
    } catch {
      // invalid/expired token → treat as guest
    }
  }
  next();
};
