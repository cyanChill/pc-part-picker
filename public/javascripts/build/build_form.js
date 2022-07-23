const editCompBtn = document.getElementById("editComp_btn");
const showFormBtn = document.getElementById("prepSub_btn");
const bldCompTb = document.getElementById("bd_comp_tb");
const submissionForm = document.getElementById("bldSub_form");

const buyBtns = document.getElementsByClassName("bld_tb_buy_btn");
const removeBtns = document.getElementsByClassName("bld_tb_rmv_form");
const selectBtns = document.getElementsByClassName("bld_tb_sel_btn");

const showSubmissionProcess = () => {
  showFormBtn.classList.add("hide");
  submissionForm.classList.remove("hide");
  editCompBtn.classList.remove("hide");
  bldCompTb.classList.add("bld_tb_no_edit");
};

const hideSubmissionProcess = () => {
  showFormBtn.classList.remove("hide");
  submissionForm.classList.add("hide");
  editCompBtn.classList.add("hide");
  bldCompTb.classList.remove("bld_tb_no_edit");
};
