#!/usr/bin/python2.7
# Note that this script currently requires running with the HEAD version
# of https://github.com/c-w/Gutenberg
# Example run:
# cd utils/
# git clone https://github.com/c-w/Gutenberg.git
# mv Gutenberg/gutenberg ./
# ./generate_gutenberg_json.py > generate_gutenberg_json.py

from gutenberg.acquire import load_metadata, get_metadata_cache
from gutenberg._domain_model.exceptions import CacheAlreadyExistsException
from rdflib import URIRef, Namespace
from rdflib.namespace import RDF, DCTERMS
from json import dumps

def generate_gutenberg_json():
    """
    Uses the Gutenberg module to fetch and write out a subset of the
    Project Gutenberg metadata properties in JSON to standard out.
    Returns: nothing, output is to standard out
    """
    print "Populating Project Gutenberg RDF cache"
    print "If not already populated, this may take several hours..."
    try:
        cache = get_metadata_cache()
        cache.populate()
    except CacheAlreadyExistsException:
        pass  # Don't reload the cache if it already exists
    print "Cache populated, iterating over ebooks"
    g = load_metadata()
    PGTERMS = Namespace('http://www.gutenberg.org/2009/pgterms/')
    DCAM = Namespace('http://purl.org/dc/dcam/')
    # Needed since PGTERMS.format is taken
    PURLFORMAT = URIRef('http://purl.org/dc/terms/format')
    returns = []
    for ebook, unused, unused2 in g.triples((None, RDF.type, PGTERMS.ebook)):
        ret = {"_id": str(ebook).split("/")[-1]}
        try:
            ret["title"] = list(g.triples((ebook, DCTERMS.title, None)))[0][2].value
        except IndexError:
            # If there's no title, don't index this ebook
            continue
        try:
            ret["num_downloads"] = list(g.triples((ebook, PGTERMS.downloads, None)))[0][2].value
        except IndexError:
            # If there's no title, don't index this ebook
            continue
        ret["publisher"] = list(g.triples((ebook, DCTERMS.publisher, None)))[0][2].value
        try:
            creator = list(g.triples((ebook, DCTERMS.creator, None)))[0][2]
            ret["creator"] = list(g.triples((creator, PGTERMS.name, None)))[0][2].value
        except IndexError:
            pass
        subjects = list(g.triples((ebook, DCTERMS.subject, None)))
        subject_values = []
        for unused5, unused6, subject in subjects:
            # Use http://id.loc.gov/authorities/subjects.html
            # Library of Congress Subject Headings
            if list(g.triples((subject, DCAM.memberOf, None)))[0][2] == DCTERMS.LCSH:
                subject_values.append(
                    list(g.triples((subject, RDF.value, None)))[0][2].value
                )
        ret["subjects"] = subject_values
        try:
            bookshelf = list(g.triples((ebook, PGTERMS.bookshelf, None)))[0][2]
            bookshelf_value = unicode(list(g.triples((bookshelf, RDF.value, None)))[0][2])
            ret["bookshelf"] = bookshelf_value
        except IndexError:
            pass

        formats = list()
        for unused3, unused4, has_format in list(g.triples((ebook, DCTERMS.hasFormat, None))):
            extent = list(g.triples((has_format, DCTERMS.extent, None)))[0][2].value
            purl_format = list(g.triples((has_format, PURLFORMAT, None)))[0][2]
            purl_format_value = unicode(list(g.triples((purl_format, RDF.value, None)))[0][2])
            if "html" in purl_format_value or "epub" in purl_format_value:
                format = dict({"uri": has_format, "extent": extent, "media_type": purl_format_value})
                formats.append(format)
        ret["formats"] = formats
        returns.append(ret)
    print dumps(returns, indent=4)


if __name__ == '__main__':
    generate_gutenberg_json()
