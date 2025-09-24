DEPLOYDIR=/

all: site

site: bib/*.bib blog/*.org pages/*.org lisp/*.el css/*.in html/*.html dl/*.* img/*.*
	-mkdir -p www
	cd lisp && WEBSITE_OUT_DIR=$(shell readlink -f www) BUILD_TYPE=full ./build.sh

clean:
        cd cv && $(MAKE) clean
        rm -rf www/*
        rm -rf blog/blog.org

.PHONY: all cv clean
