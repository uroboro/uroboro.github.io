#!/bin/sh

all: Packages.bz2 Release

clean:
	@rm -rf Packages Packages.bz2 Release &> /dev/null

Packages:
	@./dpkg-scanpackages -m . /dev/null > Packages

Packages.bz2: Packages
	@cp $^ $^_
	@bzip2 $^_
	@mv $^_.bz2 $@

Release: Packages Packages.bz2
	$(eval SIZE1 := $(shell wc -c Packages | sed 's/[[:space:]].*//'))
	$(eval SIZE2 := $(shell wc -c Packages.bz2 | sed 's/[[:space:]].*//'))
	@cp release $@

	@echo MD5Sum: >> $@
	@echo " `md5sum Packages | sed "s/  / $(SIZE1) /"`" >> $@
	@echo " `md5sum Packages.bz2 | sed "s/  / $(SIZE2) /"`" >> $@

	@echo SHA1: >> $@
	@echo " `sha1sum Packages | sed "s/  / $(SIZE1) /"`" >> $@
	@echo " `sha1sum Packages.bz2 | sed "s/  / $(SIZE2) /"`" >> $@

	@echo SHA256: >> $@
	@echo " `sha256sum Packages | sed "s/  / $(SIZE1) /"`" >> $@
	@echo " `sha256sum Packages.bz2 | sed "s/  / $(SIZE2) /"`" >> $@
