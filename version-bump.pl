#!/usr/bin/perl

use strict;
use warnings;

my @VER=<>;
my $VERSION=$VER[0];
$VERSION =~ s/^\s+|\s+$//g;


bumpfile("Dockerfile","version=.+","version=\"$VERSION\"");
bumpfile("Janus/package.json","\"version\":.+","\"version\": \"$VERSION\",");
bumpfile("Janus/app.js","VERSION\\s*=\\s*\".+\"","VERSION = \"$VERSION\"");
bumpfile("docs/conf.py","release = u.+","release = u\'$VERSION\'");
bumpfile("client/package.json", "\"version\":.+", "\"version\": \"$VERSION\",");
bumpfile("run-docker.sh","rgwch/webelexis:.+","rgwch/webelexis:$VERSION");

sub bumpfile{
    open(FILE, "<$_[0]") || die "cant open $_[0], $!";
    my @lines = <FILE>;
    close(FILE);

    open(BACKUP, ">$_[0].bak") || die ("can't create $_[0].bak $!");
    print BACKUP @lines;
    close(BACKUP);

    foreach (@lines) {
        s/$_[1]/$_[2]/; # do the replacement
    }

    open(FILE, ">$_[0]") || die "can't write $_[0], $!";
    print FILE @lines;
    close(FILE);
}