const { Onexbet } = require('./1xbetScrap')
const { Sporty } = require('./SportyScrap')
const { MainArb } = require('./arbitrageFunction')
const { performance } = require('perf_hooks');


const Main = async() => {
    const MainStart = performance.now()
    let OneXGames = await Onexbet()
    let SportyGames = await Sporty()

    await Promise.all([OneXGames,SportyGames])
        .then(async(res) => {
            let awaitTime = performance.now()
            console.log('Await time',awaitTime-MainStart);
            console.log(res.length);
            // console.log(res[0],res[1]);
            // console.log(res[0]);
            await MainArb(res[0],res[1])
        })

    const EndStart = performance.now();
    console.log('Main funtion took ', EndStart - MainStart);
}

Main()

