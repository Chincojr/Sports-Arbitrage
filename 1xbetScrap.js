const axios = require('axios')
const { OnexbetConfig } = require('./config')
const { Match, Error } = require('./commonFunction')
var GamesFrom1X = []


const ConvertToSmall = (text) => {
  let smallText = text.replace('.', '').toLowerCase().split(' ').join('-')
  return smallText
}

const ReArrangeData = (odd) => {

    let odds = {
      home : "",
      draw: "",
      away: ""
    }
  
    odd.forEach(data => {
      if (data.T == 1) {
        odds.home = data.C
      }
  
      if (data.T == 2) {
        odds.draw = data.C
      }
  
      if (data.T == 3) {
        odds.away = data.C
      }
  
    });
  
    return odds
  
}

const FilterSport = (data) => {
  
    data.forEach(sport => {
        if (
          sport.SE == "Football" && 
          sport.SC.TS &&
          sport.LE != 'ShortStrike' &&
          sport.LE != 'KLASK' &&
          sport.LE != 'ACL Indoor' &&
          sport.LE != 'Division 4x4' &&
          sport.LE != 'USSR. 3x3. Division А' &&
          sport.LE != 'USSR. 3x3. Division B' &&
          sport.LE != 'Short Football 2x2' &&
          sport.LE != 'Dragon League 4х4. League A' &&
          sport.LE != 'Dragon League 4х4. League B' &&
          sport.LE != 'MLS 5x5' &&
          sport.LE != 'BudnesLiga LFL 5x5' &&
          sport.LE != 'FIFA 22. Cyber League' &&
          sport.LE != 'Table Soccer League' &&
          sport.LE != 'Веlarus. Short Football D1' &&
          sport.LE != 'Short Football 3x3 L2' &&
          sport.LE != 'Short Football 5x5 L1' &&
          sport.LE != 'Derby League' &&
          sport.LE != 'ShortStrike' &&
          sport.LE != 'RPL 6x6' &&
          sport.LE != 'APL 6x6' &&
          sport.LE != 'Soccer Box 2x2' &&
          sport.LE != 'Student League' &&
          sport.LE != 'Student League 2' &&
          sport.LE != 'Short Football 4x4' &&
          sport.LE != 'Dragon League 3х3' &&
          sport.LE != 'Division 4х4' &&
          sport.LE != 'Short Football 2x2 L2' &&
          sport.LE != 'Short Football 4x4 L2' &&
          sport.LE != 'Belarus. Regional League A' &&
          sport.LE != 'Belarus. Regional League. West' &&
          sport.LE != 'Regional League. North' &&
          sport.LE != 'Short Football 3x3' &&
          sport.LE != 'Afrique. Ligue Royale 1' &&
          sport.LE != 'Cameroon. CUF Cup' &&
          sport.LE != 'Short Football 5x5' &&
          sport.LE != '8x8. Premier League'
          ) {

            let data = sport
          let odd =  ReArrangeData(data.E)
          let homeTeam = data["O1"]
          let awayTeam = data["O2"]
          let time = data.SC.TS
          let half = data.SC.CP
          let score = `${data.SC.FS.S1 || 0 }:${data.SC.FS.S2 || 0}`
          let league = data.LE
          let kickOff = data.S * 1000
          let country = data.CN
          let homeSmall = ConvertToSmall(homeTeam)
          let leagueSmall = ConvertToSmall(league)
          let awaySmall = ConvertToSmall(awayTeam)
          let link = `https://1xbet.ng/en/live/football/${data.LI}-${leagueSmall}/${data.ZP}-${homeSmall}-${awaySmall}`
          let info = new Match(homeTeam,awayTeam,time,odd,half,score,league,kickOff,country,link)
           GamesFrom1X.push(info)
        }
    });
  
  
  
}



const Onexbet = async () => {

    await axios(OnexbetConfig)
        .then(async(response) => {
            await FilterSport(response.data.Value) // filter data 
            console.log(response.data.Value.length,'amount of games recieved');
            console.log(GamesFrom1X.length,'number of football Games');

        })
        .catch(err => {
            Error(err,'1xbetError','Error while requesting from 1xbet server')
        })

      
        return GamesFrom1X
        
}


module.exports = {
  Onexbet
}





