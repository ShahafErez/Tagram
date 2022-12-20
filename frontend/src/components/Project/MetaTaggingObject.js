import React from "react";

export default function MetaTaggingObject(props) {
  return (
    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Color</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          {props.metaTagging &&
            props.metaTagging.map((element, index) => (
              <tr>
                <th scope="row">
                  <i
                    class="bi bi-square-fill"
                    style={{
                      color: element.color,
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  ></i>
                </th>
                <td>{element.name}</td>
                <td>{element.type}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
