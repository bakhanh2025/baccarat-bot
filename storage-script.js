let roadmapDataKey = "roadmapDataKey";
let roadmapMatrixKey = "roadmapMatrixKey";
let resultKey = "resultKey";
let sumResultKey = "sumResultKey";

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
    sumResult = sumResultTemp ? JSON.parse(sumResultTemp) : new Array(9).fill(0);
}

function clearLocalStorage() {
    localStorage.removeItem(roadmapDataKey);
    localStorage.removeItem(roadmapMatrixKey);
    localStorage.removeItem(resultKey);
    localStorage.removeItem(sumResultKey);
}
