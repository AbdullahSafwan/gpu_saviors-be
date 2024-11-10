import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginSecurity, { rules } from "eslint-plugin-security";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [pluginSecurity.configs.recommended],
    rules:{
      "no-unused-vars": ["warn"]
    }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
