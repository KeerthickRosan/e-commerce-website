from django.db import models


class Wishlist(models.Model):
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField('products.Product', related_name='wishlisted_by', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist of {self.user.username}"
