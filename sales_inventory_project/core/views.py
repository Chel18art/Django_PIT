from django.shortcuts import render
from rest_framework.views import APIView
from .models import Item, Sale, Category, User, CartItem, SaleItem
from .decorators import admin_required
from .forms import ItemForm
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
import json
from .serializers import CategorySerializer
from rest_framework.decorators import api_view
from rest_framework import generics

@admin_required
def admin_dashboard(request):
    context = {
        'total_items': Item.objects.count(),
        'total_sales': Sale.objects.count(),
        'total_categories': Category.objects.count(),
        'total_users': User.objects.count()
    }
    return render(request, 'core/admin_dashboard.html', context)


def inventory_list(request):
    search_query = request.GET.get('search', '')
    if search_query:
        items = Item.objects.filter(name__icontains=search_query)
    else:
        items = Item.objects.all()
    return render(request, 'inventory_list.html', {'items': items})

def update_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    # Handle update logic here (form submission and save)
    return render(request, 'update_item.html', {'item': item})

def delete_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    item.delete()
    return HttpResponseRedirect(reverse('inventory_list'))

def stock_entry(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    # Handle stock entry logic here (update quantity)
    return render(request, 'stock_entry.html', {'item': item})

@admin_required
def add_item(request):
    if request.method == 'POST':
        form = ItemForm(request.POST)
        if form.is_valid():
            try:
                # Save the item to the database
                form.save()
                messages.success(request, 'Item added successfully.')
                return redirect('item-list')  # Or wherever you want to redirect
            except Exception as e:
                messages.error(request, f"Error adding item: {str(e)}")
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ItemForm()

    return render(request, 'add_item.html', {'form': form})

@admin_required
def sales_report(request):
    filter_by = request.GET.get('filter', 'today')
    now = timezone.now()

    if filter_by == 'week':
        start = now - timedelta(days=7)
    elif filter_by == 'month':
        start = now - timedelta(days=30)
    else:
        start = now.replace(hour=0, minute=0, second=0)

    sales = Sale.objects.filter(date__gte=start)
    return render(request, 'core/sales_report.html', {'sales': sales, 'filter': filter_by})

@admin_required


def manage_categories(request):
    if request.method == 'POST':
        category_name = request.POST['name']
        category = Category.objects.create(
            name=category_name,
            created_by=request.user  # Make sure to assign the logged-in user
        )
        return redirect('manage_categories')
    
    categories = Category.objects.all()
    return render(request, 'manage_categories.html', {'categories': categories})

@login_required
def delete_category(request, category_id):
    if request.method == 'POST':
        category = get_object_or_404(Category, id=category_id)
        category.delete()
    return redirect('manage_categories')

@admin_required
def manage_users(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = make_password(request.POST['password'])
        role = request.POST['role']
        User.objects.create(username=username, password=password, role=role)
    users = User.objects.all()
    return render(request, 'core/manage_users.html', {'users': users})
def logout_view(request):
    logout(request)
    return redirect('/')


@login_required
def add_to_cart(request, item_id):
    item = get_object_or_404(Item, pk=item_id)
    cart_item, created = CartItem.objects.get_or_create(user=request.user, item=item)
    if not created:
        cart_item.quantity += 1
    cart_item.save()
    return redirect('cashier_pos')

@login_required
def view_cart(request):
    cart_items = CartItem.objects.filter(user=request.user)
    total = sum(item.item.price * item.quantity for item in cart_items)
    return render(request, 'core/cart.html', {'cart_items': cart_items, 'total': total})

@login_required
def checkout(request):
    cart_items = CartItem.objects.filter(user=request.user)
    if cart_items:
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
    return render(request, 'core/checkout.html', {'sale': sale})

def login_page(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_superuser:
                # Redirect superuser to Django admin panel
                return redirect('/admin/')
            elif user.role == 'admin':  # Assuming `role` is a field in your user model
                return redirect('/admin_dashboard/')  # Admin-specific dashboard
            elif user.role == 'cashier':
                return redirect('/cashier_pos/')  # Cashier-specific POS
            else:
                messages.error(request, "Invalid credentials or role.")
                return redirect('/')  # Redirect back to login if not valid
        else:
            messages.error(request, "Invalid username or password.")
            return redirect('/')
    return render(request, 'login.html')


# In views.py (already correct, just confirming)
@login_required
def cashier_pos(request):
    items = Item.objects.all()
    return render(request, 'core/cashier_pos.html', {'items': items})


@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)

            # Make sure role exists in the user model
            return JsonResponse({
                'token': token.key,
                'role': user.role  # Make sure 'role' exists in your custom User model
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
        
@api_view(['POST'])
def create_category(request):
    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def perform_create(self, serializer):
        # Here, set 'created_by' to a default or the logged-in user
        # For example, you can get the user from the request if authenticated:
        user = self.request.user
        serializer.save(created_by=user.username if user.is_authenticated else 'Admin')
    
def category_list(request):
    categories = Category.objects.all()
    return render(request, 'categories/category_list.html', {'categories': categories})

class CategoryDeleteView(APIView):
    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

def delete_category(request, pk):
    if request.method == 'POST':
        category = get_object_or_404(Category, pk=pk)
        category.delete()
    return redirect('manage_categories')  