import React, { useState } from "react";
import { ReactSession } from "react-client-session";

export default function CreateMetaTagging(props) {
  let logged_in_user = ReactSession.get("username");

  // meta-tagging setting
  const [title, setTitle] = useState("");
  const [currentMetaModel, setCurrentMetaModel] = useState("");
  const [metaModelArray, setMetaModelArray] = useState([]);
  const [isMetaTaggingCreated, setIsMetaTaggingCreated] = useState(false);

  // labels settings
  const [labelName, setLabelName] = useState(metaModelArray[0]);
  const [labelType, setLabelType] = useState("");
  const [labelColor, setLabelColor] = useState("#000000");

  // labels array
  const [labels, setLabels] = useState([]);

  /** Handeles saving the meta tagging details
   * Saves meta-tagging details
   * Saves the labels details
   */
  const createMetaTagging = () => {
    let meta_tagging_id = "";

    // send the meta tagging to the backend and save it in memory
    fetch("/api/meta-tagging/create", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        username: logged_in_user,
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((data) => (meta_tagging_id = data.meta_tagging_id))
      .then(() => {
        // send the labels related to the meta-tagging to the backend and save it in memory.
        fetch("/api/meta-tagging/create-labels", {
          method: "POST",
          headers: { "Content-Type": "application/json ; charset=utf-8" },
          body: JSON.stringify({
            meta_tagging: meta_tagging_id,
            labels: labels,
          }),
        });
      })
      .then(() => props.onSave({ title, meta_tagging_id }));
  };

  /** Handeles saving a label
   * Saves the details in the backend
   */
  const handleLabelSubmit = (e) => {
    e.preventDefault();
    let labelDetails = {
      name: labelName,
      type: "" + labelType,
      color: "" + labelColor,
    };

    setLabels(labels.concat(labelDetails));
    resetLabelValues(e);
  };

  function setMetaModelInput() {
    let temp_model_array = JSON.parse(JSON.stringify(metaModelArray));
    temp_model_array.push(currentMetaModel);
    setCurrentMetaModel("");
    setMetaModelArray(temp_model_array);
  }

  function resetLabelValues(e) {
    e.target.reset();

    setLabelName(metaModelArray[0]);
    setLabelType("");
    setLabelColor("#000000");

    // setting all the label types to be "checked = false"
    const typesArr = Array.from(document.getElementsByClassName("metaTagType"));
    typesArr.forEach((type) => {
      type.checked = false;
    });
  }

  /** Returns the part that chooses the title and meta-model*/
  function rederMetaTaggingDetails() {
    return (
      <div class="p-3 mb-2">
        <h5>Title</h5>
        <input
          class="form-control"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter meta-tagging title"
        />

        <div style={{ marginTop: "20px" }}>
          <h5>Create Meta-Model</h5>
          <h6 style={{ fontWeight: "400" }}>Please enter all wanted labels</h6>
          <input
            class="form-control"
            type="text"
            required
            placeholder="Enter meta-model label"
            onChange={(e) => setCurrentMetaModel(e.target.value)}
            value={currentMetaModel}
          />
          <button
            type="submit"
            class="btn btn-secondary"
            style={{ marginTop: "10px" }}
            onClick={(e) => setMetaModelInput(e)}
          >
            Add Label
          </button>
        </div>

        {/* Displaying the current chooices */}
        <div
          class="accordion"
          id="accordionExample"
          style={{ marginTop: "10px" }}
        >
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Current added labels in meta-model
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <ul class="list-group">
                  {metaModelArray.map((element, index) => (
                    <li class="list-group-item">
                      <span key={index}>{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ textAlign: "right", marginTop: "15px", marginRight: "15px" }}
        >
          <button
            type="submit"
            class="btn btn-passive"
            style={{
              marginLeft: "10px",
              backgroundColor: "#adb5bd",
            }}
            onClick={() => {
              props.onBack();
            }}
          >
            Back To Create Project
          </button>
          {/* disable if there are no title and meta tagging selected */}
          {(metaModelArray.length <= 0 || title == "") && (
            <button
              type="submit"
              class="btn btn-primary disabled"
              style={{ marginLeft: "10px", zIndex: "99999" }}
            >
              Save Meta-Model
            </button>
          )}
          {/* enabled */}
          {metaModelArray.length > 0 && title != "" && (
            <button
              type="submit"
              class="btn btn-primary"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                // setting the label default
                setLabelName(metaModelArray[0]);
                setIsMetaTaggingCreated(true);
              }}
            >
              Save Meta-Model
            </button>
          )}
        </div>
      </div>
    );
  }

  /** Returns the label selection */
  function renderLabelSelection() {
    return (
      <div class="p-3 mb-2 bg-white text-dark">
        <form onSubmit={handleLabelSubmit}>
          <h5 style={{ margintop: "0px" }}>Please select one or more labels</h5>
          <div class="card" style={{ padding: "15px" }}>
            <div>
              {/* Selecting the label type from the meta model list (todo- get from meta-model) */}
              <label>Select label type</label>
              <select
                class="form-select"
                onChange={(e) => {
                  setLabelName(e.target.value);
                }}
                aria-label="Default select example"
              >
                {metaModelArray.map((element, index) => (
                  <option key={index}>{element}</option>
                ))}
              </select>
            </div>
            {/* Select the label type- tag or relation */}
            <div
              onChange={(e) => {
                setLabelType("" + e.target.value);
              }}
              style={{ marginTop: "15px" }}
            >
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input metaTagType"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="Tag"
                  required
                />
                <label class="form-check-label" for="inlineRadio1">
                  Tag
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input metaTagType"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  value="Relation"
                />
                <label class="form-check-label" for="inlineRadio2">
                  Relation
                </label>
              </div>
            </div>
            {/* Selecting the label color */}
            <div
              style={{ marginTop: "15px" }}
              onChange={(e) => setLabelColor(e.target.value)}
            >
              <label>Select label color</label>
              <div>
                <input type="color" />
              </div>
            </div>
            {/* Saving the label */}
            <button
              type="submit"
              class="btn btn-outline-secondary"
              style={{ marginTop: "15px", width: "150px" }}
            >
              Save Label
            </button>
          </div>
        </form>

        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Current added labels
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <ul class="list-group">
                  {labels.map((element, index) => (
                    <li class="list-group-item">
                      <span key={index}>
                        <i
                          class="bi bi-square-fill"
                          style={{
                            color: element.color,
                            fontSize: "17px",
                            marginRight: "10px",
                          }}
                        ></i>
                        <span>
                          <b> label name: </b>
                        </span>
                        <span>{String(element.name)} </span>
                        <span style={{ marginLeft: "10px" }}>
                          <b> label type: </b>
                        </span>
                        <span>{String(element.type)} </span>
                      </span>
                    </li>
                  ))}
                </ul>
                {labels.length <= 0 && <p>You don't have labels yet</p>}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ textAlign: "right", marginTop: "15px", marginRight: "15px" }}
        >
          <button
            type="submit"
            class="btn btn-passive"
            style={{
              marginLeft: "10px",
              backgroundColor: "#adb5bd",
            }}
            onClick={() => {
              setIsMetaTaggingCreated(false);
            }}
          >
            Back To Create Meta Model
          </button>

          {/* disable if there are no title and meta tagging selected */}
          {(labels.length <= 0 || title == "") && (
            <button
              type="submit"
              class="btn btn-primary disabled"
              style={{ marginLeft: "10px", zIndex: "99999" }}
            >
              Save Meta-Tagging
            </button>
          )}
          {/* enabled */}
          {labels.length > 0 && title != "" && (
            <button
              type="submit"
              class="btn btn-primary"
              style={{ marginLeft: "10px" }}
              onClick={createMetaTagging}
            >
              Save Meta-Tagging
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div class="create-page">
      <h2>Create Meta-Tagging</h2>

      {!isMetaTaggingCreated && rederMetaTaggingDetails()}
      {isMetaTaggingCreated && renderLabelSelection()}
    </div>
  );
}
