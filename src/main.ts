// Function to handle form submission
function handleSubmit(event: Event) {
  event.preventDefault();

  const firstName = (document.getElementById("firstName") as HTMLInputElement)
    .value;
  const lastName = (document.getElementById("lastName") as HTMLInputElement)
    .value;
  const address = (document.getElementById("address") as HTMLSelectElement)
    .value;
  const dob = (document.getElementById("dob") as HTMLInputElement).value;
  const position = (document.getElementById("position") as HTMLSelectElement)
    .value;
  const jobTitle = (document.getElementById("jobTitle") as HTMLSelectElement)
    .value;
  const salary = (document.getElementById("salary") as HTMLInputElement).value;
  const married = (document.getElementById("married") as HTMLInputElement)
    .checked;

  const tableBody = document.querySelector(
    "#dataTable tbody"
  ) as HTMLTableSectionElement;
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
  const isEditMode = submitBtn.textContent === "Update";

  if (isEditMode) {
    const rowToEdit = document.querySelector(".editing") as HTMLTableRowElement;
    if (rowToEdit) {
      updateRow(
        rowToEdit,
        firstName,
        lastName,
        address,
        dob,
        position,
        jobTitle,
        salary,
        married
      );
      submitBtn.textContent = "Add";
      rowToEdit.classList.remove("editing");
    }
  } else {
    addRow(
      firstName,
      lastName,
      address,
      dob,
      position,
      jobTitle,
      salary,
      married
    );
  }

  saveToLocalStorage();
  (document.getElementById("addForm") as HTMLFormElement).reset();
  const modal = document.querySelector("#exampleModal") as HTMLElement;
  // const bsModal = bootstrap.Modal.getInstance(modal);
  // bsModal.hide();
}

// Function to add a new row
function addRow(
  firstName: string,
  lastName: string,
  address: string,
  dob: string,
  position: string,
  jobTitle: string,
  salary: string,
  married: boolean
) {
  const tableBody = document.querySelector(
    "#dataTable tbody"
  ) as HTMLTableSectionElement;
  const newRow = tableBody.insertRow();
  const rowIndex = tableBody.rows.length;

  newRow.innerHTML = `
        <td>${rowIndex}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${address}</td>
        <td>${dob}</td>
        <td>${position}</td>
        <td>${jobTitle}</td>
        <td>Job Description</td>
        <td>${salary}</td>
        <td>${married ? "Yes" : "No"}</td>
        <td>
            <button type="button" class="btn btn-info btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
    `;
}

// Function to update an existing row
function updateRow(
  row: HTMLTableRowElement,
  firstName: string,
  lastName: string,
  address: string,
  dob: string,
  position: string,
  jobTitle: string,
  salary: string,
  married: boolean
) {
  row.innerHTML = `
        <td>${row.rowIndex}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${address}</td>
        <td>${dob}</td>
        <td>${position}</td>
        <td>${jobTitle}</td>
        <td>Job Description</td>
        <td>${salary}</td>
        <td>${married ? "Yes" : "No"}</td>
        <td>
            <button class="btn btn-info btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
    `;
}

// Function to save table data to localStorage
function saveToLocalStorage() {
  const rows = document.querySelectorAll("#dataTable tbody tr");
  const data = Array.from(rows).map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      no: cells[0].textContent,
      firstName: cells[1].textContent,
      lastName: cells[2].textContent,
      address: cells[3].textContent,
      dob: cells[4].textContent,
      position: cells[5].textContent,
      jobTitle: cells[6].textContent,
      jobDescription: cells[7].textContent,
      salary: cells[8].textContent,
      married: cells[9].textContent,
    };
  });

  localStorage.setItem("tableData", JSON.stringify(data));
}

// Function to load table data from localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem("tableData");
  if (savedData) {
    const data = JSON.parse(savedData);
    const tableBody = document.querySelector(
      "#dataTable tbody"
    ) as HTMLTableSectionElement;
    data.forEach((item: any, index: number) => {
      const newRow = tableBody.insertRow();
      newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.firstName}</td>
                <td>${item.lastName}</td>
                <td>${item.address}</td>
                <td>${item.dob}</td>
                <td>${item.position}</td>
                <td>${item.jobTitle}</td>
                <td>${item.jobDescription}</td>
                <td>${item.salary}</td>
                <td>${item.married}</td>
                <td>
                    <button class="btn btn-info btn-sm edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                </td>
            `;
    });
  }
}

// Function to handle delete button click
function handleDelete(event: Event) {
  const target = event.target as HTMLButtonElement;
  if (target.classList.contains("delete-btn")) {
    const row = target.closest("tr");
    if (row) {
      row.remove();
      saveToLocalStorage();
    }
  }
}

// Function to handle edit button click
function handleEdit(event: Event) {
  const target = event.target as HTMLButtonElement;
  if (target.classList.contains("edit-btn")) {
    const row = target.closest("tr");
    if (row) {
      const cells = row.getElementsByTagName("td");
      (document.getElementById("firstName") as HTMLInputElement).value =
        cells[1].textContent || "";
      (document.getElementById("lastName") as HTMLInputElement).value =
        cells[2].textContent || "";
      (document.getElementById("address") as HTMLSelectElement).value =
        cells[3].textContent || "";
      (document.getElementById("dob") as HTMLInputElement).value =
        cells[4].textContent || "";
      (document.getElementById("position") as HTMLSelectElement).value =
        cells[5].textContent || "";
      (document.getElementById("jobTitle") as HTMLSelectElement).value =
        cells[6].textContent || "";
      (document.getElementById("salary") as HTMLInputElement).value =
        cells[8].textContent || "";
      (document.getElementById("married") as HTMLInputElement).checked =
        cells[9].textContent === "Yes";
      (document.getElementById("submitBtn") as HTMLButtonElement).textContent =
        "Update";
      (document.getElementById("submitBtn") as HTMLButtonElement).onclick =
        function () {
          handleSubmit(new Event("submit"));
        };
      row.classList.add("editing");
    }
  }
}

// Function to handle search input and filtering
function handleSearch() {
  const searchFirstNameInput = document.getElementById(
    "searchFirstName"
  ) as HTMLInputElement;
  const searchLastNameInput = document.getElementById(
    "searchLastName"
  ) as HTMLInputElement;
  const selectPosition = document.getElementById(
    "selectPosition"
  ) as HTMLSelectElement;
  const selectAddress = document.getElementById(
    "selectAddress"
  ) as HTMLSelectElement;
  const table = document.getElementById("dataTable") as HTMLTableElement;
  const tableBody = table.querySelector("tbody") as HTMLTableSectionElement;
  const rows = Array.from(tableBody.rows);

  function filterRows() {
    const searchFirstName = searchFirstNameInput.value.toLowerCase();
    const searchLastName = searchLastNameInput.value.toLowerCase();
    const selectedPosition = selectPosition.value;
    const selectedAddress = selectAddress.value;

    rows.forEach((row) => {
      const firstName = row.cells[1].textContent?.toLowerCase() || "";
      const lastName = row.cells[2].textContent?.toLowerCase() || "";
      const position = row.cells[5].textContent || "";
      const address = row.cells[3].textContent || "";

      const matchesFirstName = firstName.includes(searchFirstName);
      const matchesLastName = lastName.includes(searchLastName);
      const matchesPosition = selectedPosition
        ? position === selectedPosition
        : true;
      const matchesAddress = selectedAddress
        ? address === selectedAddress
        : true;

      row.style.display =
        matchesFirstName && matchesLastName && matchesPosition && matchesAddress
          ? ""
          : "none";
    });
  }

  searchFirstNameInput.addEventListener("input", filterRows);
  searchLastNameInput.addEventListener("input", filterRows);
  selectPosition.addEventListener("change", filterRows);
  selectAddress.addEventListener("change", filterRows);
}

// Initialize functionality
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
  submitBtn.addEventListener("click", handleSubmit);

  const tableBody = document.querySelector(
    "#dataTable tbody"
  ) as HTMLTableSectionElement;
  tableBody.addEventListener("click", handleEdit);
  tableBody.addEventListener("click", handleDelete);

  loadFromLocalStorage();
  handleSearch();
});
