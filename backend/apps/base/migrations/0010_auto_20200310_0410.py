# Generated by Django 3.0.3 on 2020-03-10 04:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_tag_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='slug',
            field=models.SlugField(unique=True),
        ),
    ]
