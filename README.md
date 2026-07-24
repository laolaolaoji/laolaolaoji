# LTX Homepage

An Astro-generated static developer homepage with an editorial visual direction.

## Local development

```sh
npm install
npm run dev
```

## Verification

```sh
npm test
```

This builds `dist/` and verifies the homepage metadata, responsive CSS contract,
social links, semantic footer, ICP registration link, and deployment packaging.

## Deployment

- GitHub Pages deploys `dist/` through `.github/workflows/deploy.yml` after a
  push to `master`.
- `build.sh` builds and uploads the same `dist/` files to the configured nginx
  host. Running it performs a real remote deployment.
