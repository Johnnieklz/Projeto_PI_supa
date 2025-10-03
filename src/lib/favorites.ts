import { supabase } from "@/integrations/supabase/client";

export type Favorite = {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
};

// Adiciona favorito
export async function addFavorite(userId: string, serviceId: string) {
  if (!userId) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");
    userId = user.id;
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, service_id: serviceId })
    .select()
    .single();

  if (error) throw error;
  return data as Favorite;
}

// Remove favorito
export async function removeFavorite(userId: string, serviceId: string) {
  if (!userId) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");
    userId = user.id;
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .match({ user_id: userId, service_id: serviceId });

  if (error) throw error;
  return true;
}

// Pega IDs de serviços favoritados do usuário
export async function getFavoriteIdsByUser(userId?: string) {
  if (!userId) userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("service_id")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map((r: any) => r.service_id as string);
}

// Pega serviços completos favoritados
export async function getFavoriteServicesByUser(userId?: string) {
  if (!userId) userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return [];

  const { data: favRows, error: favError } = await supabase
    .from("favorites")
    .select("service_id")
    .eq("user_id", userId);

  if (favError) throw favError;
  const ids = (favRows ?? []).map((r: any) => r.service_id);
  if (ids.length === 0) return [];

  const { data: services, error: srvError } = await supabase
    .from("services")
    .select("*")
    .in("id", ids);

  if (srvError) throw srvError;
  return services;
}