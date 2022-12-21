from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password1", "password2"]



class FamilyMemberForm(forms.Form):
    GENDERS = (('m', 'Male'), ('f', 'Female')) 
    def __init__(self, parent_males, parent_females, spouses, *args, **kwargs):
        super(FamilyMemberForm, self).__init__(*args, **kwargs)         
        self.fields['parent_male'].choices = parent_males 
        self.fields['parent_female'].choices = parent_females 
        self.fields['spouse'].choices = spouses 

    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'special', 'id':'name_input'}))
    # gender = forms.ChoiceField(required=False, choices=GENDERS, widget=forms.Select(attrs={'class': 'special', 'id':'gender_select'}))
    gender = forms.ChoiceField(choices=GENDERS, widget=forms.RadioSelect(attrs={'class': 'special', 'id':'gender_select'}))
    parent_male = forms.ChoiceField(required=False, widget=forms.Select(attrs={'class': 'special', 'id':'parent_male_select'}))
    parent_female = forms.ChoiceField(required=False, widget=forms.Select(attrs={'class': 'special', 'id':'parent_female_select'}))
    generation_level = forms.CharField(required=False, widget=forms.TextInput(attrs={'class': 'special', 'id': 'generation_level_input', 'autocomplete':'off'}))
    birth_rank = forms.CharField(required=False, widget=forms.TextInput(attrs={'class': 'special', 'id': 'birth_rank_input', 'autocomplete':'off'}))
    spouse = forms.MultipleChoiceField(
        required=False,
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'special', 'id':'spouses_select'}),
        
    )
