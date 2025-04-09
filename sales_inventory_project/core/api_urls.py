from django.urls import path
from . import api_views

urlpatterns = [
    path('login/', api_views.LoginAPI.as_view(), name='api_login'),
    path('items/', api_views.ItemListAPI.as_view(), name='api_items'),
    path('cart/add/', api_views.AddToCartAPI.as_view(), name='api_cart_add'),
    path('cart/', api_views.ViewCartAPI.as_view(), name='api_cart'),
    path('checkout/', api_views.CheckoutAPI.as_view(), name='api_checkout'),
]
