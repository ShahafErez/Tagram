from drf_yasg import openapi

def post_create_meta_tagging():
    return{
        'request_body':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING),
            'title': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['username', 'title']
        ),
        'responses':{
            201: openapi.Response(
                description='Created',
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'meta_tagging_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                ),
            ),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_labels_by_meta_tagging_id():
    return{
    'manual_parameters':[
        openapi.Parameter(
            name='meta-tagging-id',
            in_=openapi.IN_QUERY,
            type=openapi.TYPE_STRING,
            required=True,
            description='ID of the meta tagging'
        ),
    ],
    'responses':{
        200: openapi.Response(
            description='OK',
            schema=openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                )
            ),
        ),
        400: openapi.Response(description='Bad Request'),
        404: openapi.Response(description='Invalid meta-tagging id.'),
    }
    }

def post_create_label():
    return{
        'request_body':openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'meta_tagging': openapi.Schema(
                type=openapi.TYPE_STRING,
                description='ID of the meta tagging',
            ),
            'labels': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'name': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Name of the label',
                        ),
                        'type': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Type of the label',
                        ),
                        'color': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Color of the label',
                        ),
                    },
                ),
                description='Array of labels to create',
            ),
        },
        required=['meta_tagging', 'labels'],
        ),
        'responses':{
            201: openapi.Response(description='Labels created'),
            400: openapi.Response(description='Bad Request'),
        }
    }

def get_labels_groups():
    return{
        'manual_parameters':[
            openapi.Parameter(
                name='username',
                in_=openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
                required=True,
                description='Username of the meta taggings',
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
                            'meta_tagging_id': openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description='ID of the meta tagging',
                            ),
                            'title': openapi.Schema(
                                type=openapi.TYPE_STRING,
                                description='Title of the meta tagging',
                            ),
                            'labels': openapi.Schema(
                                type=openapi.TYPE_ARRAY,
                                items=openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                ),
                                description='Array of labels',
                            ),
                        },
                    ),
                ),
            ),
            400: openapi.Response(description='Bad Request'),
        }
    }