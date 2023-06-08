from rest_framework import serializers

from .models import MetaTagging, MetaTaggingLabels


class MetaTaggingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetaTagging
        fields = ('meta_tagging_id', 'title', 'username',)


class CreateMetaTaggingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetaTagging
        fields = ('title', 'username',)

# Labels


class MetaTaggingLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetaTaggingLabels
        fields = ('meta_tagging_id', 'label_id', 'name', 'type', 'color')


class CreateMetaTaggingLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetaTaggingLabels
        fields = ('meta_tagging', 'name', 'type', 'color')
