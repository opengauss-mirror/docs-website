export interface HomeBannerItemT {
  title: string;
  desc: string;
  href: string;
  bg_light: string;
  bg_dark: string;
  bg_mb_light: string;
  bg_mb_dark: string;
}

export interface HomeRecommendT {
  columns: number;
  columns_mb: number;
  items: HomeBannerItemT[];
}

export interface HomeInstallationT {
  title: string;
  item_icon: string;
  item_bg_icon: string;
  item_bg_light: string;
  item_bg_dark: string;
  item_title: string;
  item_desc: string;
  item_href: string;
}

export interface HomeUsageAndOmItemT {
  icon: string;
  bg_icon: string;
  title: string;
  desc: string;
  href: string;
}

export interface HomeUsageAndOmT {
  title: string;
  columns: number;
  columns_mb: number;
  items: HomeUsageAndOmItemT[];
}

export interface HomeSectionItemT {
  title: string;
  desc: string;
  href: string;
  icon?: string;
}

export interface HomeSectionT {
  title: string;
  columns: number;
  columns_mb: number;
  items: HomeSectionItemT[];
}

export interface HomeConfig {
  hots: string[];
  recommend: HomeRecommendT;
  installation: HomeInstallationT;
  usage_and_om: HomeUsageAndOmT;
  sections: HomeSectionT[];
}
