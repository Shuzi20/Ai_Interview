import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')

        # Password validation
        if len(password) < 8 or len(password) > 16:
            return Response({"error": "Password must be 8–16 characters long."}, status=400)

        if not re.search(r'[A-Z]', password):
            return Response({"error": "Password must include at least one uppercase letter."}, status=400)

        if not re.search(r'[a-z]', password):
            return Response({"error": "Password must include at least one lowercase letter."}, status=400)

        if not re.search(r'\d', password):
            return Response({"error": "Password must include at least one digit."}, status=400)

        if not re.search(r'[^A-Za-z0-9]', password):
            return Response({"error": "Password must include at least one special character."}, status=400)

        if User.objects.filter(username=email).exists():
            return Response({"error": "User already exists."}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        return Response({"message": "User registered successfully"}, status=201)
