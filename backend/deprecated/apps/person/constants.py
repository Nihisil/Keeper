PERSON_IDENTIFIER_GOODREADS = "goodreads"
PERSON_IDENTIFIER_FANTLAB = "fantlab"
PERSON_IDENTIFIER_LIBRARYTHING = "librarything"
PERSON_IDENTIFIER_AUTHOR_TODAY = "author_today"

PERSON_EXTERNAL_IDENTIFIERS = [
    [PERSON_IDENTIFIER_GOODREADS, "Goodreads"],
    [PERSON_IDENTIFIER_FANTLAB, "Fantlab"],
    [PERSON_IDENTIFIER_LIBRARYTHING, "Librarything"],
    [PERSON_IDENTIFIER_AUTHOR_TODAY, "Author Today"],
]

PERSON_EXTERNAL_IDENTIFIERS_URLS = {
    PERSON_IDENTIFIER_GOODREADS: "https://www.goodreads.com/author/show/{id}/",
    PERSON_IDENTIFIER_LIBRARYTHING: "https://www.librarything.com/author/{id}/",
    PERSON_IDENTIFIER_FANTLAB: "https://fantlab.ru/author{id}/",
    PERSON_IDENTIFIER_AUTHOR_TODAY: "https://author.today/u/{id}/",
}
