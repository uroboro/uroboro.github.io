#!/bin/sh

MD5SUM := md5sum
SHA1SUM := sha1sum
SHA256SUM := sha256sum

all: Release
.PHONY: Packages Packages.bz2 Release

Release: Packages Packages.bz2
	$(eval SIZE1 := $(shell wc -c Packages | awk '{print $$1}'))
	$(eval SIZE2 := $(shell wc -c Packages.bz2 | awk '{print $$1}'))
	@cp Release_ $@

	@echo MD5Sum: >> $@
	@echo " `$(MD5SUM) Packages | sed "s/  / $(SIZE1) /"`" >> $@
	@echo " `$(MD5SUM) Packages.bz2 | sed "s/  / $(SIZE2) /"`" >> $@

	@echo SHA1: >> $@
	@echo " `$(SHA1SUM) Packages | sed "s/  / $(SIZE1) /"`" >> $@
	@echo " `$(SHA1SUM) Packages.bz2 | sed "s/  / $(SIZE2) /"`" >> $@

	@echo SHA256: >> $@
	@echo " `$(SHA256SUM) Packages | sed "s/  / $(SIZE1) /"`" >> $@
	@echo " `$(SHA256SUM) Packages.bz2 | sed "s/  / $(SIZE2) /"`" >> $@

Packages:
	@dpkg-scanpackages -m . /dev/null > Packages

Packages.bz2: Packages
	@bzip2 -fk $^

clean:
	@rm -rf Packages Packages.bz2 Release &> /dev/null
