# @opi_pib/stylelint-config-base

## Install

```
npm install -D stylelint @opi_pib/stylelint-config-base
```

## Config

### .stylelintrc.json

```
{
	"extends": ["@opi_pib/stylelint-config-base"]
}
```

### package.json

```
"lint:styles": "stylelint **/*.scss --fix -i=.gitignore",
```

### browserslist

```
> 5%
Last 2 versions
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
