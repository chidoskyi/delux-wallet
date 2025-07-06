from django.core.management.base import BaseCommand
from backend.models import Account

class Command(BaseCommand):
    help = 'Update all account balances from blockchain'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force update even if recently updated',
        )
        parser.add_argument(
            '--symbol',
            type=str,
            help='Update only specific cryptocurrency symbol',
        )

    def handle(self, *args, **options):
        query = Account.objects.filter(is_active=True)
        
        if options['symbol']:
            query = query.filter(cryptocurrency__symbol=options['symbol'])
        
        accounts = query.all()
        
        self.stdout.write(f"Updating {len(accounts)} accounts...")
        
        updated = 0
        failed = 0
        
        for account in accounts:
            try:
                account.update_balance_from_blockchain(force=options['force'])
                updated += 1
                self.stdout.write(f"✓ {account.cryptocurrency.symbol}: {account.balance}")
            except Exception as e:
                failed += 1
                self.stdout.write(f"✗ {account.cryptocurrency.symbol}: {str(e)}")
        
        self.stdout.write(
            self.style.SUCCESS(f"Complete: {updated} updated, {failed} failed")
        )