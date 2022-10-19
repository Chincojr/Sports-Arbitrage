const fs = require('fs')


class Match {
  constructor (homeTeam, awayTeam, time,odds,half,score,league,kickOff,country,link) {
    this.homeTeam = homeTeam
    this.awayTeam = awayTeam
    this.league = league
    this.kickOff = kickOff
    this.country = country
    this.link = link
    this.details = {
      half,
      time,
      score,
      odds
    }

  }
}



const Error = (err, file, description) => {

  let date = new Date();
  
  
  fs.appendFile(`./Errors/${file}`, `\r\n\n${date} \n\tError type ${description}\n\t\t${err}`, (err) => {
      if(err) console.log(err)
  })
  
}

module.exports = {
    Match,
    Error
}