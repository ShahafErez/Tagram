from drf_yasg import openapi
from .serializers import GetAnnotationSerializer, FileSerializer, ProjectSerializer

def upload_user_model_schema():
    return {
        'request_body': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'file': openapi.Schema(type=openapi.TYPE_FILE),
            },
            required=['file']
        ),
        'responses': {
            201: openapi.Response(description='File saved'),
            404: openapi.Response(description='Model File Not Found'),
            405: openapi.Response(description='Model name already exists'),
        }
    }

def run_user_model():
    return {
        'request_body': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'file': openapi.Schema(type=openapi.TYPE_FILE),
            },
            required=['file']
        ),
        'responses': {
            201: openapi.Response(description='File saved'),
            404: openapi.Response(description='Model File Not Found'),
            405: openapi.Response(description='Model name already exists'),
    }
}

def get_user_model_names():
    return {
        'responses': {
        200: openapi.Response(
            description='OK',
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_STRING)
            ),
        ),
    }
    }


def post_fleiss_kappa():
    return {
        'request_body': openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'data': openapi.Schema(
                type=openapi.TYPE_OBJECT,
                additional_properties={
                    'type': openapi.TYPE_OBJECT,
                }
            ),
            'calcFor': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['data', 'calcFor']
        ),
        'responses':{
        200: openapi.Response(
            description='OK',
            schema=openapi.Schema(
                type=openapi.TYPE_NUMBER,
                format=openapi.FORMAT_FLOAT
            ),
        ),
        400: openapi.Response(description='Bad Request'),
    }
    }

def post_send_to_algorithm():
    return{
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'project_id': openapi.Schema(type=openapi.TYPE_STRING),
                'tags': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING)
                ),
            },
            required=['project_id', 'tags']
        ),
        'responses':{
            201: openapi.Response(
                description='Created',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    additional_properties=openapi.Schema(type=openapi.TYPE_NUMBER)
                ),
            ),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_annotators_status(lookup_url_kwarg_project_id):
    return{
        'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg_project_id,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
            ),
        ],
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'project_id': openapi.Schema(type=openapi.TYPE_STRING),
                        'title': openapi.Schema(type=openapi.TYPE_STRING),
                        'project_manager': openapi.Schema(type=openapi.TYPE_STRING),
                        'annotators': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                            )
                        )
                    }
                ),
            ),
            204: openapi.Response(description='No Content'),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_by_project_manager(lookup_url_kwarg_project_manager):
    return{
        'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg_project_manager,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Name of the project manager'
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
                            'project_id': openapi.Schema(type=openapi.TYPE_STRING),
                            'title': openapi.Schema(type=openapi.TYPE_STRING),
                            'description': openapi.Schema(type=openapi.TYPE_STRING),
                        }
                    )
                ),
            ),
            204: openapi.Response(description='No Content'),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_annotation_by_project(lookup_url_kwarg_project_id):
    return {
        'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg_project_id,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
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
                            'tags': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                            'relations': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                            'co_occcurrence': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                        }
                    )
                ),
            ),
            204: openapi.Response(description='No Content'),
            400: openapi.Response(description='Bad Request'),
            404: openapi.Response(description='Not Found'),
        }
    }


def get_annotation_by_tagger(lookup_url_kwarg_project_id, lookup_url_kwarg_tagger):
    return{
        'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg_project_id,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
            ),
            openapi.Parameter(
                name=lookup_url_kwarg_tagger,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Tagger username'
            ),
        ],
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=GetAnnotationSerializer,
            ),
            204: 'No Content',
            400: 'Bad Request',
            404: 'Not Found',
        }
    }

def put_update_annotation_status(lookup_url_kwarg_project_id, lookup_url_kwarg_tagger):
    return{
         'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg_project_id,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
            ),
            openapi.Parameter(
                name=lookup_url_kwarg_tagger,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Tagger name'
            ),
        ],
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'annotation_status': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['annotation_status']
        ),
        'responses':{
            202: 'Accepted',
            400: 'Bad Request',
            404: 'Not Found',
        }
    }

def post_save_annotation():
    return {
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'project_id': openapi.Schema(type=openapi.TYPE_STRING),
                'tagger': openapi.Schema(type=openapi.TYPE_STRING),
                'tags': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'relations': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'co_occurrence': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
            },
            required=['project_id', 'tagger', 'tags', 'relations', 'co_occurrence']
        ),
        'responses':{
            201: 'Created',
            400: 'Bad Request',
            404: 'Not Found',
        }
    }

def get_file(lookup_url_kwarg):
    return{
         'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
            ),
        ],
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=FileSerializer,
            ),
            404: 'Not Found',
            400: 'Bad Request',
        }
    }

def get_processed_file():
    return{
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'myFile': openapi.Schema(type=openapi.TYPE_FILE),
            },
            required=['myFile']
        ),
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                    type=openapi.TYPE_STRING,
                ),
            ),
            400: 'Bad Request',
        }
    }

def post_upload_file():
    return{
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'project_id': openapi.Schema(type=openapi.TYPE_STRING),
                'myFile': openapi.Schema(type=openapi.TYPE_FILE),
            },
            required=['project_id', 'myFile']
        ),
        'responses':{
            201: 'Created',
            400: 'Bad Request',
            404: 'Not Found',
        }
    }

def get_project(lookup_url_kwarg):
    return{
        'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
            ),
        ],
        'responses':{
            200: openapi.Response(
                description='OK',
                schema=ProjectSerializer,
            ),
            400: 'Bad Request',
            404: 'Not Found',
        }
    }

def put_edit_project(lookup_url_kwarg):
    return{
        'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
            ),
        ],
        'request_body':openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        'responses':{
            200: 'OK',
            400: 'Bad Request',
            404: 'Not Found',
        }
    }

def delete_users_from_project(lookup_url_kwarg):
    return{
        'manual_parameters':[
            openapi.Parameter(
                name=lookup_url_kwarg,
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='ID of the project'
            ),
        ],
        'responses':{
            200: 'OK',
            400: 'Bad Request',
        }
    }

def post_create_projet():
    return{
        'request_body': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'meta_tagging': openapi.Schema(type=openapi.TYPE_INTEGER),
                'title': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'project_manager': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['title', 'project_manager']
        ),
        'responses':{
            201: 'Created',
            400: 'Bad Request',
        }
    }