from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Seed the database with sample categories and products for testing.'

    def handle(self, *args, **options):
        categories = {
            'Electronics': 'Phones, laptops, gadgets and accessories.',
            'Fashion': 'Clothing, footwear and accessories.',
            'Home & Kitchen': 'Furniture, decor and kitchen essentials.',
            'Books': 'Fiction, non-fiction and academic books.',
        }
        cat_objs = {}
        for name, desc in categories.items():
            cat, _ = Category.objects.get_or_create(name=name, defaults={'description': desc})
            cat_objs[name] = cat

        products = [
            ('Wireless Bluetooth Headphones', 'Electronics', 2499, 1999, 50, 'SoundMax'),
            ('Smartphone 128GB', 'Electronics', 18999, None, 30, 'Nova'),
            ('Laptop Backpack', 'Fashion', 1299, 999, 100, 'UrbanPack'),
            ('Men Running Shoes', 'Fashion', 2999, 2399, 60, 'Striker'),
            ('Non-Stick Cookware Set', 'Home & Kitchen', 3499, None, 40, 'HomeChef'),
            ('Study Desk Lamp', 'Home & Kitchen', 899, 699, 80, 'BrightLite'),
            ('The Pragmatic Programmer', 'Books', 799, None, 25, 'Addison-Wesley'),
            ('Atomic Habits', 'Books', 499, 399, 70, 'Penguin'),
        ]
        for name, cat_name, price, discount, stock, brand in products:
            Product.objects.get_or_create(
                name=name,
                defaults=dict(
                    category=cat_objs[cat_name], price=price, discount_price=discount,
                    stock=stock, brand=brand, description=f"High quality {name.lower()}.",
                )
            )

        self.stdout.write(self.style.SUCCESS('Seed data created successfully.'))
