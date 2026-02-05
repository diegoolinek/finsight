from rest_framework import viewsets, permissions, parsers
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Transaction, Statement
from .serializers import TransactionSerializer, StatementSerializer

class StatementViewSet(viewsets.ModelViewSet):
    serializer_class = StatementSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        return Statement.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        operation_id='upload_statement',
        description='Upload de extrato bancário (PDF ou Imagem) para processamento via IA',
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'file': {
                        'type': 'string',
                        'format': 'binary'
                    },
                    'month': {'type': 'integer'},
                    'year': {'type': 'integer'}
                },
                'required': ['file', 'month', 'year']
            }
        },
    )
    def create(self, request, *args, **kwargs):
        """Sobrescrevemos apenas para documentar o upload corretamente"""
        return super().create(request, *args, **kwargs)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')
