const { performance } = require('perf_hooks');
const { Error } = require('./commonFunction')
var noOfArbsOpp = 0



const CheckForError = (maxHome,maxDraw,maxAway,arbitrageOddsSum) => {
    let betsObjArray = [maxHome,maxDraw,maxAway]

    betsObjArray.forEach(bet => {
        if (bet.site == '1xbet' && bet.bet < 30 ) {
            bet.bet = 30
        }

        if ( bet.site == 'Sporty' && bet.bet < 10  ) {
            bet.bet = 10
        }
    });

    return {
        maxHome:betsObjArray[0],
        maxDraw:betsObjArray[1],
        maxAway:betsObjArray[2]

    }


}

const GetMax = (firstOdd,secondOdd,baseLink,otherLink) => {
    let OddArray = [firstOdd, secondOdd]
    let max = Math.max(firstOdd,secondOdd)
    let index = OddArray.indexOf(max)
    let percent = Math.floor((1/max) * 100)

    if (index == 0) {
        return {
            OddLocation: 'baseTeam',
            site: 'Sporty',
            link: baseLink,
            max, 
            percent,
        }
    } else {
        return {
            OddLocation: 'otherTeam',
            site:'1xbet',
            link: otherLink,
            max, 
            percent,

        }
    }
}

const Mode = (numbers) => {

    var modes = [], count = [], i, number, maxIndex = 0;
 
    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }
 
    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }
 
    return modes;
}

const TextMatch = (firstTeam, secondTeam) => {

    let firstLength = firstTeam.length
    let secondLength = secondTeam.length

    let firstSubStrings = firstTeam.split(" ")
    let secondSubStrings = secondTeam.split(" ")
    

    let resultArray = []

    /* 
        check the length of both strings then match the shorter one to the longer one
    */


    if ( firstLength >= secondLength ) {
        var shorterTeamName = secondSubStrings
        var longerTeamName = firstTeam
        shorterTeamName.forEach(text => {
            let result = longerTeamName.match(text)
            // console.log(result);
            if(result != null )resultArray.push(result)
        }); 
    } else {
        var shorterTeamName = firstSubStrings
        var longerTeamName = secondTeam
        shorterTeamName.forEach(text => {
            let result = longerTeamName.match(text)
            // console.log(result);
            if(result != null )resultArray.push(result)
        });
    }


    let longerTeamNameLength = longerTeamName.split(" ")
    let comparePercent = Math.floor ( (resultArray.length / longerTeamNameLength.length ) * 100 )

    // console.log(firstComparePercent,secondComparePercent);
    // console.log(comparePercent);

    return comparePercent

}

const Compare = (baseObject, otherObject) => {
    const homeTeamMatchPercent = TextMatch(baseObject.homeTeam, otherObject.homeTeam)
    const awayTeamMatchPercent = TextMatch(baseObject.awayTeam, otherObject.awayTeam)
    const leagueMatchPercent = TextMatch(baseObject.league,otherObject.league)
    const kickOffMatchPercent = baseObject.kickOff == otherObject.kickOff ? 100 : 0
     
    const Percent = Math.floor( (homeTeamMatchPercent + awayTeamMatchPercent + leagueMatchPercent + kickOffMatchPercent) / 4 )

    return Percent
}

const CreateIndex = (dataArray) => {
    let SubStringIndex = {}
    let gameIndex = 0

    dataArray.forEach(game => {
        gameIndex++
        let homeTeamSubStrings = game.homeTeam.split(" ")
        let awayTeamSubStrings = game.awayTeam.split(" ")
        let SubStringArray = [...homeTeamSubStrings,...awayTeamSubStrings]

        SubStringArray.forEach(string => {
            if (SubStringIndex[string] == undefined){
                SubStringIndex[string] = [ gameIndex - 1]
            } else {
                SubStringIndex[string].push(gameIndex - 1)
            }
        });


        
    });

    return SubStringIndex
}

const MatchIndex = async(firstDB,secondDB) => {
    startTime = performance.now ()
    console.log('StartIndexing');
    console.log(firstDB.length,secondDB.length);


    if (firstDB == undefined || secondDB == undefined) {
        console.log(firstDB,secondDB);
        console.log('error one of the db is undefined');
        // return 'error'
    } else {

    // Determine which DB is bigger and assign accurately create Index of BiggerDB
    if (firstDB.length >= secondDB.length) {
        var biggerDBIndex = CreateIndex(firstDB)
        var smallerDB = secondDB
        var IndexedDB = firstDB
    } else {
        var biggerDBIndex = CreateIndex(secondDB)
        var smallerDB = firstDB
        var IndexedDB = secondDB
    }

    let matched = []
    
    
    // take the smaller DB and compare each homeTeam and awayTeam substring with the Index of the BiggerDB
    smallerDB.forEach( game => {

        let homeTeamSubStrings = game.homeTeam.split(" ")
        let awayTeamSubStrings = game.awayTeam.split(" ")
        let SubStringArray = [...homeTeamSubStrings,...awayTeamSubStrings]
        let allMatchedIndexes = []
    

        // compare the substring of the home and away Team with the Index of the biggerTeam and return the Index of the right match to allMatchedIndexes
        SubStringArray.forEach(string => {
                if (biggerDBIndex[string] != undefined) {
                    // if there is a text that matches with that of the string
                    let IndexArray = biggerDBIndex[[string]]
                    allMatchedIndexes = [...allMatchedIndexes, ...IndexArray]
                }
        });


        // Take the mode of all the matched indexes which are in allMatchedIndexes array
        allMatchedIndexes =  Mode(allMatchedIndexes) 


        // if the mode of all the matched Indexes is one particular get the object from the bigger DB then push it and the base Object into the matched array 
        if (allMatchedIndexes.length == 1 ) {
            let index = allMatchedIndexes[0]
            // console.log(game._id,SubStringArray,firstDB[index].homeTeam, firstDB[index].awayTeam,firstDB[index]._id);
        
            matched.push({
                baseTeam: game,
                otherTeam: IndexedDB[index]
            })

        } 
        // else if the mode array is greater than one get a compare percentage for each then take the highest percentage's index then get the object from the biggerDB then push it and the base object to the matched array
        else if (allMatchedIndexes.length > 1 ) {

            let matchedPercent = []
            allMatchedIndexes.forEach(index => {
                let Percent = Compare(game, firstDB[index])
                matchedPercent.push({
                    Percent,
                    index
                })
            });

            matchedPercent.sort(function(a, b){return a.Percent - b.Percent});


            let matchedIndex = matchedPercent[matchedPercent.length -1].index


            matched.push({
                baseTeam: game,
                otherTeam: IndexedDB[matchedIndex]
            })
        } else {
            console.log(game._id);
        }

    });



    // console.log(matched);

    console.log("number of matched indexes ",matched.length);
    
    console.log(firstDB.length, secondDB.length);

    return matched
    }

    
}

const CheckForArb = async(game) => {

    let baseTeamDetails = game.baseTeam.details
    let otherTeamDetails = game.otherTeam.details
    let baseLink = game.baseTeam.link
    let otherLink = game.otherTeam.link
    let timeDifference = Math.abs(baseTeamDetails.time - otherTeamDetails.time)


    if ( timeDifference <= 60  ) {
        let baseTeamOdds = baseTeamDetails.odds
        let otherTeamOdds = otherTeamDetails.odds
        let maxHome = GetMax(baseTeamOdds.home,otherTeamOdds.home,baseLink,otherLink)
        let maxDraw = GetMax(baseTeamOdds.draw,otherTeamOdds.draw,baseLink,otherLink)
        let maxAway = GetMax(baseTeamOdds.away,otherTeamOdds.away,baseLink,otherLink)

        // console.log(baseTeamOdds.home,otherTeamOdds.home,)
        // console.log(baseTeamOdds.draw,otherTeamOdds.draw,)
        // console.log(baseTeamOdds.away,otherTeamOdds.away,)

        var arbitrageOddsSum = maxHome.percent + maxDraw.percent + maxAway.percent


        if(arbitrageOddsSum <= 100 ) {
            console.log('arbitrage possible',arbitrageOddsSum);
            let profit = Math.floor ( ( (100/arbitrageOddsSum) * 100) - 100 )
            
            // if (profit > 30) {
                noOfArbsOpp++
                let HomeBet = Math.floor(( 100 * maxHome.percent ) / arbitrageOddsSum)
                let AwayBet = Math.floor(( 100 * maxAway.percent ) / arbitrageOddsSum)
                let DrawBet = 100 - ( HomeBet + AwayBet )
    
                maxHome.bet = HomeBet
                maxDraw.bet = DrawBet
                maxAway.bet = AwayBet
    
                
                let arbOdd = CheckForError(maxHome,maxDraw,maxAway,arbitrageOddsSum)

                Error({
                    arbitrageOddsSum,
                    profit,
                    maxHome: arbOdd.maxHome,
                    maxDraw: arbOdd.maxDraw,
                    maxAway: arbOdd.maxAway
                },'ArbOpp','ArbOpp found')
    
                return ({
                    arbitrageOddsSum,
                    profit,
                    maxHome: arbOdd.maxHome,
                    maxDraw: arbOdd.maxDraw,
                    maxAway: arbOdd.maxAway
                })
            // } else {
            //     return {
            //         info: 'arb possible but profit is small',
            //         profit,
            //     }
            // }
                

            

            
        } else {
            return({
                info:`less But no Arbitrage Opportunity`,
                arbitrageOddsSum,
                
            })
        }

    } else { 
        return({
            info: `More no Arbitrage Opportunity `,
            timeDifference,
            baseTime: baseTeamDetails.time,
            otherTeam: otherTeamDetails.time,

        }) 

    }

}

const Arbitrage = async (gameArray) => {


    // awaits check for all potential arbs opportunity and sends arb opp to DB
    await Promise.all( gameArray.map((game)=> {
        return CheckForArb(game)
    })) 
    .then(res => {
        // endTime = performance.now()
        console.log(res);
        console.log('Number of Arbs Opp in this search was ', noOfArbsOpp);
        // console.log(endTime - startTime);
        console.log('finished ');
    })




}

const MainArb = async(firstDB,secondDB) => {
    var startTime = performance.now()
    await MatchIndex(firstDB,secondDB)
        .then(async(res) => {
            await Arbitrage(res)
            var endTime = performance.now()
            console.log('ArbCheck took', endTime-startTime);
        })
}

module.exports = {
    MainArb
}

