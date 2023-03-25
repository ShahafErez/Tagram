import React, { useEffect, useState } from "react";
import MetaTaggingObject from "./MetaTaggingObject";

export default function BrowseMetaTagging(props) {
  const [metaTaggingList, setMetaTaggingList] = useState();
  const [metaTaggingId, setMetaTaggingId] = useState();
  const [metaTaggingTitle, setmetaTaggingTitle] = useState();

  // getting all the labels gouped by meta tagging id on loading
  useEffect(() => {
    fetch("/api/meta-tagging/all-labels-grouped")
      .then((response) => response.json())
      .then((data) => setMetaTaggingList(data));
  }, []);

  return (
    <div>
      <h5 style={{ textAlign: "center" }}>
        Select from the existing meta-tagging
      </h5>
      <div class="row row-cols-1 row-cols-md-3">
        {metaTaggingList &&
          metaTaggingList.map((element, index) => (
            <div>
              {/* the meta-tagging that wasn't selected */}
              {element.meta_tagging_id != metaTaggingId && (
                <div class="col mb-4">
                  <div
                    class="card-header"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setMetaTaggingId(element.meta_tagging_id);
                      setmetaTaggingTitle(element.title);
                    }}
                  >
                    {element.title}
                  </div>
                  <MetaTaggingObject metaTagging={element.labels} />
                </div>
              )}
              {/* the meta-tagging that was selected */}
              {element.meta_tagging_id == metaTaggingId && (
                <div class="col mb-4">
                  <div class="card-header bg-secondary">{element.title}</div>
                  <MetaTaggingObject metaTagging={element.labels} />
                </div>
              )}
            </div>
          ))}
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          type="submit"
          class="btn btn-passive"
          style={{
            marginRight: "10px",
            backgroundColor: "#adb5bd",
            width: "80px",
          }}
          onClick={() => {
            props.onBack();
          }}
        >
          Back
        </button>
        {/* no meta tagging selected */}
        {metaTaggingId ? (
          <button
            type="submit"
            class="btn btn-primary"
            onClick={() => {
              props.onSave({
                title: metaTaggingTitle,
                meta_tagging_id: metaTaggingId,
              });
            }}
          >
            Save
          </button>
        ) : (
          <button type="submit" class="btn btn-primary disabled">
            Save
          </button>
        )}
      </div>
    </div>
  );
}
