"use server";

/*
 * Server actions for one project's actions.
 * Each write updates one action, or one action_features row.
 */

import { createClient } from "@/lib/supabase/server";
import {
  describeProjectAction as writeActionDescription,
  renameProjectAction as writeActionName,
} from "@/lib/actions/actions";
import {
  linkActionFeature as writeActionFeatureLink,
  unlinkActionFeature as writeActionFeatureUnlink,
} from "@/lib/actions/action-features";

// Updates the name of one action.
export async function renameProjectAction(projectId: number, id: number, name: string) {
  const supabase = await createClient();
  await writeActionName(projectId, id, name, supabase);
}

// Updates the description of one action.
export async function describeProjectAction(
  projectId: number,
  id: number,
  description: string,
) {
  const supabase = await createClient();
  await writeActionDescription(projectId, id, description, supabase);
}

// Links one feature to one action.
export async function linkProjectActionFeature(
  projectId: number,
  actionId: number,
  featureId: string,
) {
  const supabase = await createClient();
  await writeActionFeatureLink(projectId, actionId, featureId, supabase);
}

// Removes one feature from one action.
export async function unlinkProjectActionFeature(
  projectId: number,
  actionId: number,
  featureId: string,
) {
  const supabase = await createClient();
  await writeActionFeatureUnlink(projectId, actionId, featureId, supabase);
}
