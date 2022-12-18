import React from "react";

export default function MetaTaggingObject(props) {
  // return (
  //   <div>
  //     <ul class="list-group list-group-flush">
  //       {props.metaTagging &&
  //         props.metaTagging.map((element, index) => (
  //           <li class="list-group-item">
  //             <span key={index}>
  //               <div class="row">
  //                 <div class="col-sm">
  //                   <i
  //                     class="bi bi-square-fill"
  //                     style={{
  //                       color: element.color,
  //                       fontSize: "17px",
  //                       marginRight: "10px",
  //                     }}
  //                   ></i>
  //                 </div>
  //                 <div class="col-lg">
  //                   <span style={{ minWidth: "700px" }}>
  //                     {String(element.name)}{" "}
  //                   </span>
  //                 </div>
  //                 <div class="col-md">
  //                   {" "}
  //                   <span>{String(element.type)} </span>
  //                 </div>
  //               </div>
  //             </span>
  //           </li>
  //         ))}
  //     </ul>
  //   </div>
  // );

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
