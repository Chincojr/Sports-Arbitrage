
var Sportyconfig = {
    method: 'get',
    url: 'https://www.sportybet.com/api/ng/factsCenter/liveOrPrematchEvents?sportId=sr%3Asport%3A1&_t=1661824048392',
    headers: { 
      'Cookie': 'locale=en',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    }
};

var OnexbetConfig = {
  method: 'get',
  url: 'https://1xbet.ng/LiveFeed/Get1x2_VZip?count=1000&lng=en&mode=5&country=132&partner=159&noFilterBlockEvent=true',
  headers: { 
    'Cookie': 'auid=wjuO0GL2C64ElT10CNA/Ag=='
  },
};

module.exports = {
    Sportyconfig,
    OnexbetConfig
}