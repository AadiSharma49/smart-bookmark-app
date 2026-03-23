import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { AuthOperations } from "../types";

export function useAuth(): { session: Session | null; loading: boolean } & AuthOperations {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const onLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
  };

  return { session, loading, onLogin, onLogout };
}
