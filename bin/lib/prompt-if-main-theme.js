const chalk = require('chalk')
const Confirm = require('prompt-confirm')
const ShopifyApi = require('shopify-api-node')
require('dotenv').config()

let mainThemeId

/**
 * Fetch the main theme ID from Shopify
 *
 * @return        Promise Reason for abort or the main theme ID
 */
function fetchMainThemeId(shopify) {
  return new Promise((resolve, reject) => {
    shopify.theme.list()
      .then(themes => {
        const liveTheme = themes.find(t => t.role === "main");
        if(liveTheme) resolve(liveTheme.id)
        else reject('No main theme???')
      })
      .catch(reject);
  })
}

/**
 * Prompt the user to confirm if they are about to deploy to the main theme
 *
 * @return        Promise Reason for abort or empty resolve
 */
function promptIfMainTheme() {
  return new Promise(async (resolve, reject) => {
    const {
      SHOPIFY_API_KEY,
      SHOPIFY_API_PASSWORD,
      SHOPIFY_STORE,
      THEME_ID
    } = process.env;
    
    if (!SHOPIFY_API_KEY) {
      console.log(chalk.yellow(`The .env file does not specify an "SHOPIFY_API_KEY".`))
      resolve()
      return
    }

    const shopify = new ShopifyApi({
      shopName: SHOPIFY_STORE,
      apiKey: SHOPIFY_API_KEY,
      password: SHOPIFY_API_PASSWORD,
      autoLimit: true
    });

    try {
      const mainThemeId = await fetchMainThemeId(shopify);
        
      // c.theme_id is live or equal to mainThemeId
      if (THEME_ID === 'live' || mainThemeId === THEME_ID) {
        const question = 'You are about to deploy to the main theme. Continue?'
        const prompt = new Confirm(question);
        prompt.run().then(isYes => {
          if (isYes) {
            resolve()
            return
          }

          reject('Aborting. You aborted the deploy.')
        })

        return
      }
    } catch(err) { reject(err) } 

  })
}

module.exports = promptIfMainTheme
