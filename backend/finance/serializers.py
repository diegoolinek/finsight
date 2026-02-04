from rest_framework import serializers
from .models import Transaction, Statement

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'description', 'amount', 'date', 'category', 'created_at']

class StatementSerializer(serializers.ModelSerializer):
    transactions_count = serializers.IntegerField(source='transactions.count', read_only=True)

    class Meta:
        model = Statement
        fields = ['id', 'month', 'year', 'file', 'status', 'transactions_count', 'created_at']
        read_only_fields = ['status', 'created_at']
    
    def validate_file(self, value):
        if not value.name.endswith(('.pdf', '.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Apenas arquivos PDF ou imagens são permitidos.")
        return value
