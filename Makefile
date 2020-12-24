.PHONY: clean transpile minify build deploy

# remove transpiled and minified files
clean:
	rm -f index-transpiled.js index-min.js

# transpile index.js to index-transpiled.js
transpile:
	./node_modules/.bin/babel index.js -o index-transpiled.js

# minify index-transpiled.js to index-min.js
# which is what is referenced in index.html
minify:
	./node_modules/.bin/yuicompressor index-transpiled.js -o index-min.js

# transpile and minify JS
build: clean transpile minify

# sync to S3
# ignore files we don't need stored in S3
deploy: build
	aws s3 sync . s3://opossumblea.ch \
		--exclude "README.md" \
		--exclude "index.js" \
		--exclude "package.json" \
		--exclude "package-lock.json" \
		--exclude "node_modules/*" \
