export const SIM_TYPE = {
  ESIM: "esim",
  PHYSICAL: "physical",
} as const;

export type SimType = (typeof SIM_TYPE)[keyof typeof SIM_TYPE];