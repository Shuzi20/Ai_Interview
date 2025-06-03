"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleAuthSync() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      const syncUser = async () => {
        const storedRole = localStorage.getItem("role") || "candidate";

        try {
          const res = await fetch("http://localhost:8000/api/register-google-user/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              role: storedRole, // ✅ pass stored role to backend
            }),
          });

          const data = await res.json();
          console.log("✅ Synced user to backend:", data);

          if (res.ok && data.role) {
            localStorage.setItem("role", data.role);

            if (data.role === "admin") {
              router.push("/admin/questions");
            } else {
              router.push("/role_selection");
            }
          }
        } catch (error) {
          console.error("❌ Failed to sync Google user:", error);
        }
      };

      syncUser();
    }
  }, [session, router]);

  return null;
}
