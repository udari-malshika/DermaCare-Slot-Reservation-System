const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const [action, uid] = process.argv.slice(2);
if (!["grant", "revoke"].includes(action) || !uid) {
  console.error("Usage: npm run set-admin -- <grant|revoke> <firebase-user-uid>");
  process.exitCode = 1;
} else {
  initializeApp({ projectId: "dermocare-9a089" });
  const auth = getAuth();

  auth.getUser(uid).then(async (user) => {
    const claims = { ...(user.customClaims || {}) };
    if (action === "grant") claims.admin = true;
    else delete claims.admin;
    await auth.setCustomUserClaims(uid, claims);
    console.log(`Admin access ${action === "grant" ? "granted to" : "revoked from"} ${uid}. Ask the user to sign out and back in.`);
  }).catch((error) => {
    console.error("Unable to update admin access:", error.message);
    process.exitCode = 1;
  });
}
