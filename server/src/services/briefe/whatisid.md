'briefe' are outgoing documents.

A 'brief' is usually created from a template and payload data merged with that template. In Elexis, 'briefe' are stored
in two parts: The metadata in the table 'briefe', and the contents in the table 'heap' with the same id as the metadata.
In Webelexis, we make use of the existing field 'path' in the metadata and store the contents not in the database but with lucinda, solr or just within the file system (depending on the configuration).
