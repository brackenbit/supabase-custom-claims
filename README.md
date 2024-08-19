# Supabase Custom Claims

Demo project built to learn how to add custom claims to Supabase authentication, to support e.g. multi-tenancy and user roles.

## Overview

The application is a simple CRUD app, where users manipulate "widgets".

The demo contains two tenants, with data isolated through row-level security (RLS).

Each tenant has three users, with different roles.

### Role Permissions

Demo users are assigned roles with the following permissions:

| Role    | Permissions                         |
| ------- | ----------------------------------- |
| User    | View widgets                        |
| Manager | View and edit widgets               |
| Admin   | View, edit, add, and delete widgets |

### UI still offers forbidden actions

This app has an intentionally poor UX!

To show how user roles restrict the actions different users can take, even forbidden actions are shown in the UI.

## A Tangent on Bundle Size

The react-bootstrap docs suggest that components should be individually imported using a direct path, e.g.:

```typescript
import Container from "react-bootstrap/Container";
```

rather than the named import used automatically by e.g. VSCodium:

```typescript
import { Container } from "react-bootstrap";
```

The suggestion is that this will allow for better tree-shaking, and result in a smaller bundle.

Not wanting to give up on the convenience of automatic imports without a good reason, I tested this, and found that using direct paths actually _increased_ bundle size (though by < 1 kB). It seems that at least while using Vite (with ESM/Rollup), there is no benefit to manually adjusting react-bootstrap imports.

## Testing

Automated testing is set up with Vitest, React Testing Library, and Playwright.

Unit testing has very limited coverage (only MainNavbar is included).

E2E testing tests each role for each tenant, confirming that all permissions are appropriately applied.

## Building the Demo

The demo relies on Supabase parameters being set in .env (omitted by gitignore).
You should populate .env with:

-   VITE_SUPABASE_URL="your_value"
-   VITE_SUPABASE_PUBLIC_KEY="your_value"

Testing similarly relies on a .env.test, which should be populated with:

-   VITE_SUPABASE_ACCESS_TOKEN
-   VITE_SUPABASE_PROJECT_REF

## Attribution

-   The useLocalStorageState hook was adapted from code from "The Ultimate React Course 2024" by Jonas Schmedtmann (https://github.com/jonasschmedtmann/ultimate-react-course). The overall structure and boilerplate used in hooks was also inspired by this excellent course.
-   The ToasterWithMax component was adapted from code by softmarshmallow (https://github.com/timolins/react-hot-toast/issues/31#issuecomment-2084653008).
-   The plpgsql function to programmatically create Supabase users was adapted from code by jziggas (https://github.com/orgs/supabase/discussions/5043#discussioncomment-6191165).
