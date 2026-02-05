from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Statement
from .tasks import process_statement_task

@receiver(post_save, sender=Statement)
def trigger_statement_processing(sender, instance, created, **kwargs):
    if created and instance.status == 'pending':
        process_statement_task.delay(instance.id)
