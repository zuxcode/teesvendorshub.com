import data from "./data/index.json";

export interface State {
  capital: string;
  lgas: string[];
  name: string;
  towns: string[];
}

export interface StateList {
  label: string;
  value: string;
}

export interface NigeriaGeoData {
  states: State[];
}

export const getStates = (): State[] => data.states;

export const getState = (name: string): State | undefined =>
  data.states.find((state) => state.name.toLowerCase() === name.toLowerCase());

export const getStateTowns = (name: string): string[] =>
  getState(name)?.towns || [];

export const getAllStates = (): string[] =>
  data.states.map((state) => state.name);
