from django import forms

from apps.book.models import BookCompletedSummary


class BookCompletedSummaryForm(forms.ModelForm):
    class Meta:
        model = BookCompletedSummary
        fields = ["score", "comment", "type"]
