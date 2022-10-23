let map_code = null;
let map_creators = null;
let initVect = null;
let levelNames = [];
let checkpointVectors = [];
let selectedLevel = -1;
let primeNumbers = [];

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

window.onload = function () {
  const initVectorForm = document.getElementById("init-vector-form");
  initVectorForm.addEventListener("input", function (event) {
    const vectorX = document.getElementById("initCheckpointVectorX");
    const vectorY = document.getElementById("initCheckpointVectorY");
    const vectorZ = document.getElementById("initCheckpointVectorZ");
    validateForm(vectorX, isNumeric(vectorX.value));
    validateForm(vectorY, isNumeric(vectorY.value));
    validateForm(vectorZ, isNumeric(vectorZ.value));
  });

  const modalVectorForm = document.getElementById("checkpoint-vector-form");
  modalVectorForm.addEventListener("input", function (event) {
    const vectorX = document.getElementById("checkpointVectorX");
    const vectorY = document.getElementById("checkpointVectorY");
    const vectorZ = document.getElementById("checkpointVectorZ");
    validateForm(vectorX, isNumeric(vectorX.value));
    validateForm(vectorY, isNumeric(vectorY.value));
    validateForm(vectorZ, isNumeric(vectorZ.value));
  });

  const modalVectorFormEdit = document.getElementById(
    "checkpoint-vector-form-edit"
  );
  modalVectorFormEdit.addEventListener("input", function (event) {
    const vectorX = document.getElementById("checkpointVectorX-edit");
    const vectorY = document.getElementById("checkpointVectorY-edit");
    const vectorZ = document.getElementById("checkpointVectorZ-edit");
    validateForm(vectorX, isNumeric(vectorX.value));
    validateForm(vectorY, isNumeric(vectorY.value));
    validateForm(vectorZ, isNumeric(vectorZ.value));
  });

  const modalLevel = document.getElementById("level-modal-submit");
  modalLevel.addEventListener("click", addLevel);

  const modalCheckpointSubmit = document.getElementById(
    "checkpoint-submit-btn"
  );
  modalCheckpointSubmit.addEventListener("click", saveCheckpointModal);

  const modalCheckpointSubmitEdit = document.getElementById(
    "checkpoint-submit-btn-edit"
  );
  modalCheckpointSubmitEdit.addEventListener("click", saveCheckpointModalEdit);

  const addCheckpointButton = document.getElementById("add-checkpoint-bt");
  addCheckpointButton.addEventListener("click", checkCheckpointModal);
};

function validateForm(vectorField, valid) {
  if (valid) {
    vectorField.classList.remove("is-invalid");
    vectorField.classList.add("is-valid");
  } else {
    vectorField.classList.remove("is-valid");
    vectorField.classList.add("is-invalid");
  }
}

function getMapCode() {
  map_code = document.getElementById("map-code-input").value;
}

function getMapCreators() {
  map_creators = document.getElementById("map-creator-input").value;
}

function checkValidVectors(elements) {
  return elements.map((x) => isNumeric(x)).every((element) => element);
}

function getInitVector() {
  if (
    checkValidVectors([
      document.getElementById("initCheckpointVectorX").value,
      document.getElementById("initCheckpointVectorY").value,
      document.getElementById("initCheckpointVectorZ").value,
    ])
  ) {
    // TODO: proceed
  } else {
    // present error
  }
}

function getCheckpointVector(edit) {
  console.log(edit ? "-edit" : "");
  console.log(`checkpointVectorX${edit ? "-edit" : ""}`);
  const vectors = [
    document.getElementById("checkpointVectorX" + edit ? "-edit" : "").value,
    document.getElementById("checkpointVectorY" + edit ? "-edit" : "").value,
    document.getElementById("checkpointVectorZ" + edit ? "-edit" : "").value,
  ];
  if (checkValidVectors(vectors)) {
    checkpointVectors[selectedLevel].push(
      convertVectorString.apply(this, vectors)
    );
  } else {
    // present error TODO
    console.log("WAAAAAAA");
  }
}
function setModalVector(name, value, valid) {
  const field = document.getElementById(name);
  field.value = value;
  if (valid) {
    field.classList.add("is-valid");
    field.classList.remove("is-invalid");
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }
}

function setModalAbility(name, value) {
  const field = document.getElementById(name);
  field.checked = value;
}

function convertVectorString(x, y, z) {
  console.log(x, y, z);
  return `Vector(${x}, ${y}, ${z})`;
}

function getCheckpointPrimes(edit) {
  let value = 1;
  // First checkpoint of a level
  if (primeNumbers[selectedLevel].length === 0) {
    value *= 13;
  }
  if (
    !document.getElementById("primary-fire-btn" + edit ? "-edit" : "").checked
  ) {
    value *= 2;
  }
  if (!document.getElementById("ability-1-btn" + edit ? "-edit" : "").checked) {
    value *= 3;
  }
  if (!document.getElementById("ability-2-btn" + edit ? "-edit" : "").checked) {
    value *= 5;
  }

  primeNumbers[selectedLevel].push(value);
}

function saveCheckpointModal() {
  getCheckpointVector(false);
  getCheckpointPrimes(false);
  addCheckpoint();
  setModalVector("checkpointVectorX", "");
  setModalVector("checkpointVectorY", "");
  setModalVector("checkpointVectorZ", "");
  setModalAbility("ability-1-btn", true);
  setModalAbility("ability-2-btn", true);
  setModalAbility("primary-fire-btn", true);
  $("#checkpoint-modal").modal("hide");
}

function saveCheckpointModalEdit() {
  getCheckpointVector(true);
  getCheckpointPrimes(true);
  editCheckpoint($("#checkpoint-modal-edit").dataset.checkpoint);
  setModalVector("checkpointVectorX", "");
  setModalVector("checkpointVectorY", "");
  setModalVector("checkpointVectorZ", "");
  setModalAbility("ability-1-btn", true);
  setModalAbility("ability-2-btn", true);
  setModalAbility("primary-fire-btn", true);
  $("#checkpoint-modal-edit").modal("hide");
}

function getLevelName() {
  return document.getElementById("level-name-input").value;
}

function addLevel() {
  selectedLevel = checkpointVectors.length;
  checkpointVectors.push([]);
  levelNames.push(getLevelName());
  primeNumbers.push([]);
  unselectLevels();
  const levelList = document.getElementById("levels-list-buttons");
  const newButton = document.createElement("button");
  newButton.className = "btn btn-primary";
  newButton.id = `level${selectedLevel}`;
  newButton.innerText = `${selectedLevel + 1}`;
  newButton.onclick = selectLevel;
  levelList.appendChild(newButton);
  updateCheckpointList();
}

function selectLevel() {
  selectedLevel = parseInt(this.id.match(/[0-9]+$/)[0]);
  unselectLevels();
  const levelList = document.getElementById("levels-list-buttons");
  levelList.children[selectedLevel].classList.add("btn-primary");
  levelList.children[selectedLevel].classList.remove("btn-secondary");
  updateCheckpointList();
}

function unselectLevels() {
  const levelList = document.getElementById("levels-list-buttons");
  for (let i = 0; i < levelList.children.length; i++) {
    levelList.children[i].classList.remove("btn-primary");
    levelList.children[i].classList.add("btn-secondary");
  }
}

function unselectCheckpoints() {
  const checkpointList = document.getElementById("checkpoint-list-buttons");
  for (let i = 0; i < checkpointList.children.length; i++) {
    checkpointList.children[i].classList.remove("btn-primary");
    checkpointList.children[i].classList.add("btn-secondary");
  }
}

function updateCheckpointList() {
  const checkpointList = document.getElementById("checkpoint-list-buttons");
  checkpointList.innerHTML = "";
  let nodes = [];
  for (let i = checkpointVectors[selectedLevel].length; i > 0; i--) {
    const checkpointBtn = document.createElement("button");
    checkpointBtn.className = "btn btn-secondary";
    checkpointBtn.id = `checkpoint${
      checkpointVectors[selectedLevel].length - i
    }`;
    checkpointBtn.innerText = `${
      checkpointVectors[selectedLevel].length - i + 1
    }`;
    checkpointBtn.onclick = selectCheckpoint; // TODO
    nodes.push(checkpointBtn);
  }
  checkpointList.append.apply(checkpointList, nodes);
}

function addCheckpoint() {
  let checkpointList = document.getElementById("checkpoint-list-buttons");

  const selected = checkpointVectors[selectedLevel].length;
  let checkpointBtn = document.createElement("button");
  checkpointBtn.className = "btn btn-secondary";
  checkpointBtn.id = `checkpoint${selected}`;
  checkpointBtn.innerText = `${selected}`;
  checkpointBtn.onclick = selectCheckpoint;
  checkpointList.appendChild(checkpointBtn);
}

function editCheckpoint(checkpoint) {
  checkpoint = parseInt(checkpoint);
}

function checkCheckpointModal() {
  if (selectedLevel < 0) {
    $("#error-modal").modal("show");
  } else {
    $("#checkpoint-modal").modal("show");
  }
}

function setCheckpointModal(selectedCheckpoint) {
  const vector = checkpointVectors[selectedLevel][selectedCheckpoint]
    .replace("Vector(", "")
    .replace(")", "")
    .split(", ");
  setModalVector("checkpointVectorX-edit", vector[0]);
  setModalVector("checkpointVectorY-edit", vector[1]);
  setModalVector("checkpointVectorZ-edit", vector[2]);
  setModalAbility(
    "ability-1-btn-edit",
    primeNumbers[selectedLevel][selectedCheckpoint] % 3 !== 0
  );
  setModalAbility(
    "ability-2-btn-edit",
    primeNumbers[selectedLevel][selectedCheckpoint] % 5 !== 0
  );
  setModalAbility(
    "primary-fire-btn-edit",
    primeNumbers[selectedLevel][selectedCheckpoint] % 2 !== 0
  );
}

function selectCheckpoint() {
  const selectedCheckpoint = parseInt(this.id.match(/[0-9]+$/)[0]) - 1;
  setCheckpointModal(selectedCheckpoint);
  const modal = document.getElementById("checkpoint-modal-edit").data;
  modal.dataset.checkpoint = `${selectedCheckpoint}`;
  $("#checkpoint-modal-edit").modal("show");
}
