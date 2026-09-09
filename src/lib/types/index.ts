export interface TeesLink {
  disable?: boolean | undefined;
  exact?: boolean | undefined;
  href: string;
  label: string;
  tag?: string | undefined;
}

export type DocumentId = string | number;

export type FilterValue = "all" | (string & {});
