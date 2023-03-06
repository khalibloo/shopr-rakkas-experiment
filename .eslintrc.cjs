require("@rakkasjs/eslint-config/patch");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  root: true,
  extends: ["@rakkasjs"],
  rules: {
    "react-hooks/exhaustive-deps": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
    "react/no-unescaped-entities": 0,
  },
  parserOptions: { tsconfigRootDir: __dirname },
  settings: {
    "import/resolver": {
      typescript: {
        project: [__dirname + "/tsconfig.json"],
      },
    },
  },
};
