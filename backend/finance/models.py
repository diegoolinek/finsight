from django.db import models
from django.contrib.auth.models import User

class Statement(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('done', 'Concluído'),
        ('error', 'Erro'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='statements/%Y/%m/')
    month = models.IntegerField(help_text="Mês de referência (1-12)")
    year = models.IntegerField(help_text="Ano de referência")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Campo para guardar erros ou feedback da IA se falhar
    error_log = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.month}/{self.year}"

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    statement = models.ForeignKey(Statement, on_delete=models.CASCADE, related_name='transactions', null=True, blank=True)
    
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    category = models.CharField(max_length=100, default="Outros")
    
    # Armazena os dados crus que a IA retornou, para debug futuro
    raw_ai_data = models.JSONField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - R$ {self.amount}"
