import { Stack, NavLink } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconKeyFilled,
  IconFileCode2Filled,
  IconCircleLetterSFilled,
  IconSunWind,
  IconBrandStripe,
} from "@tabler/icons-react";
import { navbarItems, IconOptions } from "@/types/dashboard";

const navItems: navbarItems[] = [
  { label: "Tokens", href: "/dashboard", icon: "token" },
  { label: "XML/JSON", href: "/dashboard/xmlJson/", icon: "document" },
  { label: "Soap Validation", href: "/dashboard/soap/", icon: "soap" },
  { label: "gRPC", href: "/dashboard/grpc/", icon: "grpc" },
  { label: "Stripe", href: "/dashboard/stripe/", icon: "stripe" },
];

export const DashboardSidebar = ({
  collapsed = false,
}: {
  collapsed?: boolean;
}) => {
  const pathname = usePathname();

  const normalizePath = (path: string) =>
    path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;

  const isActive = (href: string) => {
    const normalizedPathname = normalizePath(pathname);
    const normalizedHref = normalizePath(href);

    return (
      normalizedPathname === normalizedHref ||
      (normalizedPathname.startsWith(`${normalizedHref}/`) &&
        normalizedHref !== "/dashboard")
    );
  };

  const getDashboardIcon = (
    icon: navbarItems["icon"],
    options: IconOptions = {},
  ) => {
    const { bold = false, active = false, reduced = false } = options;
    const strokeWidth = bold ? 1.5 : 1.2;
    const color = reduced
      ? active
        ? "var(--mantine-color-text-4)"
        : "var(--mantine-color-text-0)"
      : undefined;

    switch (icon) {
      case "token":
        return (
          <IconKeyFilled strokeWidth={strokeWidth} color={color} size={30} />
        );
      case "document":
        return (
          <IconFileCode2Filled
            strokeWidth={strokeWidth}
            color={color}
            size={30}
          />
        );
      case "soap":
        return (
          <IconCircleLetterSFilled
            strokeWidth={strokeWidth}
            color={color}
            size={30}
          />
        );
      case "grpc":
        return (
          <IconSunWind strokeWidth={strokeWidth} color={color} size={30} />
        );
      case "stripe":
        return (
          <IconBrandStripe strokeWidth={strokeWidth} color={color} size={30} />
        );

      default:
        return null;
    }
  };

  return (
    <Stack justify="center" align="center" gap={"xs"}>
      {navItems.map((item) => (
        <NavLink
          fz={"xl"}
          h={"55px"}
          leftSection={getDashboardIcon(item.icon, {
            bold: isActive(item.href),
            active: isActive(item.href),
            reduced: true,
          })}
          fw={isActive(item.href) ? 600 : 400}
          bdrs={"md"}
          href={item.href}
          key={item.label}
          component={Link}
          active={isActive(item.href)}
          label={collapsed ? undefined : item.label}
          color={"var(--mantine-color-text-0)"}
          style={{
            color: isActive(item.href)
              ? "var(--mantine-color-text-4)"
              : "var(--mantine-color-text-0)",
            width: collapsed ? "52px" : "100%",
            margin: collapsed ? "0 auto" : undefined,
          }}
          bg={
            isActive(item.href)
              ? "var(--mantine-color-navlinks-0)"
              : "var(--mantine-color-bg-0)"
          }
        />
      ))}
    </Stack>
  );
};
