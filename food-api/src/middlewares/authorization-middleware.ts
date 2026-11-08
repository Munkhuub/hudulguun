export const authorizationMiddleware: any = (req, res, next) => {
  if (!req.isAdmin) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};
