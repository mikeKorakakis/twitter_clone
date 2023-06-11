import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "http://localhost:4000/graphql",
	documents: "graphql/**/*.graphql",
	ignoreNoDocuments: true, // for better experience with the watcher
	generates: {
		"gql/": {
			preset: "client",
			config: {},
			plugins: [],
			presetConfig: {
				fragmentMasking: false, // HERE
			},
		},
	},
	// generates: {
	// 	"generated/graphql.ts": {
	// 		plugins: [
	// 			"typescript",
	// 			"typescript-operations",
	// 			"typescript-react-query",
	// 		],
	// 	},
	// },
	// config: {
	// 	fetcher: {
	// 		endpoint: "http://localhost:4000/graphql",
	// 		moduleName: "graphql-request",
	// 		functionName: "request",
	// 	},
	// },
};

export default config;
