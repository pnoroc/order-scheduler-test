# Order Scheduler

A work-order scheduling application built with Angular and Nx. It presents a
zoomable **timeline board** of work orders across multiple work centers and lets
you create, edit and delete schedules, with overlap validation so two orders can
never occupy the same work center at the same time.

> Repository: <https://github.com/pnoroc/order-scheduler-test.git>

## Overview

The app reads from an in-memory **mock ERP backend** (no server required) and
exposes the following:

- **Timeline board** — work centers as rows, work orders as bars positioned by
  their start/end dates. Bars are colour-coded by status.
- **Zoom levels** — switch the timeline granularity between **Day**, **Week**
  and **Month**.
- **Create / edit orders** — a reactive form (in a slide-out panel) with a name,
  status (`Open`, `In progress`, `Complete`, `Blocked`), and a start/end date
  range. Form validation enforces required fields and name length.
- **Delete orders** — via the per-order action menu.
- **Overlap protection** — adding or editing an order that conflicts with an
  existing order in the same work center is rejected, and a toast notification
  explains why.

State lives in a single reactive store (`WorkOrderService`); business rules
(overlap, grouping by period) are kept in pure, testable helpers. The service is
designed so the in-memory state can later be swapped for real HTTP calls without
changing its public API.

### Architecture & design goals

The system is driven by a **single input: the selected time period**. Changing it
should be the only trigger needed — everything downstream reacts automatically:

1. The **store** fetches the data for the requested period.
2. The **scheduler UI** composes itself from that data (rows per work center,
   bars per order) and re-renders.

This holds for any source of change, including **real-time updates** pushed from
the backend rather than user-initiated edits.

To make that possible, the store is an **abstraction over the transport**, not a
single implementation. The same public API is backed interchangeably by:

- **HTTP** — request/response fetching of schedules for a period.
- **WebSocket** — a live subscription that streams changes in real time.
- **localStorage** — a fully client-side store for offline or demo use.

The UI never talks to a transport directly; it only observes the store's state
and adapts to whatever the store emits. Swapping or combining transports
therefore requires no changes to the components — exactly the seam the current
in-memory `WorkOrderService` is designed to be replaced through.

## Tech stack

- **[Angular](https://angular.dev) 21** (standalone components, signals)
- **[Nx](https://nx.dev) 22** monorepo tooling
- **[Bootstrap](https://getbootstrap.com) 5** + **[ng-bootstrap](https://ng-bootstrap.github.io)** (offcanvas, datepicker, toasts)
- **[ng-select](https://ng-select.github.io/ng-select)** for dropdowns
- **[Luxon](https://moment.github.io/luxon)** for date handling
- **Jest** (unit tests) and **Cypress** (e2e)

I prefer to minimize third-party dependencies, ideally standardizing the codebase on a single UI kit like Angular Material or Ng-bootstrap.
Since the project required the ng-bootstrap datepicker feature, I chose to standardize the rest of the UI on Bootstrap 5 for consistency.

## Project structure

The workspace is organised into one application and several feature/shared
libraries:

```
apps/
  order-scheduler-tech-test/        # The Angular application shell
  order-scheduler-tech-test-e2e/    # Cypress end-to-end tests
libs/
  app-container/                    # Top-level app layout/container
  ui/ui-components/                 # Reusable UI (timeline board, dropdown, badge, toast, action menu)
  work-order-schedule/
    feature-work-order-schedule/    # Schedule feature: board view + create/edit form
    data-access/                    # Models, mock ERP state, WorkOrderService, seed data
    utils/                          # Pure helpers (e.g. schedules → timeline rows)
```

## Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm** (ships with Node)

## Getting started

Clone the repository and install dependencies:

```sh
git clone https://github.com/pnoroc/order-scheduler-test.git
cd order-scheduler-test
npm install
```

### Run the app

```sh
npm start
```

This serves the app at <http://localhost:4200/> with hot reload. The equivalent
Nx command is:

```sh
npx nx serve order-scheduler-tech-test
```

### Build for production

```sh
npx nx build order-scheduler-tech-test
```

The bundle is emitted to `dist/apps/order-scheduler-tech-test`.

## Testing & quality

```sh
# Unit tests (Jest) — run for every project
npx nx run-many -t test

# Unit tests for a single project
npx nx test work-order-schedule-data-access

# Lint
npx nx run-many -t lint

# End-to-end tests (Cypress)
npx nx e2e order-scheduler-tech-test-e2e
```

## Useful Nx commands

```sh
# Visualise the project dependency graph
npx nx graph

# Show all available targets for a project
npx nx show project order-scheduler-tech-test
```
