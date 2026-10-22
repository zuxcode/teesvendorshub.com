import { payload } from "@/shared/payload/utils/payload";
import { SimRepository } from "../repository/sim.repository";
import { HydrateSimStore } from "./hydrate-sim-store";

const simRepository = new SimRepository(payload);

export async function Simserver() {
  const [sims, countries] = await Promise.all([
    await simRepository.findAllActive(),
    await simRepository.findAllCountries(),
  ]);

  return <HydrateSimStore countries={countries} sims={sims} />;
}
