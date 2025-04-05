import { renderToString } from 'react-dom/server';
import createCache from '@emotion/cache';
import { extractCritical } from '@emotion/server';
import { OpenSansFontLink } from '../constants';
import { PaperTemplateLayout } from '../components/PaperTemplateLayout';

export const renderSSR = (children: React.ReactNode) => {


  const renderedHtml = renderToString(
    <PaperTemplateLayout>{children}</PaperTemplateLayout>
  );
  const extractedHtml = extractCritical(renderedHtml);
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Invoice</title>
    ${OpenSansFontLink}
    <style data-emotion="${key} ${extractedHtml.ids.join(' ')}">${extractedHtml.css
    }</style>
</head>
<body>
    <div id="root">${extractedHtml.html}</div>
</body>
</html>`;
};
