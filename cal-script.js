function calMethod1(matrix) {
    const arr = matrix[1];
    let count = 0;

    if (arr.length >= 3 && !arr[0] && !arr[1] && arr[2]) count++;

    for (let i = 0; i <= arr.length - 4; i++) {
        if (arr[i] && !arr[i + 1] && !arr[i + 2] && arr[i + 3]) count++;
    }

    return count;
}

function calMethod2(matrix) {
    const arr = matrix[1];
    let count = 0;

    if (arr.length >= 4 && !arr[0] && !arr[1] && !arr[2] && arr[3]) count++;

    for (let i = 0; i <= arr.length - 5; i++) {
        if (arr[i] && !arr[i + 1] && !arr[i + 2] && !arr[i + 3] && arr[i + 4]) count++;
    }

    return count;
}

function countPatterns34(matrix, role) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let count = 0;

    const opposite = role === "player" ? "banker" : "player";

    if (
        rows > 1 && cols > 3 &&
        matrix[0][0] === role &&
        !matrix[1][0] &&
        !matrix[1][2] &&
        matrix[1][4] === role
    ) {
        count++;
    }

    if (
        rows > 1 && cols > 5 &&
        matrix[0][0] === opposite &&
        !matrix[1][1] &&
        !matrix[1][3] &&
        matrix[1][5] === role
    ) {
        count++;
    }

    for (let col = 6; col < cols; col++) {
        if (
            matrix[1][col] === role &&
            !matrix[1][col - 2] &&
            !matrix[1][col - 4] &&
            (
                matrix[1][col - 5] === opposite ||
                matrix[1][col - 6] === role
            )
        ) {
            count++;
        }
    }

    return count;
}

function calMethod3(matrix) {
    return countPatterns34(matrix, "player");
}

function calMethod4(matrix) {
    return countPatterns34(matrix, "banker");
}

function calMethod5(matrix) {
    let arr = matrix[1];
    return arr.reduce((count, val, i) =>
        val === "banker" && !arr[i + 1] && arr[i + 2] === "banker"
            ? count + 1
            : count, 0);
}

function countPatterns67(matrix, role) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    let count = 0;

    const opposite = role === "player" ? "banker" : "player";

    if (
        rows > 1 && cols > 6 &&
        matrix[0][0] === role &&
        !matrix[1][0] &&
        !matrix[1][2] &&
        !matrix[1][4] &&
        matrix[1][6] === role
    ) {
        count++;
    }

    if (
        rows > 1 && cols > 7 &&
        matrix[0][0] === opposite &&
        !matrix[1][1] &&
        !matrix[1][3] &&
        !matrix[1][5] &&
        matrix[1][7] === role
    ) {
        count++;
    }

    for (let col = 8; col < cols; col++) {
        if (
            matrix[1][col] === role &&
            !matrix[1][col - 2] &&
            !matrix[1][col - 4] &&
            !matrix[1][col - 6] &&
            (
                matrix[1][col - 7] === opposite ||
                matrix[1][col - 8] === role
            )
        ) {
            count++;
        }
    }

    return count;
}

function calMethod6(matrix) {
    return countPatterns67(matrix, "player");
}

function calMethod7(matrix) {
    return countPatterns67(matrix, "banker");
}

function countPatternFlexible(matrix, main, secondary) {
    let count = 0;
    let col = 0;
    const maxCol = matrix[0].length;

    while (col + 3 < maxCol) {
        if (
            matrix[0][col] === main &&
            matrix[1][col] === "" &&
            matrix[0][col + 1] === secondary &&
            matrix[0][col + 2] === main &&
            matrix[1][col + 2] === "" &&
            matrix[0][col + 3] !== ""
        ) {
            count++;
            col += 3;
        } else {
            col += 1;
        }
    }

    return count;
}

function calMethod8(matrix) {
    return countPatternFlexible(matrix, "player", "banker");
}

function calMethod9(matrix) {
    return countPatternFlexible(matrix, "banker", "player")
}
