# Generated by Django 3.0.3 on 2020-03-10 03:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0019_auto_20200310_0337'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shelfbookitem',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shelfs', to='book.Book'),
        ),
    ]
