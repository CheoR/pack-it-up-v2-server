import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  automock: true,
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/__test__/**/*.test.(ts|js)"],
  moduleNameMapper: {
    "src(.*)$": "<rootDir>/src/$1",
  },
};

// module.exports = {
//   globals: {
//     "ts-jest": {
//       tsConfig: "tsconfig.json",
//     },
//   },
//   moduleFileExtensions: ["ts", "js"],
//   transform: {
//     "^.+\\.(ts|tsx)$": "ts-jest",
//   },
//   testMatch: ["**/test/**/*.test.(ts|js)"],
//   testEnvironment: "node",
//   moduleNameMapper: {
//     "src(.*)$": "<rootDir>/src/$1",
//   },
// };

export default config;
