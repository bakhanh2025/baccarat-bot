let roadmapCount;
let roadmapData = {};
let roadmapMatrix = {};
let result = {};
let sumResult = [];

let labels = {
    0: "2 lỗ đóng lại",
    1: "3 lỗ đóng lại",
    2: "3 Xanh đóng lại",
    3: "3 Đỏ đóng lại",
    4: "Đỏ 1 lỗ",
    5: "Xanh 4 đóng",
    6: "Đỏ 4 đóng",
    7: "2 Xanh trượt",
    8: "2 Đỏ trượt"
}

$(document).ready(function () {
    init();
});

function init() {
    loadLocalStorage();
    displayTotalTable();
    renderRoadmapFromLocalStorage();
    displayResult();
}

$(document).on("click", "#check-roadmap", function () {
    console.log(JSON.stringify(roadmapMatrix[1]));
    calMethod1(roadmapMatrix[1]);
    calMethod2(roadmapMatrix[1]);
    console.log(JSON.stringify(result));
    console.log(sumResult);
    // sendMessage('Hello Test');
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

    result[roadmapCount] = new Array(9);
    roadmapData[roadmapCount] = [];
    roadmapMatrix[roadmapCount] = [];
    addHTMLRoadMap(roadmapCount);
    saveLocalStorage();
    displayTotalTable();
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
                        </div>
                    </div>
                </div>
                <div class="map-container mt20">
                  <div class="map-box2" id="roadmap-container-matrix-${roadmapCount}"></div>
                </div>
            </div>`;
    $("#roadmaps").append(roadmapHtml);
}

$(document).on("click", ".add-cell", function () {
    let type = $(this).data("type");
    let roadmapId = $(this).data("id");

    renderRoadmapCell(roadmapId, type);

    roadmapData[roadmapId].push({ type: type });
    roadmapMatrix[roadmapId] = convertToMatrix(
        roadmapData[roadmapId].map((cell) => cell.type)
    );
    renderRoadmap(roadmapId, roadmapMatrix[roadmapId]);

    calMatrix(roadmapId);
    sumMatrix();
    displayResult();

    saveLocalStorage();
});

$(document).on("click", ".del-last-cell", function () {
    let roadmapId = $(this).data("id");

    roadmapData[roadmapId].pop();
    roadmapMatrix[roadmapId] = convertToMatrix(
        roadmapData[roadmapId].map((cell) => cell.type)
    );

    $(`#roadmap-view-${roadmapId}`).empty();
    $(`#roadmap-container-matrix-${roadmapId}`).empty();

    roadmapData[roadmapId].forEach((item) => {
        renderRoadmapCell(roadmapId, item.type);
    });
    renderRoadmap(roadmapId, roadmapMatrix[roadmapId]);

    calMatrix(roadmapId);
    sumMatrix();
    displayResult();

    saveLocalStorage();
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
            clearAllResult();
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
    }).then((resultObj) => {
        if (resultObj.isConfirmed) {
            delete roadmapData[indexTable];
            delete roadmapMatrix[indexTable];
            delete result[indexTable];
            sumMatrix();
            displayResult();
            saveLocalStorage();
            displayTotalTable();
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

function clearAllResult() {
    for (let i = 0; i < 9; i++) {
        $(`#val${i}`).text("0");
    }
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

function calMatrix(roadmapIndex) {
    let count = calMethod1(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][0] = count;

    count = calMethod2(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][1] = count;

    count = calMethod3(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][2] = count;

    count = calMethod4(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][3] = count;

    count = calMethod5(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][4] = count;

    count = calMethod6(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][5] = count;

    count = calMethod7(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][6] = count;

    count = calMethod8(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][7] = count;

    count = calMethod9(roadmapMatrix[roadmapIndex]);
    result[roadmapIndex][8] = count;
}

function sumMatrix() {
    const rows = Object.values(result);
    if (!rows[0]) rows[0] = new Array(9);

    const numCols = rows[0].length;

    const colSums = Array(numCols).fill(0);

    for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < rows.length; row++) {
            const value = rows[row][col];
            if (typeof value === 'number') {
                colSums[col] += value;
            }
        }
    }

    console.log("Tổng từng cột:", colSums);
    sumResult = colSums;
    return sumResult;
}

function displayResult() {
    let sortedResult = buildOrderResult();
    $(".result").empty();
    for (let i = 0; i < sortedResult.length; i++) {
        const element = sortedResult[i];
        let html = `<div class="result-item">
                        <label class="lbl">${i + 1}/ ${labels[element.key]}</label>
                        <label class="lbl-result" id="val0">${element.value}</label>
                        <label>(lần)</label>
                    </div>`;
        $(".result").append(html);
    }
}

function buildOrderResult() {
    let orderResult = [];
    for (let i = 0; i < sumResult.length; i++) {
        orderResult.push({
            key: i,
            value: sumResult[i]
        })
    }
    const sortedDesc = orderResult.sort((a, b) => b.value - a.value);
    return sortedDesc;
}

function calMethod1(matrix) {
    let count = 0;
    let patternPositions = [];

    for (let col = 0; col < matrix[0].length - 1; col++) {
        const top1 = matrix[0][col];
        const top2 = matrix[0][col + 1];
        const bot1 = matrix[1][col];
        const bot2 = matrix[1][col + 1];

        const hasTopPrev = col > 0;
        const hasTopNext = col + 2 < matrix[0].length;

        const topPrev = hasTopPrev ? matrix[0][col - 1] : null;
        const botPrev = hasTopPrev ? matrix[1][col - 1] : null;

        const topNext = hasTopNext ? matrix[0][col + 2] : null;
        const botNext = hasTopNext ? matrix[1][col + 2] : null;

        const cond1 = top1 !== "" && top2 !== "";
        const cond2 = bot1 === "" && bot2 === "";
        const cond3 = !hasTopNext || (topNext !== "" && botNext !== "");
        const cond4 = !hasTopPrev || (topPrev !== "" && botPrev !== "");

        if (cond1 && cond2 && cond3 && cond4) {
            count++;
            patternPositions.push(col);
        }
    }

    console.log("Số pattern thỏa điều kiện:", count);
    console.log("Vị trí bắt đầu (col):", patternPositions);

    return count;
}

function calMethod2(matrix) {
    // Đếm pattern 3 cột liên tiếp thỏa điều kiện
    let count = 0;
    let patternPositions = [];

    for (let col = 0; col < matrix[0].length - 2; col++) {
        // Kiểm tra có phần tử trước/sau không
        const hasTopPrev = col > 0;
        const hasTopNext = col + 3 < matrix[0].length;

        // Lấy giá trị
        const top1 = matrix[0][col];
        const top2 = matrix[0][col + 1];
        const top3 = matrix[0][col + 2];
        const bot1 = matrix[1][col];
        const bot2 = matrix[1][col + 1];
        const bot3 = matrix[1][col + 2];

        const topPrev = hasTopPrev ? matrix[0][col - 1] : null;
        const botPrev = hasTopPrev ? matrix[1][col - 1] : null;

        const topNext = hasTopNext ? matrix[0][col + 3] : null;
        const botNext = hasTopNext ? matrix[1][col + 3] : null;

        // Điều kiện
        const cond1 = top1 !== "" && top2 !== "" && top3 !== "";
        const cond2 = bot1 === "" && bot2 === "" && bot3 === "";
        const cond3 = !hasTopNext || (topNext !== "" && botNext !== "");
        const cond4 = !hasTopPrev || (topPrev !== "" && botPrev !== "");

        if (cond1 && cond2 && cond3 && cond4) {
            count++;
            patternPositions.push(col);
        }
    }

    console.log("Số pattern (3 cột liên tiếp) thỏa điều kiện:", count);
    console.log("Vị trí bắt đầu (col):", patternPositions);
    return count;
}

function count3Pattern(matrix, pattern, finalValue) {
    let count = 0;
    const length = pattern.length;

    for (let col = 0; col <= matrix[0].length - length; col++) {
        const mainRowMatches = pattern.every((value, i) => matrix[0][col + i] === value);
        const secondRowEmpty = pattern.slice(0, length - 1).every((_, i) => matrix[1][col + i] === "");
        const lastSecondRowMatch = matrix[1][col + length - 1] === finalValue;

        if (mainRowMatches && secondRowEmpty && lastSecondRowMatch) {
            count++;
        }
    }

    return count;
}

function calMethod3(matrix) {
    const playerPattern = ["player", "banker", "player", "banker", "player"];
    const playerCount = count3Pattern(matrix, playerPattern, "player");
    return playerCount;
}

function calMethod4(matrix) {
    const bankerPattern = ["banker", "player", "banker", "player", "banker"];
    const bankerCount = count3Pattern(matrix, bankerPattern, "banker");
    return bankerCount;

}

function calMethod5(matrix) {
    let count = 0;
    return count;
}

function calMethod6(matrix) {
    let count = 0;
    return count;
}

function calMethod7(matrix) {
    let count = 0;
    return count;
}

function calMethod8(matrix) {
    let count = 0;
    return count;
}

function calMethod9(matrix) {
    let count = 0;
    return count;
}

function sendMessageToTelegram() {
    let sortedResult = buildOrderResult();
    let message = `Tổng số bàn: ${Object.keys(roadmapData).length} (bàn)`;
    for (let i = 0; i < sortedResult.length; i++) {
        const element = sortedResult[i];
        message += `\n${i + 1}/ ${labels[element.key]}: ${element.value} (lần)`;
    }
    sendMessage(message);
}

function sendMessage(message) {
    var botToken = "7979510335:AAGHSa1HX8fjU5sGsEmNKfQCkYYFME_wqm0";
    var chatId = "-1002575025787";

    var url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    $.ajax({
        url: url,
        method: "POST",
        data: {
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        },
        success: function (response) {
            Swal.fire({
                title: "Good job!",
                text: "Tin nhắn đã gửi!",
                icon: "success"
            });
        },
        error: function (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Không thể gửi tin nhắn! Vui lòng thử lại."
            });
            console.error("Lỗi gửi tin nhắn!", error);
        }
    });
}

let roadmapDataKey = "roadmapDataKey";
let roadmapMatrixKey = "roadmapMatrixKey";
let resultKey = "resultKey";
let sumResultKey = "sumResultKey";

function renderRoadmapFromLocalStorage() {
    for (key in roadmapData) {
        addHTMLRoadMap(key);
        roadmapData[key].forEach((item) => {
            renderRoadmapCell(key, item.type);
        });
        renderRoadmap(key, roadmapMatrix[key]);
        if (!result[key]) result[key] = new Array(9)
    }
}

function saveLocalStorage() {
    localStorage.setItem(roadmapDataKey, JSON.stringify(roadmapData));
    localStorage.setItem(roadmapMatrixKey, JSON.stringify(roadmapMatrix));
    localStorage.setItem(resultKey, JSON.stringify(result));
    localStorage.setItem(sumResultKey, JSON.stringify(sumResult));
}

function loadLocalStorage() {
    let roadmapDataTemp = localStorage.getItem(roadmapDataKey);
    if (roadmapDataTemp) roadmapData = JSON.parse(roadmapDataTemp);

    let roadmapMatrixTemp = localStorage.getItem(roadmapMatrixKey);
    if (roadmapMatrixTemp) roadmapMatrix = JSON.parse(roadmapMatrixTemp);

    let resultTemp = localStorage.getItem(resultKey);
    if (resultTemp) result = JSON.parse(resultTemp);

    let sumResultTemp = localStorage.getItem(sumResultKey);
    if (sumResultTemp) sumResult = JSON.parse(sumResultTemp);
}

function clearLocalStorage() {
    localStorage.removeItem(roadmapDataKey);
    localStorage.removeItem(roadmapMatrixKey);
    localStorage.removeItem(resultKey);
    localStorage.removeItem(sumResultKey);
}

function displayTotalTable() {
    $('.lblTotalTable').text(Object.keys(roadmapData).length);
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
