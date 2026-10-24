export const validateNonNegativeInteger =
  (label: string) => (value: unknown) => {
    if (
      typeof value !== "number" ||
      !Number.isSafeInteger(value) ||
      value < 0
    ) {
      return `${label} must be a non-negative safe integer.`;
    }

    return true;
  };
