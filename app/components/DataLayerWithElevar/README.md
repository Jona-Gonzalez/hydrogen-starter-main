# Elevar 3.9.0+ Set Up

## Elevar Non-Shopify Subdomains Set Up

1. On the last step for "Non-Shopify Subdomains" setup, the script is provided. Ensure this step is marked complete.
2. For quickest setup, copy the signing key from the url within the `fetch()` call in the script (the serires of characters between "configs/" and "/config.json"), and add as env var `PUBLIC_ELEVAR_SIGNING_KEY`; or simply, hardcode the signing key, if easier.

---

## Data Layer Events Set Up

1. Ensure `<DataLayerWithElevar />` is being returned instead in `Storefront.jsx`
2. Ensure all data layer actions are being triggered across the codebase; see `README.md` under `/hooks/datalayer/actions` for placement instructions. NOTE: Latest Starter skit will have already placed these
3. Add `PUBLIC_SITE_TITLE` as an env variable

---

## Debugging

- Turn on Elevar's console debugger by entering this into your browser's console: `window.ElevarDebugMode(true)`
- Turn off with `window.ElevarDebugMode(false)`
- To test events oustide Elevar's debugger, set `DEBUG` to `true` in `DataLayerWithElevar.jsx`. These will log regardless if the event passes with Elevar