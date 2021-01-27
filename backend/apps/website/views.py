from apps.book.views import books_list


def home(request):
    return books_list(request)
