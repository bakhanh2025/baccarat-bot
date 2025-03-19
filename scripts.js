let roadmapCount;
let roadmapData = {};
let roadmapMatrix = {};

$(document).ready(function () {
    init();
});

function init() {
    loadLocalStorage();
    renderRoadmapFromLocalStorage();
}

$(document).on("click", "#check-roadmap", function () {
    console.log(roadmapData);
    console.log(roadmapMatrix);
});

$(document).on("click", "#add-roadmap", function () {
    roadmapCount = $("#txtIndexTable").val();
    if (!roadmapCount) {
        alert("Vui lòng nhập tên bàn");
        return;
    }
    if (roadmapCount in roadmapData) {
        alert("Tên bàn đã tồn tại. Vui lòng nhập tên khác");
        return;
    }
    $("#txtIndexTable").val("");

    roadmapData[roadmapCount] = [];
    roadmapMatrix[roadmapCount] = [];
    addHTMLRoadMap(roadmapCount);
});

function addHTMLRoadMap(roadmapCount) {
    let roadmapHtml = `
            <div class="roadmap" id="roadmap-${roadmapCount}">
                <div class="header-card">
                    <h6>Bàn ${roadmapCount}</h6>
                    <div class="action-bnt-gr">
                        <div class="del-btn-gr">
                            <button class="btn btn-danger btn-sm" onclick="deleteTable('${roadmapCount}')">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button class="btn btn-warning btn-sm del-last-cell" data-id="${roadmapCount}">
                                <i class="bi bi-backspace"></i>
                            </button>
                        </div>
                        <div>
                            <button class="btn btn-primary btn-sm add-cell" data-type="player" data-id="${roadmapCount}">Player</button>
                            <button class="btn btn-danger btn-sm add-cell" data-type="banker" data-id="${roadmapCount}">Banker</button>
                            <button class="btn btn-success btn-sm add-cell" data-type="tier" data-id="${roadmapCount}">Tier</button>
                        </div>
                    </div>
                </div>
                <div class="map-container">
                  <div class="map-box1 roadmap-view d-flex" id="roadmap-view-${roadmapCount}" data-id="${roadmapCount}"></div>
                  <div class="map-box2" id="roadmap-container-matrix-${roadmapCount}"></div>
                </div>
            </div>`;
    $("#roadmaps").append(roadmapHtml);
}

$(document).on("click", ".del-last-cell", function () {
    let roadmapId = $(this).data("id");

    roadmapData[roadmapId].pop();
    roadmapMatrix[roadmapId] = convertToMatrix(
        roadmapData[roadmapId].map((cell) => cell.type)
    );
    saveLocalStorage();

    $(`#roadmap-view-${roadmapId}`).empty();
    $(`#roadmap-container-matrix-${roadmapId}`).empty();

    roadmapData[roadmapId].forEach((item) => {
        renderRoadmapCell(roadmapId, item.type);
    });
    renderRoadmap(roadmapId, roadmapMatrix[roadmapId]);
});

$(document).on("click", ".add-cell", function () {
    let type = $(this).data("type");
    let roadmapId = $(this).data("id");

    renderRoadmapCell(roadmapId, type);

    roadmapData[roadmapId].push({ type: type });
    roadmapMatrix[roadmapId] = convertToMatrix(
        roadmapData[roadmapId].map((cell) => cell.type)
    );
    saveLocalStorage();
    renderRoadmap(roadmapId, roadmapMatrix[roadmapId]);
});

function renderRoadmapCell(roadmapId, type) {
    let roadmapView = $(`#roadmap-${roadmapId} .roadmap-view`);
    let lastColumn = roadmapView.children().last();
    if (lastColumn.length === 0 || lastColumn.children().length >= 6) {
        lastColumn = $('<div class="roadmap-column"></div>');
        roadmapView.append(lastColumn);
    }

    let newCell = $(
        `<div class="cell ${type}" data-type="${type}" data-id="${roadmapId}" tabindex="0">${type
            .charAt(0)
            .toUpperCase()}</div>`
    );
    lastColumn.append(newCell);
}

function convertToMatrix(data, rows = 6) {
    let matrix = [];
    let currentColumn = [];

    for (let i = 0; i < data.length; i++) {
        if (currentColumn.length < rows) {
            // Nếu cột chưa đầy, tiếp tục thêm giá trị
            currentColumn.push(data[i]);
        }

        if (
            currentColumn.length === rows ||
            i === data.length - 1 ||
            data[i] !== data[i + 1]
        ) {
            // Nếu cột đã đầy, hoặc item tiếp theo khác item hiện tại, push cột vào matrix
            while (currentColumn.length < rows) {
                currentColumn.push(""); // Đệm các ô trống nếu thiếu
            }
            matrix.push(currentColumn);
            currentColumn = []; // Reset cột mới
        }
    }

    // Chuyển từ danh sách cột sang danh sách hàng
    let resultMatrix = [];
    for (let row = 0; row < rows; row++) {
        let newRow = matrix.map((col) => col[row] || ""); // Lấy từng hàng từ các cột
        resultMatrix.push(newRow);
    }

    return resultMatrix;
}

function renderRoadmap(index, matrix) {
    let container = document.getElementById(
        `roadmap-container-matrix-${index}`
    );
    container.innerHTML = ""; // Xóa nội dung cũ

    let table = document.createElement("table");
    let tbody = document.createElement("tbody");

    matrix.forEach((row) => {
        let tr = document.createElement("tr");
        row.forEach((cell) => {
            let td = document.createElement("td");
            if (cell) {
                let circle = document.createElement("div");
                circle.classList.add("circle", getColorClass(cell));
                td.appendChild(circle);
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

$(document).on("click", "#delete-all", function () {
    Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            clearLocalStorage();
            location.reload();
        }
    });
});

function deleteTable(indexTable) {
    Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy"
    }).then((result) => {
        if (result.isConfirmed) {
            delete roadmapData[indexTable];
            delete roadmapMatrix[indexTable];
            saveLocalStorage();
            $(`#roadmap-${indexTable}`).remove();
        }
    });
}

//   $(document).on("click", ".cell", function (event) {
//     let currentCell = $(this);
//     let roadmapId = currentCell.data("id");

//     $(".custom-popover").remove();

//     let popoverContent = `
//         <div class="custom-popover">
//             <select class="form-control edit-result">
//                 <option value="player">Player</option>
//                 <option value="banker">Banker</option>
//                 <option value="tier">Tier</option>
//             </select>
//             <button class="btn btn-success btn-sm mt-2 save-edit">Lưu</button>
//             <button class="btn btn-danger btn-sm mt-2 delete-cell">Xóa</button>
//         </div>`;

//     $("body").append(popoverContent);
//     let popover = $(".custom-popover");

//     let offset = currentCell.offset();
//     popover.css({
//       top: offset.top + currentCell.outerHeight(),
//       left: offset.left,
//       position: "absolute",
//       background: "white",
//       padding: "10px",
//       border: "1px solid #ccc",
//       "border-radius": "5px",
//       "box-shadow": "0px 4px 6px rgba(0, 0, 0, 0.1)",
//     });

//     $(document).on("click", ".save-edit", function () {
//       let newResult = popover.find(".edit-result").val();
//       let newText = newResult.charAt(0).toUpperCase();

//       let cellIndex = currentCell.index();
//       if (roadmapData[roadmapId] && roadmapData[roadmapId][cellIndex]) {
//         roadmapData[roadmapId][cellIndex].type = newResult;
//       }

//       currentCell
//         .removeClass("player banker tier")
//         .addClass(newResult)
//         .text(newText);
//       popover.remove();
//     });

//     $(document).on("click", ".delete-cell", function () {
//       let cellIndex = currentCell.index();
//       if (roadmapData[roadmapId]) {
//         roadmapData[roadmapId].splice(cellIndex, 1);
//       }
//       currentCell.remove();
//       popover.remove();
//     });

//     $(document).on("click", function (event) {
//       if (!$(event.target).closest(".custom-popover, .cell").length) {
//         popover.remove();
//       }
//     });

//     event.stopPropagation();
//   });

function renderRoadmapFromLocalStorage() {
    for (key in roadmapData) {
        addHTMLRoadMap(key);
        roadmapData[key].forEach((item) => {
            renderRoadmapCell(key, item.type);
        });
        renderRoadmap(key, roadmapMatrix[key]);
    }
}

let roadmapDataKey = "roadmapDataKey";
let roadmapMatrixKey = "roadmapMatrixKey";
function saveLocalStorage() {
    localStorage.setItem(roadmapDataKey, JSON.stringify(roadmapData));
    localStorage.setItem(roadmapMatrixKey, JSON.stringify(roadmapMatrix));
}

function loadLocalStorage() {
    let roadmapDataTemp = localStorage.getItem(roadmapDataKey);
    if (roadmapDataTemp) roadmapData = JSON.parse(roadmapDataTemp);

    let roadmapMatrixTemp = localStorage.getItem(roadmapMatrixKey);
    if (roadmapMatrixTemp) roadmapMatrix = JSON.parse(roadmapMatrixTemp);
}

function clearLocalStorage() {
    localStorage.removeItem(roadmapDataKey);
    localStorage.removeItem(roadmapMatrixKey);
}

function getColorClass(type) {
    return type === "player"
        ? "circle-player"
        : type === "banker"
            ? "circle-banker"
            : type === "tier"
                ? "circle-tier"
                : "";
}

document.head.insertAdjacentHTML(
    "beforeend",
    `
            <style>
                .circle {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: inline-block;
                }
                .circle-player { border: 2px solid blue; background-color: #FFFFFF; }
                .circle-banker { border: 2px solid red; background-color: #FFFFFF; }
                .circle-tier { border: 2px solid #146c43; background-color: #FFFFFF; }
                .table td {
                    width: 40px;
                    height: 40px;
                    vertical-align: middle;
                }
            </style>
        `
);