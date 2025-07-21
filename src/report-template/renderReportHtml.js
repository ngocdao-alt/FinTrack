// report-template/renderReportHtml.ts
import ReactDOMServer from 'react-dom/server';
import Report from './Report';

export function renderReportHtml(data) {
  const html = ReactDOMServer.renderToStaticMarkup(<Report {...data} />);
  return `<!DOCTYPE html>${html}`;
}
