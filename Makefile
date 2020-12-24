.PHONY: clean transpile minify build deploy

# remove minified js
clean:
	rm -f index-min.js

# minify index.js to index-min.js
# which is what is referenced in index.html
minify:
	./node_modules/.bin/minify index.js -o index-min.js

# remove old minified JS and minify latest JS
build: clean minify

# sync to S3
# ignore files we don't need stored in S3
deploy: build
	aws s3 sync . s3://opossumblea.ch \
		--exclude "README.md" \
		--exclude "index.js" \
		--exclude "index-transpiled.js" \
		--exclude "package.json" \
		--exclude "package-lock.json" \
		--exclude "node_modules/*" \
		--exclude ".git/*" \
		--exclude ".gitignore" \
		--exclude "Makefile" 
