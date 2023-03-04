require("@rakkasjs/eslint-config/patch");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  root: true,
  extends: ["@rakkasjs"],
  parserOptions: { tsconfigRootDir: __dirname },
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname + "/tsconfig.json"],
      },
    },
  },
};
