import React from "react";

export default function fileContent(props) {
  let fileContent = props.fileContent;

  return (
    <div>
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Uploaded user stories
            </button>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <div>
                <ol class="list-group" style={{ marginLeft: "10px" }}>
                  {fileContent.map((element, index) => (
                    <li style={{ paddingLeft: "4px", paddingRight: "6px" }}>
                      {element}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {props.showCorrectness && (
        <div style={{ marginTop: "10px" }}>
          <button
            type="submit"
            class="btn btn-outline-primary"
            onClick={(e) => {
              e.preventDefault();
              props.isCheckingCorrectness(true);
            }}
          >
            Edit stories & Check correctness
            <i class="bi bi-pencil-square" style={{ marginLeft: "8px" }}></i>
          </button>
        </div>
      )}
    </div>
  );
}
