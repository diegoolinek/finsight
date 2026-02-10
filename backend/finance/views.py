from rest_framework import viewsets, permissions, parsers
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Transaction, Statement
from .serializers import TransactionSerializer, StatementSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .services_dashboard import DashboardService

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


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        operation_id='get_dashboard_summary',
        description='Retorna totais, gastos por categoria e um insight gerado por IA.',
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        service = DashboardService(user=request.user)
        data = service.get_financial_summary()
        return Response(data)
