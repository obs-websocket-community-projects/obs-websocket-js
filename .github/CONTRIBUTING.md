## Issues/Feedback/Requests
- Create a new issue [here](https://github.com/haganbmj/obs-websocket-js/issues/new), please be as descriptive as possible.

## Building the Project Locally
- Install [node.js](http://nodejs.org)
- Clone/Fork the repo
- Install dependencies with `npm install`
- Generate the browser distributable Javascript file with `npm run build`  
  - Or `npm run watch` to automatically build when files are modified.
- This project makes use of eslint, run `npm run test:static` for linting and `npm run test:ava` for basic unit testing. If you have the types compiled you can also run `npm run test:types`.

## Building Typings Locally
- Export GH_TOKEN as an environment variable, using a generated Personal Access Token.
- `npm run build:types`

## Contributing Guidelines
- Please use descriptive commit messages.
- When submitting a Pull Request, reference related [Issues](https://github.com/haganbmj/obs-websocket-js/issues) if any exist.
