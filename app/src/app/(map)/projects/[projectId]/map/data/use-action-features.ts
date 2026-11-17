"use client";

/*
 * Feature links for one project.
 * A toggle updates the list, then inserts or deletes that one row.
 */

import { useCallback, useRef, useState } from "react";
import {
  linksAfterToggle,
  type ActionFeatureLink,
} from "@/lib/actions/action-feature-links";
import {
  linkProjectActionFeature,
  unlinkProjectActionFeature,
} from "@/lib/actions/update-action";

// Holds the link list and queues one row write after each toggle.
export function useActionFeatures(projectId: number, initialLinks: ActionFeatureLink[]) {
  const [links, setLinks] = useState(initialLinks);
  const linksRef = useRef(links);
  linksRef.current = links;
  const saveQueue = useRef(Promise.resolve());

  const toggleLinkedFeature = useCallback((actionId: number, featureId: string) => {
    const next = linksAfterToggle(linksRef.current, actionId, featureId);
    linksRef.current = next.links;
    setLinks(next.links);
    const write = next.linked
      ? () => linkProjectActionFeature(projectId, actionId, featureId)
      : () => unlinkProjectActionFeature(projectId, actionId, featureId);
    enqueue(saveQueue, write);
  }, [projectId]);

  // Wait for persistence before completing the new-action flow.
  const linkFeature = useCallback(async (actionId: number, featureId: string) => {
    await linkProjectActionFeature(projectId, actionId, featureId);
    if (linksRef.current.some((link) => link.actionId === actionId && link.featureId === featureId)) return;
    const next = [...linksRef.current, { actionId, featureId }];
    linksRef.current = next;
    setLinks(next);
  }, [projectId]);

  return { links, toggleLinkedFeature, linkFeature };
}

// Runs link writes one after another.
function enqueue(
  saveQueue: { current: Promise<void> },
  write: () => Promise<void>,
) {
  saveQueue.current = saveQueue.current
    .catch(() => undefined)
    .then(write)
    .catch((error: unknown) => {
      console.error(error);
    });
}
