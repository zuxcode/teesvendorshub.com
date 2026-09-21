import type { ResourceId } from "../types";

type RelationshipValue = ResourceId | { id: ResourceId } | null | undefined;

export function getRelationshipId(
  relationship: RelationshipValue
): ResourceId | null {
  if (!relationship) {
    return null;
  }

  return typeof relationship === "object" ? relationship.id : relationship;
}
