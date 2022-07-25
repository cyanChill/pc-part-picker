const featuresContainer = document.getElementsByClassName(
  "prd_form_features_cont"
);

const addFeatureInput = () => {
  // Container for entry
  const div = document.createElement("div");
  div.classList.add("flex");
  div.classList.add("prd_form_feature_entry");
  // Container for inputs
  const entryInputsCont = document.createElement("div");
  entryInputsCont.classList.add("flex");
  entryInputsCont.classList.add("prd_form_feature_entry_inputs");
  // Feature Name Input
  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "feat_name");
  nameInput.setAttribute("placeholder", "Feature Name");
  nameInput.setAttribute("maxLength", "50");
  nameInput.setAttribute("required", true);
  //- Feature Description Input
  const descriptionInput = document.createElement("input");
  descriptionInput.setAttribute("type", "text");
  descriptionInput.setAttribute("name", "feat_des");
  descriptionInput.setAttribute("placeholder", "Description Name");
  descriptionInput.setAttribute("maxLength", "30");
  descriptionInput.setAttribute("required", true);
  //- Remove Button
  const rmvBtn = document.createElement("button");
  rmvBtn.setAttribute("type", "button");
  rmvBtn.onclick = removeFeatureInput;
  rmvBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
    </svg>`;

  div.appendChild(entryInputsCont);
  entryInputsCont.appendChild(nameInput);
  entryInputsCont.appendChild(descriptionInput);
  div.appendChild(rmvBtn);

  featuresContainer[0].appendChild(div);
};

const removeFeatureInput = (e) => {
  // Get div containing this feature's input fields
  const featureEntry = e.target
    ? e.target.parentElement // For those created w/ function
    : e.parentElement; // For those created by server
  const featsCont = featureEntry.parentElement;

  featsCont.removeChild(featureEntry);
};
