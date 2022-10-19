const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');


const LogInSporty = async (page) => {

    try {
      // enter phone number
      await page.type('input[placeholder="Mobile Number"]', '8167483340')
  
      //enter password
      await page.type('input[placeholder="Password"]', '6342oyo!')
  
      // submit log in 
      await page.keyboard.press('Enter');
  
      // wait for account balance to show
      await page.waitForXPath('/html/body/div/div[1]/div[1]/div/div[1]/div[1]/div[1]/div[1]/span',{
        visible: true
      })
  
      return 'Logged in'
    } catch (err) {
      // console.log(error, 'Login error');
      return (err,'Error while login in')
    }
  
  
  
  }
  
  const checkSportyBalance = async (url) => {
  
    const browser = await puppeteer.launch({
      headless: false,
      // slowMo: 100,
      defaultViewport: null, 
      args: ['--start-maximized']
  
    });
  
    try {
  
      const page = await browser.newPage();
      // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/36.0.1985.125 Safari/537.36')
      // await page.goto( url );
      await page.goto( 'https://www.sportybet.com/ng/sport/football/sr:category:1/sr:tournament:17/sr:match:34151901', {
        waitUntil: 'domcontentloaded'
      });
    
      // login to account
      await LogInSporty(page)
      // await page.screenshot({path: 'example.png'});
  
      
      // get the balance element
      const [ balanceXpath ] = await page.$x('//*[@id="j_balance"]')
    
      // get the innerText of the balance element
      const balanceText = await page.evaluate(name => name.innerText, balanceXpath);
      console.log(balanceText);
    
      // get balance number
      const balance = parseInt(balanceText.replace(/NGN/gi, ''))
      console.log(balance);
    
      await browser.close()
      return balance
    } catch (err) {
      console.log(err, 'Balance error');
      await browser.close()
    }
  
  
  
  }
  
  const NewSportBet = async (url,odd,bet) => {
    const StartTime = performance.now()
    const browser = await puppeteer.launch({
      // headless: false,
      slowMo: 200,
      defaultViewport: null, 
      args: ['--start-maximized']
  
    });
  
    try {
  
      const page = await browser.newPage();
    
      // await page.goto( url );
      await page.goto(url, {
        waitUntil: 'domcontentloaded'
      });
    
      // login into account
      await LogInSporty(page)
    
      // get odd element for home away draw
  
      const [ home ] = await page.$x('/html/body/div/div[2]/div[2]/div/div[1]/div/div/div/section/div[2]/div[1]/div[2]/div/div[1]')
    
      const [ draw ] = await page.$x('/html/body/div/div[2]/div[2]/div/div[1]/div/div/div/section/div[2]/div[1]/div[2]/div/div[2]')
    
      const [ away ] = await page.$x('/html/body/div/div[2]/div[2]/div/div[1]/div/div/div/section/div[2]/div[1]/div[2]/div/div[3]')
  
  
      // click on specific odd
      console.log(home,draw,away);

      // let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]);

      let state

      await page.evaluate
    
      switch (odd) {
        case "home":
          state = await page.evaluate(el => {
            el.getAttribute('class')
          }, home);
          console.log(state);
          // await home.click()
          break;
        case "draw":
          state = await page.evaluate(el => {
            el.getAttribute('class')
          }, home);
          console.log(state);
          // await draw.click()
          break;
        case "away":
          state = await page.evaluate(el => {
            el.getAttribute('class')
          }, home);
          console.log(state);
          // await away.click()
          break;
        default:
          break;
      }
  
  
      // // wait for ticket to show
      // await page.waitForSelector('input[placeholder="min. 10"]');
    
      // // enter amount to bet with
      // await page.click('input[placeholder="min. 10"]',{clickCount : 3 })
      // await page.type('input[placeholder="min. 10"]',bet)
    
      
      // // // click place bet
      // await page.evaluate(() => document.querySelector("#j_betslip > div.m-betslips > div:nth-child(2) > div > div.m-stake > div > div.m-btn-wrapper > button").click()); 
    
      // // // click confirm
      // await page.evaluate(() =>document.querySelector("#j_betslip > div.m-betslips > div:nth-child(2) > div > div.m-stake > div > div.m-comfirm-wrapper > div > div.m-btn-wrapper > button.af-button.af-button--primary").click())
    
      // //wait for success message
      // await page.waitForXPath(' /html/body/div[2]/div[2]/div/div/div',{
      //   visible: true
      // })
    
      
      // await page.waitForTimeout(30000)
      await page.screenshot({ path: 'sporty.png', fullPage: true })
      await browser.close();
      const MainEnd = performance.now()
      console.log(MainEnd - StartTime);
      return (
        'Sporty bet placed'
      )
    } catch (err) {
      console.log(err, 'new bet error');
      await browser.close()
      // return(err, 'new bet error')
    }
  
  
  }

let url = 'https://www.sportybet.com/ng/sport/football/live/sr:category:385/sr:tournament:772/sr:match:36054203'

NewSportBet(url,'draw','10')