from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import Item, CartItem, Sale, SaleItem
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import authenticate


class LoginAPI(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            # Assume you're using a custom User model with a `role` field
            token = 'some_generated_token'  # Use a real token generator here
            return Response({'token': token, 'role': user.role})
        return Response({'error': 'Invalid credentials'}, status=400)

class ItemListAPI(APIView):
    def get(self, request):
        items = Item.objects.all().values('id', 'name', 'price', 'stock')
        return Response({'items': list(items)})

class AddToCartAPI(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_id = request.data['item_id']
        item = Item.objects.get(id=item_id)
        cart_item, created = CartItem.objects.get_or_create(user=request.user, item=item)
        if not created:
            cart_item.quantity += 1
        cart_item.save()
        return Response({'message': 'Item added to cart'})

class ViewCartAPI(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = CartItem.objects.filter(user=request.user)
        data = [{'item': c.item.name, 'price': c.item.price, 'quantity': c.quantity} for c in cart]
        total = sum(c.item.price * c.quantity for c in cart)
        return Response({'cart': data, 'total': total})

class CheckoutAPI(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        sale = Sale.objects.create(cashier=request.user)
        for cart_item in cart_items:
            SaleItem.objects.create(
                sale=sale,
                item=cart_item.item,
                quantity=cart_item.quantity,
                price=cart_item.item.price
            )
            cart_item.item.stock -= cart_item.quantity
            cart_item.item.save()
        cart_items.delete()
        return Response({'message': 'Checkout successful', 'sale_id': sale.id})
