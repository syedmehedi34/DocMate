"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const useUserById = () => {
  const { data: session, status } = useSession();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      if (status !== "loading") setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/users/${userId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, status]);

  return { user, isLoading, error };
};

export default useUserById;
