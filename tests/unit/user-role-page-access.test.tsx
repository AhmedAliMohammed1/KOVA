import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
const guard = vi.hoisted(() => vi.fn());
const rpc = vi.hoisted(() => vi.fn());
vi.mock("@/server/auth/roles", () => ({ requireRoles: guard }));
vi.mock("@/features/auth/actions", () => ({ signOutAction: vi.fn() }));
import AdminLayout from "../../apps/admin/src/app/[locale]/admin/layout";
import UserRolesPage from "../../apps/admin/src/app/[locale]/admin/users/page";
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  rpc.mockResolvedValue({ data: { users: [], total: 0 }, error: null });
});
describe("role-management navigation and page access", () => {
  it.each(["admin", "support", "customer"])(
    "hides role-management navigation for %s",
    async (role) => {
      guard.mockResolvedValue({ roles: [role] });
      render(
        await AdminLayout({
          children: <p>Content</p>,
          params: Promise.resolve({ locale: "en" }),
        }),
      );
      expect(
        screen.queryByRole("link", { name: "User roles" }),
      ).not.toBeInTheDocument();
    },
  );
  it("shows both desktop and mobile role links for super admins", async () => {
    guard.mockResolvedValue({ roles: ["super_admin"] });
    render(
      await AdminLayout({
        children: <p>Content</p>,
        params: Promise.resolve({ locale: "ar" }),
      }),
    );
    expect(
      screen.getAllByRole("link", { name: "صلاحيات المستخدمين" }),
    ).toHaveLength(2);
  });
  it("checks super-admin access before loading the directory", async () => {
    guard.mockRejectedValue(new Error("Forbidden"));
    await expect(
      UserRolesPage({
        params: Promise.resolve({ locale: "en" }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toThrow("Forbidden");
    expect(guard).toHaveBeenCalledWith(["super_admin"]);
    expect(rpc).not.toHaveBeenCalled();
  });
  it("bounds the search and page parameters before querying", async () => {
    guard.mockResolvedValue({ supabase: { rpc }, userId: "owner" });
    await UserRolesPage({
      params: Promise.resolve({ locale: "en" }),
      searchParams: Promise.resolve({ q: "x".repeat(200), page: "9999999" }),
    });
    expect(rpc).toHaveBeenCalledWith("super_admin_list_users", {
      p_query: "x".repeat(120),
      p_page: 100000,
    });
  });
});
