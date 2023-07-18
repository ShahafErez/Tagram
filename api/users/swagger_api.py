from drf_yasg import openapi

def get_session_details():
    return{
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_STRING,
                    ),
                    description='Array containing the username and is_admin status',
                ),
            ),
        }
    }

def post_create_user():
    return{
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['username']
        ),
        'responses':{
            201: openapi.Response(description='User created'),
            200: openapi.Response(description='User already exists'),
            400: openapi.Response(description='Bad Request'),
        }
    }

def post_create_user_project_mapping():
    return{
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING),
                ),
                'project': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['user', 'project']
        ),
        'responses':{
            201: openapi.Response(description='User project created'),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_project_by_username():
    return{
        'manual_parameters':[
            openapi.Parameter(
                name='user',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Username'
            ),
        ],
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'user': openapi.Schema(type=openapi.TYPE_STRING),
                            'project': openapi.Schema(type=openapi.TYPE_STRING),
                            'project_manager': openapi.Schema(type=openapi.TYPE_STRING),
                        },
                    ),
                ),
            ),
            204: openapi.Response(description='No Content'),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_users_by_project():
    return{
        'manual_parameters':[
            openapi.Parameter(
                name='project',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Project ID'
            ),
        ],
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'user': openapi.Schema(type=openapi.TYPE_STRING),
                            'project': openapi.Schema(type=openapi.TYPE_STRING),
                            'project_manager': openapi.Schema(type=openapi.TYPE_STRING),
                        },
                    ),
                ),
            ),
            404: openapi.Response(description='Not Found'),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_is_assinged():
    return{
        'manual_parameters':[
            openapi.Parameter(
                name='project_id',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Project ID'
            ),
            openapi.Parameter(
                name='username',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Username'
            ),
        ],
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'Assigned': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                    },
                ),
            ),
            404: openapi.Response(description='Not Found'),
            400: openapi.Response(description='Bad Request'),
        }
    }