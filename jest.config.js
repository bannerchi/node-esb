const coverage = process.env.TEST_COVERAGE

let now = new Date().getTime()

module.exports = {
    verbose: true,
    testMatch:  [`**/test/(*.)(spec|test).js`],
    collectCoverage: coverage !== undefined,
    collectCoverageFrom: [`**/src/lib/*.js`],
    coverageDirectory: `./test/coverage/${now}/`
}