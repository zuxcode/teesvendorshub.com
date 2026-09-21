import type { Access } from "payload";

export const canReadPayment: Access = ({ req }) => {
  if (!req.user) {
    return false;
  }

  if (req.user.role === "admin") {
    return true;
  }

  return {
    buyer: {
      equals: req.user.id,
    },
  };
};
