export type navbarItems = {
  label: string;
  href: string;
  icon: "token" | "document" | "soap" | "grpc" | "stripe";
};

export type IconOptions = {
  bold?: boolean;
  active?: boolean;
  reduced?: boolean;
};
