import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateMetaTagging(props) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(""); // meta-tagging setting

  // labels settings
  const [options, setOptions] = useState(["Class", "Attribute", "Aggregation"]);
  const [label, setLabel] = useState(options[0]);
  const [labelType, setLabelType] = useState();
  const [labelColor, setLabelColor] = useState("#000000");

  // labels array
  let labels = [];

  /** Handeles saving the meta tagging details
   * Saves the details in the backend
   * Saved the labels details in the backend
   */
  function createMetaTagging() {
    console.log("title ", title);
    console.log("array: ", labels);
    // props.onSave("8");
  }

  /** Handeles saving a label
   * Saves the details in the backend
   */
  const handleLabelSubmit = (e) => {
    e.preventDefault();
    let labelDetails = {
      label: label,
      labelType: labelType,
      labelColor: labelColor,
    };

    // saves the detail to backend

    // reset value
    setLabel(options[0]);
    setLabelType("");
    setLabelColor("#000000");
    e.target.reset();
  };

  /** Returns the label selection */
  function renderLabelSelection() {
    return (
      <div>
        <form class="p-3 mb-2 bg-white text-dark" onSubmit={handleLabelSubmit}>
          <div class="card" style={{ padding: "15px" }}>
            <h4>Please select one or more labels</h4>
            <div>
              {/* Selecting the label type from the meta model list (todo- get from meta-model) */}
              <label>Select label type</label>
              <select
                class="form-select"
                onChange={(e) => setLabel(e.target.value)}
                aria-label="Default select example"
              >
                {options.map((element, index) => (
                  <option key={index}>{element}</option>
                ))}
              </select>
            </div>
            {/* Select the label type- tag or relation */}
            <div
              onChange={(e) => setLabelType(e.target.value)}
              style={{ marginTop: "15px" }}
            >
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
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
                  class="form-check-input"
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
      </div>
    );
  }

  return (
    <div>
      <h2>Create Meta-Tagging</h2>

      <div class="p-3 mb-2">
        <label style={{ fontSize: "17px" }}>Title</label>
        <input
          class="form-control"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter meta-tagging title"
        />
      </div>

      {renderLabelSelection()}

      <div
        style={{ textAlign: "right", marginTop: "15px", marginRight: "15px" }}
      >
        <button
          type="submit"
          class="btn btn-primary"
          style={{ marginLeft: "10px" }}
          onClick={createMetaTagging}
        >
          Save Meta-Tagging
        </button>
      </div>
    </div>
  );
}
