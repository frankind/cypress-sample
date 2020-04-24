/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-dev-shm-usage')
      return launchOptions
    }
    return launchOptions
  })
  const cypressEslint = require('cypress-eslint-preprocessor')
  on('file:preprocessor', cypressEslint())

  const file = config.env.configFile || 'beta'
  let configFromFile = getConfigurationByFile(file)

  const webpack = require('@cypress/webpack-preprocessor')
  const options = {
    webpackOptions: require('../../webpack.config'),
    watchOptions: {}
  }

  const fs = require('fs')
  on('after:screenshot', (details) => {
    // name to use in real file
    const fullPath = details.path
    const f1 = fullPath.indexOf('/')
    const l1 = fullPath.lastIndexOf('/') + 1
    let cPath = fullPath.substring(f1, l1)
    const fileName = fullPath.substring(l1, fullPath.length)
    const endFileName = ' (failed).png'
    let desireName = cutFileName(fileName)
    // Found screenshot fail when it too long file name so just trim it out and add more signature
    desireName = desireName.replace(/[:/=]/g, '')
    const indexFailed = desireName.lastIndexOf(endFileName)
    if (indexFailed !== -1) {
      desireName = desireName.substring(0, indexFailed)
    }

    if (desireName.length > 51) {
      desireName = desireName.substring(0, 50)
    }
    desireName = desireName.concat(endFileName)
    const newPath = cPath + desireName

    return new Promise((resolve, reject) => {
      fs.rename(fullPath, newPath, (err) => {
        if (err) return reject(err)
        // because we renamed/moved the image, resolve with the new path
        // so it is accurate in the test results
        resolve({ path: newPath })
      })
    })
  })

  on('file:preprocessor', webpack(options))
  return configFromFile
}

function getConfigurationByFile(file) {
  const fs = require('fs-extra')
  const path = require('path')
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`)
  return fs.readJson(pathToConfigFile)
}

function cutFileName(fileName) {
  let result
  const endFileName = ' (failed).png'
  // Example name:
  // Order widget management End to End -- Able to finalize order -- Discount 0.01 and product [ATEC_Brenden Ryan20191209144957] -- 01 should be able to finalize one product without variant with discount -- after each ho (failed)
  // Test Order widget management End to End -- 01 should be able to finalize one product without variant with discount -- before each hook Setup (failed)
  if (fileName.indexOf('-') !== -1) {
    // l2 will be used to check "before" or "after" if contain then do
    const l2 = fileName.lastIndexOf('-') + 2
    result = fileName.substring(l2, fileName.length)
    // Check if found hook before or after then use the prior name section
    if (result.startsWith('before') || result.startsWith('after')) {
      const l3 = l2 - 4
      result = fileName.substring(0, l3).concat(endFileName)
      const l4 = result.lastIndexOf('-') + 2
      result = result.substring(l4, result.length)
    }
  } else {
    result = fileName
  }
  return result
}