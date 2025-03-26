function calMethod1(matrix) {
    const row0 = matrix[0];
    const row1 = matrix[1];
    const limit = row0.length - 2;
    let count = 0;

    for (let col = 0; col < limit; col++) {
        if (
            row0[col] !== "" && row1[col] === "" &&
            row0[col + 1] !== "" && row1[col + 1] === "" &&
            row0[col + 2] !== "" && row1[col + 2] !== ""
        ) {
            count++;
        }
    }

    return count;
}

function calMethod2(matrix) {
    const row0 = matrix[0];
    const row1 = matrix[1];
    const limit = row0.length - 3;
    let count = 0;

    for (let col = 0; col < limit; col++) {
        if (
            row0[col] !== "" && row1[col] === "" &&
            row0[col + 1] !== "" && row1[col + 1] === "" &&
            row0[col + 2] === "" && row1[col + 2] === "" &&
            row0[col + 3] !== "" && row1[col + 3] !== ""
        ) {
            count++;
        }
    }

    return count;
}

function countPattern(matrix, pattern, finalValue) {
    let count = 0;
    const length = pattern.length;

    for (let col = 0; col <= matrix[0].length - length; col++) {
        const mainRowMatches = pattern.every((value, i) => matrix[0][col + i] === value);

        const secondRowCondition = pattern.every((value, i) => {
            if (value === finalValue) {
                if (i === pattern.length - 1) {
                    return matrix[1][col + i] === finalValue;
                } else {
                    return matrix[1][col + i] === "";
                }
            }
            return true;
        });

        if (mainRowMatches && secondRowCondition) {
            count++;
        }
    }

    return count;
}

function calMethod3(matrix) {
    const playerPattern = ["player", "banker", "player", "banker", "player"];
    const playerCount = countPattern(matrix, playerPattern, "player");
    return playerCount;
}

function calMethod4(matrix) {
    const bankerPattern = ["banker", "player", "banker", "player", "banker"];
    const bankerCount = countPattern(matrix, bankerPattern, "banker");
    return bankerCount;

}

function calMethod5(matrix) {
    let count = 0;
    let col = 0;
    const maxCol = matrix[0].length;

    while (col + 2 < maxCol) {
        if (
            matrix[0][col] === "banker" &&
            matrix[1][col] === "banker" &&
            matrix[0][col + 1] === "player" &&
            matrix[0][col + 2] === "banker" &&
            matrix[1][col + 2] === "banker"
        ) {
            count++;
            col += 3; // Skip next 2 to avoid overlapping
        } else {
            col += 1;
        }
    }
    return count;
}

function calMethod6(matrix) {
    const playerPattern = ["player", "banker", "player", "banker", "player", "banker", "player"];
    const playerCount = countPattern(matrix, playerPattern, "player");
    return playerCount;
}

function calMethod7(matrix) {
    const bankerPattern = ["banker", "player", "banker", "player", "banker", "player", "banker"];
    const bankerCount = countPattern(matrix, bankerPattern, "banker");
    return bankerCount;
}

function countPatternFlexible(matrix, main, secondary) {
    let count = 0;
    let col = 0;
    const maxCol = matrix[0].length;

    while (col + 2 < maxCol) {
        if (
            matrix[0][col] === main &&
            matrix[1][col] === "" &&
            matrix[0][col + 1] === secondary &&
            matrix[0][col + 2] === main &&
            matrix[1][col + 2] === ""
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
