import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/components/store/header";
import { SiteFooter } from "@/components/store/site-footer";
import type { ViewerAccess } from "@/server/auth/roles";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/store/cart-provider", () => ({
  useShop: () => ({ cart: 0, wishlist: [] }),
}));

vi.mock("@/features/auth/actions", () => ({
  signOutAction: vi.fn(),
}));

afterEach(cleanup);

function renderNavigation(viewer: ViewerAccess) {
  return render(
    <>
      <Header locale="en" viewer={viewer} />
      <SiteFooter locale="en" viewer={viewer} />
    </>,
  );
}

describe("store authentication navigation", () => {
  it("shows sign in and no admin or sign-out actions to guests", () => {
    const { container } = renderNavigation({
      isAuthenticated: false,
      canAccessAdmin: false,
    });

    expect(screen.getByTitle("Sign In")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign Out" })).toBeNull();
    expect(container.querySelectorAll('a[href="/en/admin"]')).toHaveLength(0);
  });

  it("shows account and sign out but no admin actions to customers", () => {
    const { container } = renderNavigation({
      isAuthenticated: true,
      canAccessAdmin: false,
    });

    expect(screen.getByTitle("My account")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Sign Out" }).length,
    ).toBeGreaterThan(0);
    expect(container.querySelectorAll('a[href="/en/admin"]')).toHaveLength(0);
  });

  it("shows admin actions only when the server grants admin access", () => {
    const { container } = renderNavigation({
      isAuthenticated: true,
      canAccessAdmin: true,
    });

    expect(container.querySelectorAll('a[href="/en/admin"]')).toHaveLength(3);
    expect(screen.getByTitle("Admin Dashboard")).toBeInTheDocument();
  });

  it("keeps the closed mobile drawer out of keyboard navigation", () => {
    renderNavigation({ isAuthenticated: true, canAccessAdmin: false });

    const drawer = screen.getByLabelText("Store navigation", { selector: "dialog" });
    expect(drawer).not.toHaveAttribute("open");
  });

  it("keeps the phone header compact while retaining touch-sized primary actions", () => {
    const { container } = renderNavigation({
      isAuthenticated: false,
      canAccessAdmin: false,
    });

    expect(screen.getByLabelText("Search catalog")).toHaveClass(
      "hidden",
      "size-11",
      "sm:grid",
    );
    expect(screen.getByTitle("Sign In")).toHaveClass(
      "hidden",
      "size-11",
      "lg:grid",
    );
    expect(screen.getByLabelText("Wishlist (0)")).toHaveClass("size-11");
    expect(screen.getByLabelText("Bag (0)")).toHaveClass("size-11");
    expect(
      container.querySelector('header a[aria-label="KOVA Scrubs home"]'),
    ).toHaveClass("absolute");
    expect(container.querySelector('dialog a[href="/ar"]')).toHaveClass(
      "min-h-11",
    );

    for (const link of screen
      .getByRole("navigation", { name: "Shop links" })
      .querySelectorAll("a")) {
      expect(link).toHaveClass("min-h-11");
    }
  });
});
