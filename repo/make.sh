#!/bin/sh

./dpkg-scanpackages -m . /dev/null > Packages
cp Packages{,_}
bzip2 Packages_
mv Packages{_,}.bz2

size=`wc -c Packages | sed 's/[[:space:]].*//'`
size2=`wc -c Packages.bz2 | sed 's/[[:space:]].*//'`
cp {r,R}elease

echo MD5SUM: >> Release
echo " `md5sum Packages | sed "s/  / $size /"`" >> Release
echo " `md5sum Packages.bz2 | sed "s/  / $size2 /"`" >> Release

echo SHA1: >> Release
echo " `sha1sum Packages | sed "s/  / $size /"`" >> Release
echo " `sha1sum Packages.bz2 | sed "s/  / $size2 /"`" >> Release

echo SHA256: >> Release
echo " `sha256sum Packages | sed "s/  / $size /"`" >> Release
echo " `sha256sum Packages.bz2 | sed "s/  / $size2 /"`" >> Release
