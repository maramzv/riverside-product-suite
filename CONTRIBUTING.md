# Contributing

Each product (Reader, Ask, Shelves, Press) is free game for its team —
change layout, styling, copy, features, whatever the app needs.

A few things are shared across all four and stay locked so one app's
change can't break the others:

## Locked (requires review from the suite owner)

- **Nav shell** — [src/components/Sidebar.jsx](src/components/Sidebar.jsx),
  [src/App.jsx](src/App.jsx), and the nav rules in
  [src/styles.css](src/styles.css) (`.rb-rail`, `.rb-navitem`, `.rb-lockup`
  and friends). This is the collapsible sidebar every product sits behind.
- **Logos** — everything under `public/brand/**` (each app's `icon.png`,
  `mark.png`, `header-wordmark.png`). Swap what these files point to and
  every place that references them changes at once.

`CODEOWNERS` enforces this: a PR touching either of the above needs the
suite owner's approval before it can merge. A PR that only touches your
own app's files (`public/apps/reader/**`, `public/apps/ask/**`,
`apps/shelves/**` + its build output, `public/apps/press/**`) doesn't
need anyone's sign-off — open a PR and merge it yourself.

## Documented, not enforced

- **Header height stays `130px`.** Every product's header sets this
  height independently in its own CSS/markup (it's not a shared file),
  so GitHub can't technically lock just that one line — it's a contract,
  not a gate. Keep it so the sidebar's suite-icon cap (which is sized to
  match) lines up across every app.

## Workflow

Direct pushes to `main` are disabled — open a PR even for changes that
don't need review. Once GitHub CODEOWNERS review (if required) is
satisfied, merge it yourself; there's no separate approval step for
your own app's files.
