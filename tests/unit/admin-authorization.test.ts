import { describe, expect, it, vi } from "vitest";
const account = vi.hoisted(() => ({ roles: ["customer"] as string[] }));
const redirect = vi.hoisted(() => vi.fn((destination: string) => { throw new Error(`REDIRECT:${destination}`); }));
vi.mock("next/navigation", () => ({redirect}));
vi.mock("@/lib/supabase/config", () => ({hasSupabaseEnvironment:()=>true}));
vi.mock("@/lib/supabase/server", () => ({createClient:async()=>({auth:{getClaims:async()=>({data:{claims:{sub:"test-staff"}},error:null})},from:()=>({select:()=>({eq:async()=>({data:account.roles.map(role=>({role})),error:null})})})})}));
import { requireRoles } from "@/server/auth/roles";
describe("standalone admin authorization", () => {
  it("sends an authenticated unauthorized user to account access feedback, avoiding a root redirect loop", async () => {
    account.roles=["customer"];
    await expect(requireRoles(["admin","super_admin"])).rejects.toThrow("REDIRECT:/en/account?error=access");
  });
  it("enforces each operation's required staff role", async () => {
    account.roles=["warehouse"];
    await expect(requireRoles(["warehouse","admin"])).resolves.toMatchObject({roles:["warehouse"]});
    await expect(requireRoles(["product_manager","admin"])).rejects.toThrow("REDIRECT:");
  });
});
