from drf_yasg import openapi

def get_connextra():
    return{
        'request_body':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'text': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['text']
        ),
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'output': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                ),
            ),
            400: openapi.Response(description='Bad Request'),
        }
    }