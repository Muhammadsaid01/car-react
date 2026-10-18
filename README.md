# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## LuxAvto configuration and verification

Run the API in the sibling `Mod1` project and this frontend with `npm start`.
The existing local deployment uses frontend `http://localhost:3000` and
`REACT_APP_API_URL=http://localhost:3004`. Configure that variable before building.
Authentication uses an HttpOnly API cookie; session restoration calls
`GET /member/detail` and does not trust localStorage as authentication.
See the backend README for HTTPS cookie settings and MongoDB replica-set requirements.

Checks: `./node_modules/.bin/tsc --noEmit --incremental false`,
`CI=true npm test -- --watchAll=false --runInBand`, and `npm run build`.
Set `BUILD_PATH` to a temporary directory to keep an existing build unchanged.
The Jest setup transforms real Swiper ESM modules and stubs only Swiper CSS;
MUI/Swiper media-query APIs are supplied for jsdom.

Yarn resolutions keep React/React DOM types on the existing React 18 versions,
including transitive router/testing-library imports. Runtime packages were not
upgraded. Use `yarn install --frozen-lockfile` for a reproducible install.
The TypeScript build worker is allocated 4096 MB to avoid CRA's 2048 MB heap limit.
The older test/UI libraries may still emit React deprecation/peer warnings.

Payment remains a status-confirmation flow without a payment provider.
The Help contact form has no contact service yet.

The running-browser verification and its limitations are recorded in
[docs/qa/verification.md](docs/qa/verification.md), with viewport measurements
and screenshots. The sibling backend README includes tested macOS foreground
MongoDB replica-set startup instructions and explicit hostname/origin settings.
