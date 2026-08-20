// Minimal hash router. No page reloads - the app shell renders once, views swap below it.

let currentHandler = null;

const routes = [];

/** pattern like '/module/:id/lesson' */
export function route(pattern, handler) {
  const paramNames = [];
  const regex = new RegExp(
    '^' +
      pattern
        .split('/')
        .map((seg) => {
          if (seg.startsWith(':')) {
            paramNames.push(seg.slice(1));
            return '([^/]+)';
          }
          return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        })
        .join('/') +
      '$'
  );
  routes.push({ regex, paramNames, handler });
}

function parseHash() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  return { path: path || '/', params };
}

async function dispatch() {
  const { path, params } = parseHash();
  for (const r of routes) {
    const m = path.match(r.regex);
    if (m) {
      const routeParams = {};
      r.paramNames.forEach((name, i) => (routeParams[name] = decodeURIComponent(m[i + 1])));
      currentHandler = r.handler;
      await r.handler({ ...routeParams, query: params });
      window.scrollTo(0, 0); // every route starts at the top — footer links otherwise land mid-scroll
      return;
    }
  }
  console.warn('No route matched:', path);
}

export function navigate(path) {
  if (location.hash === `#${path}`) {
    dispatch();
  } else {
    location.hash = path;
  }
}

export function startRouter() {
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

export function currentPath() {
  return parseHash().path;
}
