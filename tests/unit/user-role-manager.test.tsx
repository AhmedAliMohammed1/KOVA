import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
vi.mock("../../apps/admin/src/features/admin/user-roles/actions", () => ({
  changeUserRoleAction: vi.fn(),
}));
import { UserRoleManager } from "../../apps/admin/src/features/admin/user-roles/user-role-manager";
import type { DirectoryUser } from "../../apps/admin/src/features/admin/user-roles/model";
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});
afterEach(cleanup);
const self: DirectoryUser = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  email: "owner@example.test",
  fullName: "Owner",
  verified: true,
  roles: ["customer", "admin", "super_admin"],
};
function open(user = self, locale: "ar" | "en" = "en") {
  render(<UserRoleManager users={[user]} viewerId={self.id} locale={locale} />);
  const trigger = screen.getByRole("button", {
    name: /Manage roles|إدارة الصلاحيات/,
  });
  fireEvent.click(trigger);
  return trigger;
}
describe("user role management confirmation", () => {
  it("never offers removal of automatic customer access", () => {
    open();
    expect(
      screen.queryByRole("option", { name: /Customer ·/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeRequired();
  });
  it("blocks self-removal of the super-admin role", () => {
    open();
    fireEvent.change(screen.getByLabelText("Role"), {
      target: { value: "super_admin" },
    });
    expect(
      screen.getByRole("button", { name: "Confirm revoke" }),
    ).toBeDisabled();
    expect(
      screen.getByText(
        "Another super admin must remove your super admin role.",
      ),
    ).toBeInTheDocument();
  });
  it("requires new confirmation when the selected role changes", () => {
    open();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toBeChecked();
    fireEvent.change(screen.getByLabelText("Role"), {
      target: { value: "warehouse" },
    });
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
  it("blocks grants to unverified accounts", () => {
    open({
      ...self,
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      verified: false,
      roles: ["customer"],
    });
    expect(
      screen.getByRole("button", { name: "Confirm grant" }),
    ).toBeDisabled();
  });
  it("supports Arabic role labels and returns focus on cancel", () => {
    const trigger = open(self, "ar");
    expect(
      screen.getByRole("dialog", { name: "إدارة صلاحيات المستخدم" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("الصلاحية")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "إلغاء" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
