# Global styles

Theme-based SCSS infrastructure following the [7-1 pattern](https://sass-guidelin.es/#the-7-1-pattern)
with modern Dart Sass modules (`@use` / `@forward` — no `@import`).

`styles.scss` (the single global entry registered in `project.json`) does nothing
but `@use 'styles/main'`. `main.scss` composes the layers in dependency order.

## Layers

```
styles/
├── abstracts/   Compile-time only — emits NO CSS
│   ├── _variables.scss   Sass maps: $breakpoints, $z-layers, $radius, $font-stack
│   ├── _functions.scss   Guarded map getters: z(), radius(), breakpoint()
│   ├── _mixins.scss      truncate, flex-center, respond-to($bp)
│   └── _index.scss       Barrel → `@use '../abstracts' as *;`
├── themes/      Runtime theming — emits CSS custom properties
│   ├── _tokens.scss      $light + $dark semantic token maps (source of truth)
│   ├── _theme.scss       spread($map) mixin → --key: value
│   └── _index.scss       :root { light }   [data-theme='dark'] { dark }
├── base/        Document defaults
│   ├── _reset.scss       box-sizing + margin reset
│   ├── _general.scss     html/body surface + ink (via var() tokens)
│   └── _typography.scss  font stack
├── components/  Global component styling that must escape view encapsulation
│   └── _dropdown.scss    ng-select overlay overrides
└── main.scss    @use order: themes → base → components → 3rd-party
```

## The theme contract = CSS custom properties

Themes are defined as Sass maps in `themes/_tokens.scss` and projected onto the
DOM as CSS custom properties. **Components consume `var(--token)` and never import
these maps** — so any component, in this app or any library, stays decoupled from
the build's Sass internals.

```scss
// In any component .scss:
.title { color: var(--ink); }
.badge { background: var(--open-bg); color: var(--open-fg); }
```

Component-specific layout values that aren't part of the shared palette stay
**local to the component** (e.g. the gantt geometry lives on `:host` in
`work-order-schedule.component.scss`), keeping the global token surface small.

## Adding / switching a theme

1. Add a new map with the **same keys** to `themes/_tokens.scss`.
2. Project it in `themes/_index.scss` under a scope, e.g.
   `[data-theme='high-contrast'] { @include theme.spread(tokens.$high-contrast); }`.
3. Switch at runtime by setting the attribute on the host element —
   `<html data-theme="dark">` — no recompile needed.

## Using abstracts

`abstracts/` emit no CSS, so they're safe to `@use` from any global partial:

```scss
@use '../abstracts' as *;

.thing { font-family: $font-stack; z-index: z('header'); }
@include respond-to('lg') { /* ... */ }
```
