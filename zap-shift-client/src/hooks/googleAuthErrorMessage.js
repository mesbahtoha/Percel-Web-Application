export const getGoogleAuthErrorMessage = (error) => {
  const code = error?.code || "";

  switch (code) {
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled for this app yet. Enable it in the Firebase Console → Authentication → Sign-in method → Google, then try again.";
    case "auth/unauthorized-domain":
      return "This website domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains, then try again.";
    case "auth/popup-blocked":
      return "The Google sign-in popup was blocked by your browser. Allow popups for this site and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing. Please try again.";
    case "auth/network-request-failed":
      return "Network error while contacting Google. Check your internet connection and try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method. Try logging in with your password instead.";
    default:
      return error?.message || "Google sign-in failed. Please try again.";
  }
};
