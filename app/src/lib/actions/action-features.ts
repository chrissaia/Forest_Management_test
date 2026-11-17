/*
 * Database reads and writes for action_features.
 * One row links one feature to one action in a project.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionFeatureLink } from "@/lib/actions/action-feature-links";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ActionFeatureRow = {
  action_id: number;
  map_feature_id: string;
};

// Every feature link in the project.
export async function getActionFeatures(
  projectId: number,
  supabase: SupabaseClient,
): Promise<ActionFeatureLink[]> {
  if (!Number.isInteger(projectId)) {
    throw new Error("Action features need a project.");
  }

  const { data, error } = await supabase
    .from("action_features")
    .select("action_id, map_feature_id")
    .eq("project_id", projectId)
    .order("action_id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ActionFeatureRow[]).map((row) => ({
    actionId: row.action_id,
    featureId: row.map_feature_id,
  }));
}

// Inserts one action_features row.
export async function linkActionFeature(
  projectId: number,
  actionId: number,
  featureId: string,
  supabase: SupabaseClient,
): Promise<void> {
  assertLink(projectId, actionId, featureId);
  const { error } = await supabase.from("action_features").insert({
    action_id: actionId,
    project_id: projectId,
    map_feature_id: featureId,
  });
  if (error) {
    throw new Error(error.message);
  }
}

// Deletes one action_features row.
export async function unlinkActionFeature(
  projectId: number,
  actionId: number,
  featureId: string,
  supabase: SupabaseClient,
): Promise<void> {
  assertLink(projectId, actionId, featureId);
  const { error } = await supabase
    .from("action_features")
    .delete()
    .eq("project_id", projectId)
    .eq("action_id", actionId)
    .eq("map_feature_id", featureId);
  if (error) {
    throw new Error(error.message);
  }
}

function assertLink(projectId: number, actionId: number, featureId: string) {
  if (!Number.isInteger(projectId) || !Number.isInteger(actionId)) {
    throw new Error("Action feature link needs an action.");
  }
  if (!uuidPattern.test(featureId)) {
    throw new Error("Action feature link needs a feature id.");
  }
}
