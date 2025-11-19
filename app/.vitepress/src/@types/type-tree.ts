export interface TocItemT {
  id: string;
  label: string;
  href?: string;
  description?: string;
  type: string;
  isManual?: boolean;
  upstream?: string;
  sections?: Array<TocItemT>;
}

export interface TreeNodeT {
  id: string;
  label: string;
  depth: number;
  href?: string;
  parent: TreeNodeT | null;
  description: string | null;
  type: string;
  isManual: boolean;
  upstream: string;
  children: Array<TreeNodeT>;
}

export type TreeT = TreeNodeT;