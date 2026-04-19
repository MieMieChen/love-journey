import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getDefaultCoupleSlug() {
  return process.env.DEFAULT_COUPLE_SLUG || "heart-archive";
}

export function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || "moment-photos";
}

export async function getViewerState() {
  if (!supabaseConfigured()) {
    return {
      user: null,
      profile: null,
      coupleId: null,
      configured: false,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      user: null,
      profile: null,
      coupleId: null,
      configured: false,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      coupleId: null,
      configured: true,
    };
  }

  const [{ data: profile }, { data: member }] = await Promise.all([
    supabase.from("profiles").select("id, display_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("couple_members")
      .select("couple_id")
      .eq("profile_id", user.id)
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    user,
    profile,
    coupleId: member?.couple_id ?? null,
    configured: true,
  };
}

export async function requireAuthenticatedMember() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("couple_members")
    .select("couple_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!member) {
    redirect("/onboarding");
  }

  return {
    supabase,
    user,
    coupleId: member.couple_id,
  };
}
