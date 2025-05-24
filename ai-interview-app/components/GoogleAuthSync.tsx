'use client';
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function GoogleAuthSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      const syncUser = async () => {
        try {
          const res = await fetch("http://localhost:8000/api/register-google-user/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
            }),
          });

          const data = await res.json();
          console.log("✅ Synced user to backend:", data);
        } catch (error) {
          console.error("❌ Failed to sync Google user:", error);
        }
      };

      syncUser();
    }
  }, [session]);

  return null; // No UI
}
