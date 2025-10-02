# @opi_pib/stylelint-config-base

## Install

```
npm install -D @opi_pib/stylelint-config-base
```

## Config

### stylelint.config.mjs // or .stylelintrc.mjs

```
import { css } from '@opi_pib/stylelint-config-base'; // or scss

/** @type {import('stylelint').Config} */
export default css;
```

### package.json

```
"lint:styles": "stylelint **/*.scss --fix -i=.gitignore",
```

### .browserslistrc

```
> 5%

last 1 Chrome version
last 1 Firefox version
last 2 Edge major versions
last 1 Safari major versions
last 1 iOS major versions
```

### VS Code settings.json

```
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "[scss]": {
    "editor.defaultFormatter": "stylelint.vscode-stylelint"
  },
  "scss.validate": false,
  "stylelint.validate": ["scss"]
}
```
