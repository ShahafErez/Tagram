import React, { useState } from "react";

export default function CorrectnessPage(props) {
  const [textArray, setTextArray] = useState(props.file);
  const [textArrayEdit, setTextArrayEdit] = useState(props.file);
  const [newStory, setNewStory] = useState("");
  const [connextraInfo, setConnextraInfo] = useState(null);

  // checking for duplications
  let duplicatesArray = new Set();
  textArray.map((element, index) => {
    if (textArray.indexOf(element) !== index) {
      duplicatesArray.add(index);
      duplicatesArray.add(textArray.indexOf(element));
    }
  });

  // Adding a new uer story
  function addNewStory() {
    let tempTextArray = JSON.parse(JSON.stringify(textArray));
    tempTextArray.push(newStory);
    setTextArray(tempTextArray);
    setNewStory("");
  }

  // Editing an existing user story
  function editTextArray(index) {
    let tempTextArray = JSON.parse(JSON.stringify(textArray));
    tempTextArray[index] = textArrayEdit[index];
    setTextArray(tempTextArray);
  }

  // Removing an existing user story
  function RemoveStory(index) {
    let tempTextArray = JSON.parse(JSON.stringify(textArray));
    tempTextArray[index] = "";
    setTextArray(tempTextArray);
  }

  function checkConnextra() {
    fetch("/api/correctness/connextra", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify({
        text: textArray,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setConnextraInfo(data);
      });
  }

  function checkStoryConnextra(index) {
    let value = connextraInfo["" + index];
    if (value != null) {
      return (
        <div>
          <p style={{ color: "#e56000", marginBottom: "0px" }}>
            <i
              class="bi bi-exclamation-triangle"
              style={{
                marginTop: "0px",
                marginBottom: "0px",
              }}
            ></i>{" "}
            faild connextra check. defect type: {value["Defect kind"]}
            {", "}
            {value["Defect subkind"]}
          </p>
        </div>
      );
    }
  }

  return (
    <div class="form-group">
      <h4>Edit stories & Check correctness</h4>
      <button class="btn btn-secondary" onClick={checkConnextra}>
        Check Connextra
      </button>
      {textArray.map(
        (element, index) =>
          element != "" && (
            <div style={{ marginTop: "15px" }}>
              {/* Showing a message if the story failed connextra check */}
              {connextraInfo != null && checkStoryConnextra(index + 1)}
              {/* Showing a message if the story is duplicated */}
              {duplicatesArray.has(index) ? (
                <p style={{ color: "#c8480b", marginBottom: "0px" }}>
                  <i
                    class="bi bi-exclamation-triangle"
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                    }}
                  ></i>{" "}
                  duplicated user story
                </p>
              ) : (
                <div></div>
              )}
              <span>
                <textarea
                  spellCheck="true"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  // Setting the value in the array of editted values
                  onChange={(e) => {
                    let tempEditTextArray = JSON.parse(
                      JSON.stringify(textArrayEdit)
                    );
                    tempEditTextArray[index] = e.target.value;
                    setTextArrayEdit(tempEditTextArray);
                  }}
                >
                  {element}
                </textarea>
              </span>

              <div style={{ marginTop: "4px" }}>
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  value={newStory}
                  onClick={() => editTextArray(index)}
                >
                  Save
                </button>
                <button
                  style={{ marginLeft: "10px" }}
                  type="button"
                  class="btn btn-outline-danger"
                  value={newStory}
                  onClick={() => RemoveStory(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
      )}

      {/* Adding a new user story */}
      <div style={{ marginTop: "15px" }}>
        <h6>Add new story</h6>
        <textarea
          spellCheck="true"
          class="form-control"
          id="exampleFormControlTextarea1"
          value={newStory}
          onChange={(e) => setNewStory(e.target.value)}
        ></textarea>
        <button
          style={{ marginTop: "4px" }}
          type="button"
          class="btn btn-outline-primary"
          onClick={() => addNewStory()}
        >
          Add Story
        </button>
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          type="submit"
          class="btn btn-passive"
          style={{
            marginRight: "10px",
            backgroundColor: "#adb5bd",
          }}
          onClick={() => {
            props.onBack();
          }}
        >
          Go Back Without Saving
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          onClick={() => {
            props.onSave({ textArray });
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
