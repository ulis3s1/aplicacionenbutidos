from django import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from app.models import *


class PedidoForm(ModelForm):
    class Meta:
        model = Pedido
        fields = ('empleado', 'cliente')