import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateMetaTagging() {
  const navigate = useNavigate();
  let { id } = useParams();

  const [title, setTitle] = useState(""); // meta-tagging setting

  // labels settings
  const [options, setOptions] = useState(["Class", "Attribute", "Aggregation"]);
  const [label, setLabel] = useState(options[0]);
  const [labelType, setLabelType] = useState("");
  const [labelColor, setLabelColor] = useState("#000000");
  const labelsList = [];

  /** Saving the labels in an array */
  const handleLabelSubmit = (e) => {
    e.preventDefault();
    // label = { label: label, labelType: labelType, labelColor: labelColor };
    console.log("6666");

    // save on labels array
    // labelsList.push()

    // reset value
    // setLabel(options[0]);
    // setLabelType("");
    // setLabelColor("#000000");
    // e.target.reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(label, labelType, labelColor);

    // save on database

    // reset value
    setLabel(options[0]);
    setLabelType("");
    setLabelColor("#000000");
    e.target.reset();
  };

  return (
    <div style={{ maxWidth: "40%", margin: "auto" }}>
      <h2>Create Meta-Tagging</h2>

      <form
        class="p-3 mb-2 bg-white text-dark"
        // onSubmit={handleSubmit}
        style={{ margin: "auto", background: "white", borderRadius: "5px" }}
      >
        <div style={{ marginTop: "15px" }}>
          <label>Meta-Tagging Title</label>
          <input
            class="form-control"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>
        <form
          class="p-3 mb-2 bg-white text-dark"
          onSubmit={handleLabelSubmit}
          style={{ margin: "auto", background: "white", borderRadius: "5px" }}
        >
          <div>
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
          <div
            style={{ marginTop: "15px" }}
            onChange={(e) => setLabelColor(e.target.value)}
          >
            <label>Select label color</label>
            <div>
              <input type="color" />
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-secondary"
            style={{ marginTop: "15px" }}
          >
            Save Label
          </button>
        </form>
      </form>
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <button
          type="submit"
          class="btn btn-primary"
          onClick={() => console.log("clicked")}
        >
          Save Meta-Tagging
        </button>
      </div>
    </div>
  );
}
