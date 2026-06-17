const fs = require('fs');
const path = require('path');

const dist = path.resolve('dist');
const indexPath = path.join(dist, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

html = html.replaceAll('src="/_expo/', 'src="./_expo/');

if (!html.includes('rel="manifest"')) {
  html = html.replace(
    '</head>',
    '    <link rel="manifest" href="./manifest.json" />\n    <meta name="theme-color" content="#0B766E" />\n    <link rel="apple-touch-icon" href="./medbot-icon.svg" />\n  </head>'
  );
}

fs.writeFileSync(indexPath, html);

console.log('Prepared offline web dist for portable HTTPS hosting.');
