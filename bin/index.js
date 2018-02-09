const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('./demo/template.html').toString();
const $ = cheerio.load(html);

const faCLassNameArray = [];

$('.fa').each((index, el) => {
  const classNames = $(el).attr('class');
  const classNameArr = classNames.split(' ');
  const className = classNameArr[1];
  if (faCLassNameArray.indexOf(`"${className}"`) === -1) {
    faCLassNameArray.push(`"${className}"`);
  }
});

fs.writeFileSync('./src/iconClass.json', `[${faCLassNameArray}]`);
