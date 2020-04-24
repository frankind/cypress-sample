// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './assertions'
import 'cypress-dark'
// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on('test:after:run', (test, runnable) => {
  // name to use in html file
  if (test.state === 'failed') {
    let testName = test.title
    // File name cannot be contain ':' then we should remove it first
    testName = testName.replace(/[:=/]/g, '')
    if (testName.length > 51) {
      testName = testName.substring(0, 50)
    }
    const screenshotFileName = `${testName} (failed).png`
    const addContext = require('mochawesome/addContext')
    addContext({ test }, `assets/${Cypress.spec.name}/${screenshotFileName}`)
  }
})
