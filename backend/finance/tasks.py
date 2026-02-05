from celery import shared_task
from .models import Statement, Transaction
from .services import GeminiProcessor
import os
from django.conf import settings

@shared_task
def process_statement_task(statement_id):
    try:
        statement = Statement.objects.get(id=statement_id)
        statement.status = 'processing'
        statement.save()

        file_path = os.path.join(settings.MEDIA_ROOT, str(statement.file))

        processor = GeminiProcessor()
        transactions_data = processor.process_statement(file_path)

        for item in transactions_data:
            Transaction.objects.create(
                user=statement.user,
                statement=statement,
                description=item.get('description', 'Sem descrição'),
                amount=item.get('amount', 0),
                date=item.get('date'),
                category=item.get('category', 'Outros'),
                raw_ai_data=item
            )

        statement.status = 'done'
        statement.save()

    except Statement.DoesNotExist:
        return f"Statement {statement_id} não encontrado."
    
    except Exception as e:
        if 'statement' in locals():
            statement.status = 'error'
            statement.error_log = str(e)
            statement.save()
        return f"Erro ao processar statement {statement_id}: {e}"
