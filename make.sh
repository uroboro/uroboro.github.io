#!/bin/sh

./dpkg-scanpackages -m repo/ /dev/null > repo/Packages
cp repo/Packages{,_}
bzip2 repo/Packages_
mv repo/Packages{_,}.bz2
size=`wc -c repo/Packages | sed 's/[[:space:]].*//'`
size2=`wc -c repo/Packages.bz2 | sed 's/[[:space:]].*//'`
cp Release repo/Release
echo MD5SUM: >> repo/Release
md5sum repo/Packages | sed "s/  / $size /" >> repo/Release
md5sum repo/Packages.bz2 | sed "s/  / $size2 /" >> repo/Release
echo SHA1: >> repo/Release
sha1sum repo/Packages | sed "s/  / $size /" >> repo/Release
sha1sum repo/Packages.bz2 | sed "s/  / $size2 /" >> repo/Release
echo SHA256: >> repo/Release
sha256sum repo/Packages | sed "s/  / $size /" >> repo/Release
sha256sum repo/Packages.bz2 | sed "s/  / $size2 /" >> repo/Release
