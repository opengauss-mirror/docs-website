export interface NavChildrenItemT {
  NAME: string;
  DESCRIPTION: string;
  TAG?: string;
  ICON?: string;
  URL: string;
}

export interface NavSubItemT {
  NAME: string;
  CHILDREN: NavChildrenItemT[];
}

export interface ShortCutItemT {
  NAME: string;
  URL: string;
}

export interface NavItemT {
  NAME: string;
  ID: string;
  WITH_PICTURE?: boolean;
  CHILDREN?: NavSubItemT[];
  SHORTCUT?: ShortCutItemT[];
}

export interface SourceCodeItemT {
  NAME: string;
  PATH: string;
  ICON: string;
}
