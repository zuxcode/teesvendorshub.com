const WHITESPACE = /\s+/;

interface SplitFullNameResult {
  firstname: string;
  lastname: string;
}

export function splitFullName(fullName: string): SplitFullNameResult {
  const parts = fullName.trim().split(WHITESPACE);
  const [firstname = "", ...lastnameParts] = parts;
  return { firstname, lastname: lastnameParts.join(" ") };
}
