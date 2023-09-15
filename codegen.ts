import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/**/*.ts",
  generates: {
    "src/graphql/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
