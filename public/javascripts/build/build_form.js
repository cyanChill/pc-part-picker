const showFormBtn = document.getElementById("prepSub_btn");
const submissionForm = document.getElementById("bldSub_form");

const showSubmissionProcess = () => {
  showFormBtn.classList.add("hide");
  submissionForm.classList.remove("hide");
};
