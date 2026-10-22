/** biome-ignore-all lint/suspicious/noEqualsToNull: <intentional> */
/** biome-ignore-all lint/style/noNestedTernary: <intentional> */

import type { CollectionBeforeValidateHook } from "payload";
import { SIM_TYPE } from "@/modules/sim/constant";
import type { OrderItem } from "@/payload-types";
import { RELATION_TO } from "@/shared/constant";

export const ValidateRelationToLinkage: CollectionBeforeValidateHook<
  OrderItem
> = ({ data, operation, originalDoc }) => {
  if (!data && operation !== "update") {
    return data;
  }

  const item = {
    ...originalDoc,
    ...data,
  };

  const hasProduct = item.product != null && item.product !== "";
  const hasGift = item.gift != null && item.gift !== "";
  const hasSim = item.sim != null && item.sim !== "";

  const relationshipCount = [hasProduct, hasGift, hasSim].filter(
    Boolean
  ).length;

  if (relationshipCount !== 1) {
    throw new Error(
      "An order item must reference exactly one product, gift, or SIM."
    );
  }

  const expectedType = hasProduct
    ? RELATION_TO.PRODUCT
    : hasGift
      ? RELATION_TO.GIFT
      : RELATION_TO.SIM;

  if (item.productType !== expectedType) {
    throw new Error(
      "The product type must match the populated item relationship."
    );
  }

  if (hasSim) {
    if (item.simType !== SIM_TYPE.ESIM && item.simType !== SIM_TYPE.PHYSICAL) {
      throw new Error("A SIM order item must have a valid SIM type.");
    }
  } else if (item.simType != null) {
    throw new Error("Only SIM order items can have a SIM type.");
  }

  return data;
};
