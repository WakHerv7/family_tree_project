# Generated by Django 4.1.3 on 2022-11-28 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_individu'),
    ]

    operations = [
        migrations.AlterField(
            model_name='individu',
            name='spouses',
            field=models.ManyToManyField(blank=True, to='main.individu'),
        ),
    ]
