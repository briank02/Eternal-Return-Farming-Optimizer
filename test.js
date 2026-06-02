const axios = require('axios');

(async () => {
  try {
    const l10nRes = await axios.get('https://open-api.bser.io/v1/l10n/English', {headers: {'x-api-key': 'y8yS4K2LyDarrfoVY8zrK9NOpELWZTteyYtOSBZ5'}});
    const txtRes = await axios.get(l10nRes.data.data.l10Path);
    const lines = txtRes.data.split('\n');
    let code;
    for (let line of lines) {
      if (line.includes('Maverick Runner')) {
        console.log('Found:', line.trim());
        code = line.split('"')[0].replace('Item/Name/', '');
        break;
      }
    }
    console.log('Code:', code);

    const armors = await axios.get('https://open-api.bser.io/v2/data/ItemArmor', {headers: {'x-api-key': 'y8yS4K2LyDarrfoVY8zrK9NOpELWZTteyYtOSBZ5'}});
    const mav = armors.data.data.find(a => a.code == parseInt(code));
    console.log(JSON.stringify(mav, null, 2));
  } catch (e) {
    console.error(e);
  }
})();
