"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getDefaultCoupleSlug,
  getStorageBucketName,
  requireAuthenticatedMember,
} from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function truthyValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/login");
}

export async function completeOnboardingAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = textValue(formData, "displayName") || user.email?.split("@")[0] || "我们";
  const coupleSlug = textValue(formData, "coupleSlug") || getDefaultCoupleSlug();

  const { data: couple } = await supabase
    .from("couples")
    .select("id")
    .eq("slug", coupleSlug)
    .maybeSingle();

  if (!couple) {
    throw new Error(`Couple with slug "${coupleSlug}" was not found.`);
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: memberError } = await supabase.from("couple_members").upsert({
    couple_id: couple.id,
    profile_id: user.id,
    role: "member",
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  redirect("/");
}

export async function createPlaceAction(formData: FormData) {
  const { supabase, coupleId } = await requireAuthenticatedMember();

  const payload = {
    couple_id: coupleId,
    title: textValue(formData, "title"),
    city: textValue(formData, "city"),
    label: textValue(formData, "label"),
    note: textValue(formData, "note"),
    latitude: Number(textValue(formData, "latitude")) || null,
    longitude: Number(textValue(formData, "longitude")) || null,
    visited_on: textValue(formData, "visitedOn"),
  };

  const { error } = await supabase.from("places").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/map");
  revalidatePath("/");
  redirect("/map");
}

export async function createMomentAction(formData: FormData) {
  const { supabase, user, coupleId } = await requireAuthenticatedMember();

  const title = textValue(formData, "title");
  const summary = textValue(formData, "summary");
  const body = textValue(formData, "body");
  const mood = textValue(formData, "mood");
  const weather = textValue(formData, "weather");
  const happenedAt = textValue(formData, "happenedAt");
  const placeId = textValue(formData, "placeId") || null;
  const caption = textValue(formData, "caption");
  const file = formData.get("photo");

  if (file instanceof File && file.size > 10 * 1024 * 1024) {
    throw new Error("图片大小不能超过 10MB，建议压缩后再上传。");
  }

  if (file instanceof File && file.size > 0 && !file.type.startsWith("image/")) {
    throw new Error("只能上传图片文件。");
  }

  const { data: moment, error } = await supabase
    .from("moments")
    .insert({
      couple_id: coupleId,
      author_id: user.id,
      place_id: placeId,
      title,
      summary,
      body,
      mood,
      weather,
      happened_at: happenedAt,
      is_featured: truthyValue(formData, "isFeatured"),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (file instanceof File && file.size > 0) {
    const bucket = getStorageBucketName();
    const safeName = `${moment.id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(safeName, file, { upsert: false });

    if (uploadError) {
      await supabase.from("moments").delete().eq("id", moment.id);
      throw new Error(uploadError.message);
    }

    const { error: photoError } = await supabase.from("moment_photos").insert({
      moment_id: moment.id,
      file_path: safeName,
      caption: caption || null,
      taken_at: happenedAt || null,
    });

    if (photoError) {
      await supabase.storage.from(bucket).remove([safeName]);
      await supabase.from("moments").delete().eq("id", moment.id);
      throw new Error(photoError.message);
    }
  }

  revalidatePath("/diary");
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/diary");
}

export async function createAnniversaryAction(formData: FormData) {
  const { supabase, coupleId } = await requireAuthenticatedMember();

  const { error } = await supabase.from("anniversaries").insert({
    couple_id: coupleId,
    title: textValue(formData, "title"),
    description: textValue(formData, "description"),
    event_date: textValue(formData, "eventDate"),
    recurring: truthyValue(formData, "recurring"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/anniversary");
  revalidatePath("/");
  redirect("/anniversary");
}

export async function createCapsuleAction(formData: FormData) {
  const { supabase, user, coupleId } = await requireAuthenticatedMember();

  const message = textValue(formData, "message");

  const { error } = await supabase.from("capsules").insert({
    couple_id: coupleId,
    author_id: user.id,
    title: textValue(formData, "title"),
    preview: message.slice(0, 80),
    message,
    unlock_at: textValue(formData, "unlockAt"),
    status: "locked",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/capsule");
  revalidatePath("/");
  redirect("/capsule");
}

export async function createWishlistAction(formData: FormData) {
  const { supabase, coupleId } = await requireAuthenticatedMember();

  const { error } = await supabase.from("wishlists").insert({
    couple_id: coupleId,
    title: textValue(formData, "title"),
    detail: textValue(formData, "detail"),
    city: textValue(formData, "city"),
    status: textValue(formData, "status") || "idea",
    target_date: textValue(formData, "targetDate") || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/wishlist");
  revalidatePath("/");
  redirect("/wishlist");
}

export async function createShareLinkAction(formData: FormData) {
  const { supabase, coupleId } = await requireAuthenticatedMember();

  const title = textValue(formData, "title");
  const slug =
    textValue(formData, "slug") || `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;

  const { error } = await supabase.from("share_links").insert({
    couple_id: coupleId,
    slug,
    title,
    description: textValue(formData, "description"),
    resource_type: "gallery",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/gallery");
  redirect(`/share/${slug}`);
}

export async function createInviteAction(formData: FormData) {
  const { supabase, user, coupleId } = await requireAuthenticatedMember();
  const note = textValue(formData, "note");
  const expiresInDays = Number(textValue(formData, "expiresInDays")) || 7;
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("couple_invites").insert({
    couple_id: coupleId,
    invited_by: user.id,
    token,
    note: note || null,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/?inviteToken=${token}`);
}

export async function acceptInviteAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const token = textValue(formData, "token");

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  const displayName = textValue(formData, "displayName") || user.email?.split("@")[0] || "我们";

  const { data: invite } = await supabase
    .from("couple_invites")
    .select("id,couple_id,accepted_at,expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!invite) {
    throw new Error("邀请不存在或已经失效。");
  }

  if (invite.accepted_at) {
    redirect("/");
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    throw new Error("邀请已经过期，请让对方重新生成新的邀请链接。");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: displayName,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: memberError } = await supabase.from("couple_members").upsert({
    couple_id: invite.couple_id,
    profile_id: user.id,
    role: "member",
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  const { error: inviteError } = await supabase
    .from("couple_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  if (inviteError) {
    throw new Error(inviteError.message);
  }

  redirect("/");
}
