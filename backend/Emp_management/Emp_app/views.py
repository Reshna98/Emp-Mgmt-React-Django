from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Employee, CustomUser
from .serializers import EmployeeSerializer, CustomUserSerializer
from rest_framework.decorators import api_view,permission_classes
from django.http import HttpResponse, JsonResponse
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed

@api_view(['POST'])
def Admin_reg(request):
    data = request.data
    if CustomUser.objects.filter(username=data.get('username')).exists():
        return Response(
            {
                "status": False,
                "message": "This username already exists. Please choose a different username.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if CustomUser.objects.filter(email=data.get('email')).exists():
        return Response(
            {
                "status": False,
                "message": "This email is already registered. Please use a different email address.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

  
    serializer = CustomUserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(data.get('password'))  
        user.save()

        return Response(
            {
                "status": True,
                "message": "Admin registration successful!",
                "data": {
                    "user": user.id
                },
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(
            {
                "status": False,
                "message": "Failed to register admin.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

@api_view(["POST"])
def Login(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")

        user = auth.authenticate(username=username, password=password)

        if user is not None:
          
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
    
            return Response({
                "status": True,
                "message": "Login successful",
                "user": user.id,
                "refresh": str(refresh),
                "access": access_token,
            }, status=status.HTTP_200_OK)
        
        else:
          
            return Response({
                "status": False,
                "message": "Invalid username or password, please try again."
            }, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
      
        return Response({
            "status": False,
            "message": f"An error occurred: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_employee(request):
    if request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            employee = serializer.save() 
          
            return Response({
                "status": True,
                "message": "Employee added successfully!"
            }, status=status.HTTP_201_CREATED)
        
        return Response({"status": False, "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_employees(request, user_id):
    try:
        print(f"Request made by: {request.user}")

        
        if request.user.id != user_id:
            print(f"Unauthorized access attempt by user {request.user.id} to user {user_id}.")
            return Response({'status': False, 'message': 'Unauthorized access'}, status=status.HTTP_403_FORBIDDEN)

     
        employees = Employee.objects.filter(user__id=user_id)
        employee_data = [{
            'id': employee.id,
            'name': employee.name,
            'email': employee.email,
            'position': employee.position,
            'custom_fields': employee.custom_fields  
        } for employee in employees]
        
        print(f"Fetched employees for user ID {user_id}: {employee_data}")
        return Response({'status': True, 'employees': employee_data}, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error fetching employees: {str(e)}")
        return Response({'status': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def add_custom_field(request):
    try:
        employee_id = request.data.get('employeeId')
        field_name = request.data.get('fieldName') 
        field_type = request.data.get('fieldType')  
        field_value = request.data.get('fieldValue')  

      
        if not employee_id or not field_name or not field_type or not field_value:
            return Response({
                'status': False,
                'message': 'Employee ID, field name, field type, and field value are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

      
        employee = Employee.objects.get(id=employee_id)

       
        if employee.custom_fields is None:
            employee.custom_fields = {}

       
        employee.custom_fields[field_name] = {
            'type': field_type,  
            'value': field_value 
        }

        employee.save() 

        return Response({'status': True, 'message': 'Custom field added successfully!'}, status=status.HTTP_201_CREATED)

    except Employee.DoesNotExist:
        return Response({'status': False, 'message': 'Employee not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'status': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_employee(request, id):
    try:
        employee = Employee.objects.get(id=id)
        serializer = EmployeeSerializer(employee)
        return Response({'status': True, 'employee': serializer.data}, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({'status': False, 'message': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_employee(request, id):
    try:
        employee = Employee.objects.get(id=id)
        serializer = EmployeeSerializer(employee, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'status': True, 'message': 'Employee updated successfully!'}, status=status.HTTP_200_OK)
        return Response({'status': False, 'message': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Employee.DoesNotExist:
        return Response({'status': False, 'message': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_employee(request, id):
    try:
        employee = Employee.objects.get(id=id)
        employee.delete()
        return Response({'status': True, 'message': 'Employee deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
    except Employee.DoesNotExist:
        return Response({'status': False, 'message': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getProfileData(request, id):
    try:
        user = CustomUser.objects.get(id=id)  
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    except CustomUser.DoesNotExist:
        return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user  
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    if not user.check_password(current_password):
        return Response({"detail": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

 
    user.set_password(new_password)
    user.save()

    return Response({"status": "Password changed successfully"}, status=status.HTTP_200_OK)