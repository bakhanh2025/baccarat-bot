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
