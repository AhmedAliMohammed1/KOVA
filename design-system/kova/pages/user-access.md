# User access management

Inherits the KOVA master palette, Arabic fonts, 44–48px controls and logical RTL
spacing. A generic UI/UX Pro Max design-system query suggested glass styling
and a SaaS landing page; that result did not fit this established admin app and
was rejected. The focused UX result “Table Handling” supported cards on mobile.

- Use a quiet white search panel, navy actions and teal super-admin markers.
- Show users as responsive cards: one column on phones, two/three on larger screens.
- Keep full email addresses readable using bidi isolation and wrapping.
- Use a labelled native modal for role selection and confirmation. Reset the
  confirmation checkbox when the selected role changes; restore focus on close.
- Distinguish grants from revocations with explicit text as well as color.
- Never offer automatic customer-role removal or self-super-admin revocation.
- Show loading, success, recoverable error and empty-search states.
- Hide both dashboard entry points for all roles other than `super_admin`.

Authorization is enforced independently in the page, action and database, never
in client-side visibility alone. No extra UI library or animation is needed.
