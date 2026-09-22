# Cookie consent and policy

## What will change
- Add a small cookie banner shown on a visitor's first visit.
- Provide two clear choices: **Accept all** and **Necessary only**.
- Save the visitor's choice so the banner does not repeatedly appear.
- Add a Cookie Policy page explaining necessary storage, optional cookies, retention, and how to change consent.
- Link the Cookie Policy from the footer.

## Technical details
- Treat sign-in storage, theme preference, policy acceptance, and the consent record as necessary because the app relies on them to function.
- Do not enable analytics or advertising cookies; **Accept all** records permission for future optional cookies only.
- Keep consent logic in a reusable component mounted once across the app.
- Verify both choices, persistence after reload, the policy link, and mobile layout.
