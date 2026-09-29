import type { Access, FieldAccess } from "payload";
import { ROLE } from "@/constant";
import type { User } from "@/payload-types";
import { getRelationshipId } from "@/shared/utils/get-relationship-id";

export const isPublicAccess: Access<User> = () => true;

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const isOwner: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  return {
    user: {
      equals: req.user.id,
    },
  };
};

export const isAdminOrOwner: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (req.user.role === ROLE.ADMIN) {
    return true;
  }

  return {
    user: {
      equals: req.user.id,
    },
  };
};

export const isAdmin: Access = ({ req }) => req.user?.role === ROLE.ADMIN;

// FIELD ACCESS
export const isAdminOnlyFieldAccess: FieldAccess = ({ req }) =>
  req.user?.role === ROLE.ADMIN;

export const isAdminOrBuyerOnlyFieldAccess: FieldAccess = ({ req, doc }) => {
  if (!req.user) {
    return false;
  }

  if (req.user.role === ROLE.ADMIN) {
    return true;
  }

  const buyerId = getRelationshipId(doc?.buyer);

  if (req.user.id !== buyerId) {
    return false;
  }

  return doc?.status === "delivered";
};
