// Usage: node scripts/make-admin.js you@example.com   (no email = list users)
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB || "hudulguun" });
  const users = mongoose.connection.db.collection("users");
  const email = process.argv[2];
  if (!email) {
    const all = await users.find({}, { projection: { email: 1, role: 1 } }).toArray();
    all.forEach((u) => console.log(u.email, "-", u.role));
  } else {
    const r = await users.updateOne({ email: email.toLowerCase() }, { $set: { role: "admin" } });
    console.log(r.matchedCount ? `${email} is now admin` : `No user with email ${email}`);
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
