import jwt from "jsonwebtoken";

export const authenticationMiddleware: any = (req, res, next) => {
  const header: string | undefined = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : header;

  if (!token) {
    res.status(401).json({ message: "Unauthenticated" });
    return;
  }
  try {
    const { userId, isAdmin } = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      isAdmin: boolean;
    };
    req.userId = userId;
    req.isAdmin = isAdmin;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
