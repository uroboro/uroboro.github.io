#!/bin/sh

main() {
	argc=$#
	argv=($@)
	for (( i = 0; i < $argc; i++ )); do
		echo "argv[$i] = ${argv[$i]}"
	done

	# Build Release, Packages and Packages.bz2
	cd repo
	make
	cd ..

	#git add repo;

}

main $0 $@
