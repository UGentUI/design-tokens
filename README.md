# Design Tokens

Single source of truth om UGent UI design beslissingen te benoemen en te bewaren.

## Inleiding

Dit project maakt gebruik van aangepaste transformators en [Style Dictionary](https://amzn.github.io/style-dictionary/) om design tokens, gedefinieerd in `tokens-raw/tokens.json` volgens de [W3C Draft Specification for Design Tokens](https://tr.designtokens.org/format/), om te zetten naar verschillende outputformaten zoals CSS custom properties en SCSS variabelen. Deze README beschrijft hoe je de gegenereerde build-bestanden kunt integreren en gebruiken in je eigen project.

## Installatie

```bash
npm add @ugent-ui/design-tokens
```

## Gebruik

### CSS custom properties

Importeer en gebruik **alle** design tokens als CSS custom properies in je project:

```html
<link
  rel="stylesheet"
  href="/node_modules/@ugent-ui/design-tokens/build/css/variables.css"
/>

<style>
  .example-element {
    color: var(--light-color-text-brand);
  }
</style>
```

### SCSS

Importeer en gebruik **alle** design tokens als SCSS-variabelen in je project:

```scss
@import "@ugent-ui/design-tokens/build/scss/_variables";

$example-var: $light-color-text-brand;

.example-element {
  color: $example-var;
}
```

### Ondersteuning voor dark mode

Voor elk light _color_ en _neutral_ token bestaat een dark equivalent. Door gebruik te maken van de theme bestanden gebeurt de omzetting of mapping automatisch.

#### CSS

Importeer de core en theme bestanden in je project en stel het relevante `color-mode` data-attribuut in om het gewenste thema te activeren:

```html
<html data-color-mode="dark">
  <!-- light|dark -->

  <link
    rel="stylesheet"
    href="node_modules/@ugent-ui/design-tokens/build/css/core.css"
  />
  <link
    rel="stylesheet"
    href="node_modules/@ugent-ui/design-tokens/build/css/light-theme.css"
  />
  <link
    rel="stylesheet"
    href="node_modules/@ugent-ui/design-tokens/build/css/dark-theme.css"
  />

  <style>
    .example-element {
      color: var(--color-text-brand);
    }
  </style>
</html>
```

#### SCSS

Importeer de design tokens SCSS maps en helpers, en gebruik de token functie om een design token op te halen uit een opgegeven map en een fallback waarde te gebruiken indien het token niet beschikbaar is als CSS-variabele:

```scss
@import "@ugent-ui/design-tokens/build/scss/_core-map";
@import "@ugent-ui/design-tokens/build/scss/_light-theme-map";
@import "@ugent-ui/design-tokens/build/scss/_dark-theme-map";
@import "@ugent-ui/design-tokens/src/utils/scss/helpers";

body {
  background-color: token("color-elevation-surface-basic-default", $light);
}

// Output: background-color: var(--color-elevation-surface-basic-default, #ffffff);
```

### Design token consumers

#### Bootstrap

Om Bootstrap aan te passen met de design tokens, volg je deze stappen:

1. Importeer de design tokens en SCSS-helpers en wijs de thema maps toe aan variabelen.
2. Gebruik de token functie om Bootstrap variabelen te overschrijven met waarden uit de design tokens.
3. Importeer de Bootstrap SCSS-bestanden zodat de aangepaste variabelen worden toegepast

```scss
// Design Tokens
@use "@ugent-ui/design-tokens/build/scss/_light-theme-map" as light-theme-map;
@use "@ugent-ui/design-tokens/build/scss/_dark-theme-map" as dark-theme-map;
@use "@ugent-ui/design-tokens/build/scss/_core-map" as core-map;
@import "@ugent-ui/design-tokens/src/utils/scss/helpers";

// Override Bootstrap vars
$navbar-padding-y: token("space-0", core-map.$core);
$navbar-brand-padding-y: token("space-0", core-map.$core);
$grid-gutter-width: map-get(core-map.$core, "space-400");
...

// Import Bootstrap
@import "bootstrap/scss/bootstrap";
```

#### Zeroheight

Zeroheight wordt gebruikt voor het documenteren van het Design System. Omdat ZeroHeight ook de W3C Draft Specification for Design Tokens volgt, is het mogelijk om direct te verwijzen naar de `tokens-raw/tokens.json` master file: https://raw.githubusercontent.com/UGentUI/design-tokens/main/tokens-raw/tokens.json

#### Figma Token Studio

Voor Figma Token Studio is een transformer vereist. Deze transformer converteert de design tokens naar een formaat dat compatibel is met Figma Token Studio en ondersteunt de themes functionaliteit. Gebruik de `tokens-parsed/figma-token-studio/tokens.json` file: https://raw.githubusercontent.com/UGentUI/design-tokens/main/tokens-parsed/figma-token-studio/tokens.json
