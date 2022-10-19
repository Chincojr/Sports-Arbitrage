const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const randomUseragent = require('random-useragent');





const LogIn1xbet = async(page) => {
    // Log in details
    const [ LogIn ] = await page.$x('/html/body/div[2]/div[1]/div[3]/div[2]/div/div')
    await LogIn.click()
    await page.type('#auth_id_email','akindeindedavid@gmail.com')
    await page.type('#auth-form-password','6342oyo!')
    // await page.evaluate(()=> document.querySelector("#remember_user").click())
    await page.keyboard.press('Enter');
}

const check1xBalance = async () => {
  
  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 100,
    defaultViewport: null, 
    args: ['--start-maximized']

  });

  try {

    const page = await browser.newPage();
    await page.goto('https://1xbet.ng')
    await page.goto('https://1xbet.ng/en/line/football/88637-england-premier-league/147347078-fulham-bournemouth', {
      waitUntil: 'networkidle2'
    })

    // wait for login and redirection
    await Promise.all([
      LogIn1xbet(page),
      page.waitForNavigation({waitUntil: 'networkidle2'})
    ]);

    // get balance
    await page.waitForSelector('#user-money > div > div > a > div > p')
    let balance1xElem = await page.$('#user-money > div > div > a > div > p')
    let balanceNum = await page.evaluate(el => el.textContent, balance1xElem)
    console.log(balanceNum);

    await browser.close()
  } catch (err) {
    console.log(err,'check1xBalance error');
    await browser.close()
  }
}


const New1xBet = async (url,odd,bet) => {
  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 100,
    defaultViewport: null, 
    args: ['--start-maximized']

  });

  try {
    const page = await browser.newPage();
    await page.goto('https://1xbet.ng')
    await page.goto(url, {
      waitUntil: 'networkidle2'
    })


    // wait for login and redirection
    await Promise.all([
      LogIn1xbet(page),
      page.waitForNavigation({waitUntil: 'networkidle2'})
    ]);

    // get balance
    await page.waitForSelector('#user-money > div > div > a > div > p')
    let balance1xElem = await page.$('#user-money > div > div > a > div > p')
    let balanceNum = await page.evaluate(el => el.textContent, balance1xElem)
    console.log(balanceNum);

    if (balanceNum) {
      //await all bets
      await page.waitForSelector('#allBetsTable > div > div:nth-child(1) > div > div.bets.betCols3 > div:nth-child(1) > span.bet_type',{
        visible: true
      })

      //click on odd

      switch (odd) {
        case "home":
          await page.evaluate(() => {
            document.querySelector("#allBetsTable > div > div:nth-child(1) > div > div.bets.betCols3 > div:nth-child(1) > span.bet_type").click()
          })
          break;
        case "draw":
          await page.evaluate(() => {
            document.querySelector("#allBetsTable > div > div:nth-child(1) > div > div.bets.betCols3 > div:nth-child(2) > span.bet_type").click()
          })
          break;
        case "away":
          await page.evaluate(() => {
            document.querySelector("#allBetsTable > div > div:nth-child(1) > div > div.bets.betCols3 > div:nth-child(3) > span.bet_type").click()
          })
          break;
        default:
          break;
      }




      //await amount element     
      await page.waitForSelector('input[ class="c-spinner__input bet_sum_input" ]',{
        // visible: true
      })

      //click the input element thrice
      await page.click('input[ class="c-spinner__input bet_sum_input"]',{clickCount: 3})

      //check if baseAmt is set
      const baseAmt = await page.$eval('input[ class="c-spinner__input bet_sum_input"]', el => el.value);
      console.log(baseAmt);

      //if the baseamt is present delete it 
      if (baseAmt == 500) {
        // delete the base amount
        for (let i = 0; i < baseAmt.length; i++) {
          await page.keyboard.press('Backspace');
        }

        // type in the bet
        await page.type('input[ class="c-spinner__input bet_sum_input"]', bet)
        
        // click place bet
        await page.click('button[class="c-btn c-btn--size-l c-btn--block c-btn--gradient c-btn--gradient-accent u-upcase coupon-action-btn"]')


        
      }



    }

    // await page.waitForTimeout(30000)

    // await page.screenshot({path: 'example.png'});
    await browser.close()
    return '1xbet placed'

  } catch (err) {
    console.log(err,'new1xbet error');
    await browser.close()
  }

}


const ReArrangeArb = async () => {
  let arbOpps = await GetFromDB('Arb-Opportunity','arbOpp')
  console.log(arbOpps);
  let OneXbet = 0
  let Sporty = 0
  arbOpps.forEach(arb => {
    arb.arbsOpp.maxHome.site == '1xbet' ? OneXbet += arb.arbsOpp.maxHome.bet : Sporty += arb.arbsOpp.maxHome.bet
    arb.arbsOpp.maxDraw.site == '1xbet' ? OneXbet += arb.arbsOpp.maxDraw.bet : Sporty += arb.arbsOpp.maxDraw.bet
    arb.arbsOpp.maxAway.site == '1xbet' ? OneXbet += arb.arbsOpp.maxAway.bet : Sporty += arb.arbsOpp.maxAway.bet
  });
  console.log(OneXbet,Sporty);
}

const Bet = async(obj,odd) => {
  if (obj.site == "1xbet") {
    await New1xBet(obj.link,odd,obj.bet)
  } else {
    await NewSportBet(obj.link,odd,obj.bet)
  }
}

const PlaceBet = async () => {
  let arbOpps = await GetFromDB('Arb-Opportunity','arbOpp')
  // console.log(arbOpps);
  let firstObj = arbOpps[11]

  firstObj.arbsOpp.maxHome.odd = 'home'
  firstObj.arbsOpp.maxDraw.odd = 'draw'
  firstObj.arbsOpp.maxAway.odd = 'away'
  console.log(firstObj);


  let firstArr = [
    firstObj.arbsOpp.maxHome,
    firstObj.arbsOpp.maxDraw,
    firstObj.arbsOpp.maxAway
  ]

  for (let i = 0; i < firstArr.length; i++) {
    
    let obj = firstArr[i]
    let bet = obj.bet.toString()
    console.log(bet);
    if (obj.site == '1xbet') {
      await New1xBet(obj.link,obj.odd,bet)
    } else {
      await NewSportBet(obj.link,obj.odd,bet)
    }
    
  }



  // console.log(homeBet,DrawBet,AwayBet);

    // await Promise.all(homeBet,DrawBet,AwayBet)
    //   .then(res => {
    //     console.log(res);
    //   })


}

PlaceBet()
// ReArrangeArb()
// New1xBet('https://1xbet.ng/en/live/football/118737-japan-j-league/404170074-yokohama-f-marinos-jubilo-iwata','home',30)
// NewSportBet('https://www.sportybet.com/ng/sport/football/live/sr:category:790/sr:tournament:19248/sr:match:34221897','home',10)
