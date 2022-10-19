const axios = require('axios');
const { Sportyconfig } = require('./config')
const {  Match, Error } = require('./commonFunction')
var GamesFromSporty = []


const ChangeTime = (time) => {
  
  let arr = time.split(":")
  let seconds = Number(arr[1]) / 100
  let minutes = Number(arr[0])
  let TimeInSeconds = Math.round(( minutes + seconds ) * 60)

  
   return TimeInSeconds
}

const ReAssignData = (FootballData) => {
  //Re-assigning and Re-arranging Data

  GamesFromSporty = []

   FootballData.forEach( (game) => {
    game.events.forEach(match => {
      if (match.sport.category.name != 'Simulated Reality League') {
        let homeTeam = match.homeTeamName
        let awayTeam = match.awayTeamName
        let score = match.setScore
        let time = ChangeTime(match.playedSeconds)
        let half
        match.matchStatus == 'H1' ?  half = 1 :  half = 2 
        let odds = {
          home: Number(match.markets[0].outcomes[0].odds),
          draw: Number(match.markets[0].outcomes[1].odds),
          away: Number(match.markets[0].outcomes[2].odds)
        }
        let kickOff = match.estimateStartTime
        let country = match.sport.category.name
        let league = `${country}. ${match.sport.category.tournament.name}`
        let link = `https://www.sportybet.com/ng/sport/football/live/${match.sport.category.id}/${match.sport.category.tournament.id}/${match.eventId}`
        let info = new Match(homeTeam,awayTeam,time,odds,half,score,league,kickOff,country,link)
        // console.log(league);
        GamesFromSporty.push(info)
      }


    });
  });
}

const Sporty = async() => {
  await axios(Sportyconfig)
  .then( function (response) {
    
    // console.log(JSON.stringify(response.data));
    console.log('Number of games recieved',response.data.data.length)
    ReAssignData(response.data.data)
  
  
  })
  .catch(function (err) {
    Error(err,'SportyError','Sporty Main Function Catch Error')

  });

  return GamesFromSporty

}


module.exports = {
  Sporty
}






