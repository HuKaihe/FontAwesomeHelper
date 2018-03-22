const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('./demo/template.html').toString();
const $ = cheerio.load(html);

const result = [];

$('.container div .mainParts').each((index, el) => {
  const code = $(el).attr('id');
  const title = $(el).find('.page-header').text().toString();
  const iconClassNames = [];

  $(el).find('.fa').each((i, item) => {
    const classNames = $(item).attr('class');
    const classNameArr = classNames.split(' ');
    const className = classNameArr[1];
    if (iconClassNames.indexOf(className) === -1) {
      iconClassNames.push(className);
    }
  });

  result.push({
    code,
    title,
    iconClassNames,
  });
});


fs.writeFileSync('./src/iconSourceData.json', JSON.stringify(result));
