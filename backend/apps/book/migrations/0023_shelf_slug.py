# Generated by Django 3.0.3 on 2020-03-10 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0022_book_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='shelf',
            name='slug',
            field=models.SlugField(default=1),
            preserve_default=False,
        ),
    ]
