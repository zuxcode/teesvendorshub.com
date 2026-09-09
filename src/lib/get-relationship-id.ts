import type { DocumentId } from "./types";

type RelationshipValue = DocumentId | { id: DocumentId } | null | undefined;

export function getRelationshipId(
  relationship: RelationshipValue
): DocumentId | null {
  if (!relationship) {
    return null;
  }

  return typeof relationship === "object" ? relationship.id : relationship;
}
