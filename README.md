# @opi-pib/stylelint-config-base

## Install

```
npm install -D stylelint prettier @opi-pib/stylelint-config-base
```

### Temporary fix: https://github.com/stylelint/stylelint/issues/5766

```
npm install -D postcss
```

## Config

### .stylelintrc.json

```
{
	"extends": ["@opi-pib/stylelint-config-base"]
}
```

### package.json

```
"lint:styles": "stylelint **/*.scss --fix -i=.gitignore",
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
