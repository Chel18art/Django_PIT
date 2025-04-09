from django import forms
from .models import Item, Category

class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['name', 'category', 'price', 'description']

    category = forms.ModelChoiceField(queryset=Category.objects.all(), required=True)
