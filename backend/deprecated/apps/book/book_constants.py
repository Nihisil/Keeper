"""
Один авторский лист == 22 страниц в книге.
"""

BOOK_GOODREADS = 0
BOOK_FANTLAB = 1
BOOK_LIBRARYTHING = 2

BOOK_IDENTIFIERS = [
    [BOOK_GOODREADS, "Goodreads"],
    [BOOK_FANTLAB, "Fantlab"],
    [BOOK_LIBRARYTHING, "Librarything"],
]

AUTHOR_GOODREADS = 0
AUTHOR_FANTLAB = 1
AUTHOR_LIBRARYTHING = 2
AUTHOR_TODAY = 4

AUTHOR_IDENTIFIERS = [
    [AUTHOR_GOODREADS, "Goodreads"],
    [AUTHOR_FANTLAB, "Fantlab"],
    [AUTHOR_LIBRARYTHING, "Librarything"],
    [AUTHOR_TODAY, "Author Today"],
]

EBOOK = 0
AUDIO = 1
PAPER = 2
BOOK_TYPES = [[EBOOK, "ebook"], [AUDIO, "audio"], [PAPER, "paper"]]

STARTED = 1
COMPLETED = 2
DROPPED = 3

BOOKS_STATUSES = [[STARTED, "Started"], [COMPLETED, "Completed"], [DROPPED, "Dropped"]]
