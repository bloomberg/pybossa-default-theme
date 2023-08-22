## Development

### Install Node
1. Install [nvm](https://github.com/nvm-sh/nvm)
2. Inside the `static/src` folder, run `nvm install`

### NPM
1. Run `npm install` to install packages.

#### Helpful npm commands:
Prefix these with `npm run`

* `build` - build bundles
* `watch` - run webpack in debug mode and watch for files changes
* `test` - run Jest tests
* `lint` - run ESLint

See `package.json` for additional commands.

### Yarn
1. Install [yarn](https://yarnpkg.com/lang/en/docs/install)
2. Install webpack globally (with yarn or npm)
3. Follow instructions:
```sh
yarn # install packages
yarn webpack # webpack build
yarn watch # during development
yarn test # to run tests
yarn lint # to lint
```
