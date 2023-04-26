from rest_framework import generics, status
from .serializers import ProjectSerializer, CreateProjectSerializer, FileSerializer, SaveAnnotationSerializer, GetAnnotationSerializer, EditAnnotationStatusSerializer
from .models import Project, File, Annotation
from api.meta_tagging.models import MetaTagging
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from statsmodels.stats.inter_rater import fleiss_kappa,aggregate_raters
import numpy as np
import pandas as pd


class ProjectView(generics.ListAPIView):
    """
        Gets all of the active projects in the database
    """
    queryset = Project.objects.all()
    # specify the serializer of this object
    serializer_class = ProjectSerializer


class CreateProjectView(APIView):
    """
        Creates a new project
    """
    serializer_class = CreateProjectSerializer

    def post(self, request, format=None):

        # checking if we have an active session with the user
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # serialize all the data that was sent
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            meta_tagging = None

            meta_tagging_id = serializer.data.get('meta_tagging')
            if meta_tagging_id != None:
                # getting meta tagging object
                meta_tagging = MetaTagging.objects.filter(
                    meta_tagging_id=meta_tagging_id)
                if (len(meta_tagging)) > 0:
                    meta_tagging = meta_tagging[0]
                else:
                    meta_tagging = None

            title = serializer.data.get('title')
            description = serializer.data.get('description')
            project_manager = serializer.data.get('project_manager')

            project = Project(project_manager=project_manager, title=title,
                              description=description, meta_tagging=meta_tagging)
            project.save()
            # returns the code to the user
            return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GetProject(APIView):
    """
        Get project details by a given path param
    """
    serializer_class = ProjectSerializer
    lookup_url_kwarg = 'project_id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg)
        # Checking we got project id in the path param
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                data = ProjectSerializer(project_query[0]).data
                # checking if the current request sender is the project manager
                data['is_project_manager'] = self.request.session.session_key == project_query[0].project_manager
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Project Not Found': 'Invalid Project Id.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid path, did not find a project id'}, status=status.HTTP_400_BAD_REQUEST)


class UploadFile(APIView):
    """
    Saving a file and related it to an existing project id
    """

    def post(self, request, format=None):
        project_id = request.POST['project_id']
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]
                file = File(file=request.FILES['myFile'], project=project)
                file.save()
                return Response("File saved", status=status.HTTP_201_CREATED)
            return Response({'Project Not Found': 'Invalid Project Id.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid path, did not find a project id'}, status=status.HTTP_400_BAD_REQUEST)


class GetProcessedFile(APIView):
    """
    Reciving a file and returning processed text
    """

    def post(self, request, format=None):
        new_file = request.FILES['myFile']
        f = new_file.open('r')
        text = f.read()
        return Response(text, status=status.HTTP_200_OK)


class GetFile(APIView):
    """
        Getting a file by a given project id
    """
    serializer_class = FileSerializer
    lookup_url_kwarg = 'project_id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg)
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]
                file_query = File.objects.filter(project=project)
                if len(file_query) > 0:
                    data = FileSerializer(file_query[0]).data
                    with open(f".{data['file']}", 'r') as f:
                        text = f.read()
                        data['text'] = text
                    return Response(data, status=status.HTTP_200_OK)
                return Response({'File Not Found': 'Invalid File Id.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'Project Not Found': 'Invalid Project Id.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid path, did not find a project id'}, status=status.HTTP_400_BAD_REQUEST)


class SaveAnnotation(APIView):
    """
    Saving annotations relates to a given project id
    """
    serializer_class = SaveAnnotationSerializer

    def post(self, request, format=None):
        data = request.data
        project = None
        project_id = data['project_id']
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if (len(project_query)) > 0:
                project = project_query[0]
                tagger = data['tagger']

                ''' 
                checking if the project and tagger already has a saved annotation
                if there is- deleting and overriding it
                '''
                annotation_query = Annotation.objects.filter(
                    project=project, tagger=tagger)
                if len(annotation_query) > 0:
                    annotation_query.delete()

                tags = json.dumps(data['tags'])
                relations = json.dumps(data['relations'])
                co_occcurrence = json.dumps(data['co_occcurrence'])

                annotation = Annotation(
                    project=project, tags=tags, tagger=tagger, relations=relations, co_occcurrence=co_occcurrence)
                annotation.save()

                return Response("Annotation saved successfully", status=status.HTTP_201_CREATED)
            return Response({'Project Not Found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid path, did not find a project'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateAnnotationStatus(APIView):
    serializer_class = EditAnnotationStatusSerializer
    lookup_url_kwarg_project_id = 'project_id'
    lookup_url_kwarg_tagger = 'tagger'

    def put(self, request, format=None):
        data = request.data
        annotation_new_status = data['annotation_status']
        project_id = request.GET.get(self.lookup_url_kwarg_project_id)
        tagger = request.GET.get(self.lookup_url_kwarg_tagger)
        if project_id != None and tagger != None:
            project_query = Project.objects.filter(
                project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]
                if project != None:
                    Annotation.objects.filter(
                        project=project, tagger=tagger).update(annotation_status=annotation_new_status)
                    return Response("Annotation status updated successfully", status=status.HTTP_202_ACCEPTED)
                return Response({'Project Not Found': 'Invalid Project Id.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid path, did not find project or tagger'}, status=status.HTTP_400_BAD_REQUEST)


class GetAnnotation(APIView):
    """
        Getting annotations by a given project id
    """
    lookup_url_kwarg_project_id = 'project_id'
    lookup_url_kwarg_tagger = 'tagger'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg_project_id)
        tagger = request.GET.get(self.lookup_url_kwarg_tagger)
        if project_id != None and tagger != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]
                if project != None:
                    annotation_query = Annotation.objects.filter(
                        project=project, tagger=tagger)
                    if len(annotation_query) > 0:
                        data = GetAnnotationSerializer(
                            annotation_query[0]).data
                        if data['tags'] != None or data['relations'] != None or data['co_occcurrence'] != None:
                            data['tags'] = json.loads(data['tags'])
                            data['relations'] = json.loads(data['relations'])
                            data['co_occcurrence'] = json.loads(
                                data['co_occcurrence'])
                            return Response(data, status=status.HTTP_200_OK)
                    return Response({'No Annotation Found'}, status=status.HTTP_204_NO_CONTENT)
            return Response({'Project Not Found': 'Invalid Project Id.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid path, did not find project or tagger'}, status=status.HTTP_400_BAD_REQUEST)


class GetAnnotatorsStatus(APIView):
    lookup_url_kwarg_project_id = 'project_id'

    def get(self, request, format=None):
        project_id = request.GET.get(self.lookup_url_kwarg_project_id)
        if project_id != None:
            project_query = Project.objects.filter(project_id=project_id)
            if len(project_query) > 0:
                project = project_query[0]
                if project != None:
                    annotation_query = Annotation.objects.filter(
                        project=project)
                    if len(annotation_query) > 0:
                        project = ProjectSerializer(project).data
                        response = {"project_id": project_id,
                                    "title": project["title"]}
                        annotators = []
                        for annotation in annotation_query:
                            annotators.append(
                                GetAnnotationSerializer(annotation).data)
                        response["annotators"] = annotators
                        return Response(response, status=status.HTTP_200_OK)
                    return Response("no annotation found", status=status.HTTP_204_NO_CONTENT)
        return Response("error", status=status.HTTP_400_BAD_REQUEST)


class GetByProjectManager(APIView):
    """
    Getting projects by project manager name
    """
    lookup_url_kwarg_project_manager = 'manager'

    def get(self, request, format=None):
        project_manager = request.GET.get(
            self.lookup_url_kwarg_project_manager)
        if project_manager != None:
            project_query = Project.objects.filter(
                project_manager=project_manager)
            if len(project_query) > 0:
                data = [ProjectSerializer(
                    project).data for project in project_query]
                return Response(data, status=status.HTTP_200_OK)
            return Response("no projects found", status=status.HTTP_204_NO_CONTENT)
        return Response("error", status=status.HTTP_400_BAD_REQUEST)


class SendToAlgorithm(APIView):
    def post(self, request, format=None):
        if (request.data['project_id']):
            lst = request.data['tags']
            ans = {f"({lst[i]}, {lst[j]})": 0.3 for i in range(len(lst))
                   for j in range(i+1, len(lst))}
            # TODO: save in DB after the acctual code is ready
            return Response(ans, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'No Project Id'}, status=status.HTTP_400_BAD_REQUEST)

class GetProjectFleissKappaScore(APIView):
    """
    Calculates Fleiss' Kappa score for the input data.
    Input: A dictionary of dictionaries where the keys of the outer dictionary are the raters, and the keys of the
    inner dictionary are the items being rated. The values of the inner dictionary are lists of ratings for that item.
    Output: The Fleiss' Kappa score as a float.
    """
    def pad_arrays(self,arrays):
        max_len = max([len(arr) for arr in arrays])
        padded_arrays = []
        for arr in arrays:
            padding = [0] * (max_len - len(arr))
            padded_arrays.append(arr + padding)
        return padded_arrays
    def getArray(self,input):
        ans = {}
        for key,val in input.items():
            ans[key] = {}
            for key2,val2 in val.items():
                indx = key2
                for key3,val3 in val2.items():
                    class_ = key3
                    for arr in val3:
                        place_ = f"{arr[0]}{arr[1]}"
                        new_str = indx+class_+place_
                        ans[key][new_str] = 1
        return ans
        
    def create_dataframe(self,input_dict):
        # create an empty dataframe with the correct columns
        columns = list(input_dict[list(input_dict.keys())[0]].keys())
        df = pd.DataFrame(columns=columns)
        
        # iterate over the dictionary and fill in the dataframe
        for key in input_dict:
            row = [1 if input_dict[key].get(col, 0) == 1 else 0 for col in columns]
            df.loc[key] = row
        
        return df
    
    def create_numpy_array(self,input_dict):
        # create a pandas dataframe
        columns = list(input_dict[list(input_dict.keys())[0]].keys())
        df = pd.DataFrame(columns=columns)
        for key in input_dict:
            row = [1 if input_dict[key].get(col, 0) == 1 else 0 for col in columns]
            df.loc[key] = row
        
        # return the numpy array
        return df.values

    def post(self, request, format=None):
        
        data = request.data['data']
        
        if data != None:
            arr  = self.create_numpy_array(self.getArray(data))
            print(arr)
            # Calculate Fleiss' Kappa score
            kappa = fleiss_kappa(arr)
            
            return Response(kappa, status=status.HTTP_200_OK)
        return Response("error", status=status.HTTP_400_BAD_REQUEST)