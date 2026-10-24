type RelationshipValue = string | { id: string } | null | undefined;

export function getRelationshipId(
  relationship: RelationshipValue
): string | null {
  if (!relationship) {
    return null;
  }

  return typeof relationship === "object" ? relationship.id : relationship;
}
