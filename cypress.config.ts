const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
import { defineConfig } from 'cypress';

let assetList = [];
let assetTypeList = [];
let dynamicPropertyList = [];
let cookie = null;
let asset = null;
let assetType = null;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      config.env.URL = process.env.TURCK_URL
      config.env.USERNAME = process.env.TURCK_USERNAME
      config.env.PASSWORD = process.env.TURCK_PASSWORD
      config.env.LANGUAGE = process.env.LANGUAGE

      on("task", {
        getAssetList: () => {
          return assetList;
        },
        setAssetList: (val) => {
          assetList.push(val);
          return null;
        },
        clearAssetList: () => {
          assetList = [];
          return null;
        },
        getAssetTypeList: () => {
          return assetTypeList;
        },
        setAssetTypeList: (val) => {
          assetTypeList.push(val);
          return null;
        },
        clearAssetTypeList: () => {
          assetTypeList = [];
          return null;
        },
        setDynamicPropertyList: (val) => {
          dynamicPropertyList.push(val);
          return null;
        },
        getCookie: () => {
          return cookie;
        },
        setCookie: (val) => {
          cookie = val;
          return null;
        },
        getAssetType: () => {
          return assetType;
        },
        setAssetType: (val) => {
          assetType = val;
          return null;
        },
        getAsset: () => {
          return asset;
        },
        setAsset: (val) => {
          asset = val;
          return null;
        },

      });
      return config;
    },
    specPattern: ['cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'],
    viewportHeight: 1080,
    viewportWidth: 1920,
    screenshotOnRunFailure: true,
    video: true,
    chromeWebSecurity: false,
    supportFile: 'cypress/support/index.ts',
    retries: {
      // Configure retry attempts for `cypress run`
      runMode: 2,
      // Configure retry attempts for `cypress open`
      openMode: 0
    },
    baseUrl: process.env.TURCK_URL,
    reporter: 'cypress-qase-reporter',
    reporterOptions: {
      apiToken: process.env.QASE_TOKEN,
      projectCode: 'MTR',
      logging: true,
    },
  },
});
