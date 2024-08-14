"use strict";
function handleSubmit(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName")
        .value;
    const lastName = document.getElementById("lastName")
        .value;
    const address = document.getElementById("address")
        .value;
    const dob = document.getElementById("dob").value;
    const position = document.getElementById("position")
        .value;
    const jobTitle = document.getElementById("jobTitle")
        .value;
    const salary = document.getElementById("salary").value;
    const married = document.getElementById("married")
        .checked;
    const tableBody = document.querySelector("#dataTable tbody");
    const submitBtn = document.getElementById("submitBtn");
    const isEditMode = submitBtn.textContent === "Update";
    if (isEditMode) {
        const rowToEdit = document.querySelector(".editing");
        if (rowToEdit) {
            updateRow(rowToEdit, firstName, lastName, address, dob, position, jobTitle, salary, married);
            submitBtn.textContent = "Add";
            rowToEdit.classList.remove("editing");
        }
    }
    else {
        addRow(firstName, lastName, address, dob, position, jobTitle, salary, married);
    }
    saveToLocalStorage();
    document.getElementById("addForm").reset();
    const modal = document.querySelector("#exampleModal");
}
function addRow(firstName, lastName, address, dob, position, jobTitle, salary, married) {
    const tableBody = document.querySelector("#dataTable tbody");
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
function updateRow(row, firstName, lastName, address, dob, position, jobTitle, salary, married) {
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
function loadFromLocalStorage() {
    const savedData = localStorage.getItem("tableData");
    if (savedData) {
        const data = JSON.parse(savedData);
        const tableBody = document.querySelector("#dataTable tbody");
        data.forEach((item, index) => {
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
function handleDelete(event) {
    const target = event.target;
    if (target.classList.contains("delete-btn")) {
        const row = target.closest("tr");
        if (row) {
            row.remove();
            saveToLocalStorage();
        }
    }
}
function handleEdit(event) {
    const target = event.target;
    if (target.classList.contains("edit-btn")) {
        const row = target.closest("tr");
        if (row) {
            const cells = row.getElementsByTagName("td");
            document.getElementById("firstName").value =
                cells[1].textContent || "";
            document.getElementById("lastName").value =
                cells[2].textContent || "";
            document.getElementById("address").value =
                cells[3].textContent || "";
            document.getElementById("dob").value =
                cells[4].textContent || "";
            document.getElementById("position").value =
                cells[5].textContent || "";
            document.getElementById("jobTitle").value =
                cells[6].textContent || "";
            document.getElementById("salary").value =
                cells[8].textContent || "";
            document.getElementById("married").checked =
                cells[9].textContent === "Yes";
            document.getElementById("submitBtn").textContent =
                "Update";
            document.getElementById("submitBtn").onclick =
                function () {
                    handleSubmit(new Event("submit"));
                };
            row.classList.add("editing");
        }
    }
}
function handleSearch() {
    const searchFirstNameInput = document.getElementById("searchFirstName");
    const searchLastNameInput = document.getElementById("searchLastName");
    const selectPosition = document.getElementById("selectPosition");
    const selectAddress = document.getElementById("selectAddress");
    const table = document.getElementById("dataTable");
    const tableBody = table.querySelector("tbody");
    const rows = Array.from(tableBody.rows);
    function filterRows() {
        const searchFirstName = searchFirstNameInput.value.toLowerCase();
        const searchLastName = searchLastNameInput.value.toLowerCase();
        const selectedPosition = selectPosition.value;
        const selectedAddress = selectAddress.value;
        rows.forEach((row) => {
            var _a, _b;
            const firstName = ((_a = row.cells[1].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
            const lastName = ((_b = row.cells[2].textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
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
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", handleSubmit);
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.addEventListener("click", handleEdit);
    tableBody.addEventListener("click", handleDelete);
    loadFromLocalStorage();
    handleSearch();
});
