# import pickle


class Model:
    def __init__(self):
        # Initialize your model here
        pass


    def predict(self, data):
        # TODO: Perform prediction logic here
        return {"labels": ["user", "username"], "labelsTypes": ["class", "attribute"], "values": [
            [0.8, 0.2],
            [0.2, 0.8],
        ]}


# # Create an instance of the Model class
# model_instance = Model()
#
#
# # Serialize the model_instance and its predict() method
# with open('../model.pkl', 'wb') as file:
#     pickle.dump(model_instance, file)

# with open("model.pickle", 'rb') as file:
#     loaded_model = pickle.load(file)
#
# # Call the predict() method of the loaded model
# prediction_result = loaded_model.predict(42)
#
# # Print the prediction result
# print(prediction_result)