module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/cdk.out/"],
  collectCoverageFrom: [
    "lib/resolvers/**/*.js",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/cdk.out/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
};
