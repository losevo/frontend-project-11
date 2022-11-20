install:
		npm ci

publish:
		npm publish --dry-run

link:
		npm link

lint:
		npx eslint .

serve:
		npx webpack serve

old:
		rm -rf dist

new:
		NODE_ENV=production npx webpack