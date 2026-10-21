import { beforeEach, describe, expect, it, vi } from "vitest";
const rpc = vi.hoisted(() => vi.fn());
const guard = vi.hoisted(() => vi.fn());
const revalidate = vi.hoisted(() => vi.fn());
vi.mock("@/server/auth/roles", () => ({ requireRoles: guard }));
vi.mock("next/cache", () => ({ revalidatePath: revalidate }));
import { changeUserRoleAction } from "../../apps/admin/src/features/admin/user-roles/actions";
import { roleChangeSchema } from "../../apps/admin/src/features/admin/user-roles/model";
const initial = { status: "idle" as const, message: "" };
function form(overrides: Record<string, string> = {}) {
  const f = new FormData();
  Object.entries({
    locale: "en",
    userId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    role: "support",
    operation: "grant",
    confirmed: "on",
    ...overrides,
  }).forEach(([k, v]) => f.set(k, v));
  return f;
}
beforeEach(() => {
  vi.clearAllMocks();
  guard.mockResolvedValue({ supabase: { rpc } });
  rpc.mockResolvedValue({ data: { changed: true }, error: null });
});
describe("super-admin role actions", () => {
  it("rejects direct non-super-admin calls before invoking any RPC", async () => {
    guard.mockRejectedValue(new Error("access denied"));
    await expect(changeUserRoleAction(initial, form())).rejects.toThrow(
      "access denied",
    );
    expect(guard).toHaveBeenCalledWith(["super_admin"]);
    expect(rpc).not.toHaveBeenCalled();
  });
  it.each([
    { role: "customer" },
    { role: "owner" },
    { confirmed: "" },
    { operation: "delete" },
    { userId: "not-a-uuid" },
  ])("rejects invalid or unconfirmed changes: %j", async (overrides) => {
    expect((await changeUserRoleAction(initial, form(overrides))).status).toBe(
      "error",
    );
    expect(rpc).not.toHaveBeenCalled();
  });
  it("grants the requested role and refreshes both dashboard locales", async () => {
    expect(
      (await changeUserRoleAction(initial, form({ role: "admin" }))).status,
    ).toBe("success");
    expect(rpc).toHaveBeenCalledWith("super_admin_change_role", {
      p_user_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      p_role: "admin",
      p_enabled: true,
    });
    expect(revalidate).toHaveBeenCalledWith("/ar/admin", "layout");
    expect(revalidate).toHaveBeenCalledWith("/en/admin", "layout");
  });
  it("revokes without translating the operation into a grant", async () => {
    await changeUserRoleAction(initial, form({ operation: "revoke" }));
    expect(rpc.mock.calls[0][1].p_enabled).toBe(false);
  });
  it("explains last-super-admin protection in Arabic", async () => {
    rpc.mockResolvedValue({ error: { message: "last_super_admin" } });
    const result = await changeUserRoleAction(
      initial,
      form({ locale: "ar", role: "super_admin", operation: "revoke" }),
    );
    expect(result).toEqual({
      status: "error",
      message: "لا يمكن إزالة صلاحية آخر مدير عام.",
    });
    expect(revalidate).not.toHaveBeenCalled();
  });
  it("does not expose raw database errors", async () => {
    rpc.mockResolvedValue({
      error: { message: "internal details secret table" },
    });
    const result = await changeUserRoleAction(initial, form());
    expect(result.message).not.toContain("internal details");
  });
  it("accepts only known staff roles", () => {
    expect(
      roleChangeSchema.safeParse({
        userId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        role: "super_admin",
        operation: "grant",
        confirmed: "on",
      }).success,
    ).toBe(true);
  });
});
