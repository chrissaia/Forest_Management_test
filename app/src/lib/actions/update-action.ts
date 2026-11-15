"use server";

/*
 * Server actions for one project's actions.
 * Each write updates a single actions row.
 */

import { createClient } from "@/lib/supabase/server";
import {
  describeProjectAction as writeActionDescription,
  renameProjectAction as writeActionName,
} from "@/lib/actions/actions";

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
