function create(choice) {
    if (choice == 0) {
        var odds = [];
        for (var i = 0; i < 13; i++) {
            odds[i] = ((Math.random() * 5.5) + 1)
            odds[i] = (odds[i] + 0.05 - odds[i] % 0.05).toFixed(2);
        }
        return odds;
    } else if (choice == 1) {
        var bets = [];
        var betChecker = Math.ceil(Math.random() * 3);
        if (betChecker == 1) {
            bets[0] = Math.floor(Math.random() * 13);
        } else if (betChecker == 2) {
            bets[0] = Math.floor(Math.random() * 3);
            bets[1] = Math.floor(Math.random() * 3);
            while (bets[0] == bets[1]) {
                bets[1] = Math.floor(Math.random() * 2);
            }
        } else {
            var complexChecker = Math.ceil((Math.random() * 10) + 1);
            for (var i = 0; i < complexChecker; i++) {
                var temp = Math.floor(Math.random() * 13);
                while (bets.indexOf(temp) > -1) {
                    temp = Math.floor(Math.random() * 13);
                }
                bets[i] = temp;
            }
        }
        return bets.sort(function (a, b) { return a - b });
    }
    var teams = ["AFC", "Bournemouth", "Arsenal", "Brighton", "Hove", "Albion", "Burnley", "Chelsea", "Crystal", "Palace",
        "Everton", "Huddersfield", "Town", "Leicester", "City", "Liverpool", "Manchester", "United", "Newcastle", "Southampton",
        "Stoke", "Swansea", "Tottenham", "Hotspur", "Watford", "Bromwich", "West", "Ham", "Scottish", "Premiership", "Aberdeen",
        "Celtic", "Dundee", "Hamilton", "Academical", "Heart", "Midlothian", "Hibernian", "Kilmarnock", "Motherwell", "Partick",
        "Thistle", "Rangers", "Ross", "County", "Johnstone", "Championship", "Aston", "Villa", "Barnsley", "Birmingham", "Bolton",
        "Wanderers", "Brentford", "Bristol", "Burton", "Cardiff", "Derby", "Fulham", "Hull", "Ipswich", "Leeds", "Middlesbrough",
        "Millwall", "Norwich", "Nottingham", "Forest", "Preston", "North", "End", "Queens", "Park", "Reading", "Sheffield",
        "Wednesday", "Sunderland", "Wolverhampton"];
    var team1 = teams[Math.floor(Math.random() * teams.length)];
    var team2 = teams[Math.floor(Math.random() * teams.length)];
    while (team1 == team2) {
        team2 = teams[Math.floor(Math.random() * teams.length)];
    }
    var text = team1 + " - " + team2;
    while (text.length < 30) {
        text += " ";
    }
    return text;
}
function gameGenerator() {
    this.odds = create(0);
    this.bets = create(1);
    this.teams = create(2);
    this.mbs = Math.ceil(Math.random() * 4);
    this.isBank = (Math.round(Math.random())) ? true : false;
}
var fs = require("fs");
deleteTxt();
var resultSTR = "";
function writeTxt(str) {
    fs.appendFile('Coupons.txt', str, function (err) {
        if (err) throw err;
        console.log(str);
    });
}
function deleteTxt() {
    fs.unlink('Coupons.txt', function (err) {
        if (err) throw err;
    });
}
function coupon(teams, bets, isBank, mbs, odds) {
    this.teams = teams;
    this.bets = bets;
    this.mbs = mbs;
    this.isBank = isBank;
    this.odds = odds;
}

function couponCalculation(games, data, start, end, index, combination) {
    var couponOdd = 1;
    var maxOdd;
    if (index == combination) {
        resultSTR += ("  |  Bank  |  Teams                           | Bet            | Mbs          | Odd\r\n");
        for (var i = 0; i < bank.length; i++) {
            resultSTR += (i + 1 + ".    ✔       " + bank[i].teams + "       bet:  " + bank[i].bets[0] +
                "          mbs: " + bank[i].mbs + "         odd: " + bank[i].odds[bank[i].bets[0]] + "\r\n");
            if (bank[i].bets.length > 1) {
                resultSTR += ("      ✔       " + bank[i].teams + "       bet:  " + bank[i].bets[1] +
                    "          mbs: " + bank[i].mbs + "         odd: " + bank[i].odds[bank[i].bets[1]] + "\r\n");
                couponOdd *= Math.max(bank[i].odds[bank[i].bets[0]], bank[i].odds[bank[i].bets[1]]);
                continue;
            }
            couponOdd *= bank[i].odds[bank[i].bets[0]];
        }
        for (var i = 0; i < combination; i++) {
            resultSTR += (i + bankCounter + 1 + ".    ✕       " + data[i].teams + "       bet:  " + data[i].bets[0] +
                "          mbs: " + data[i].mbs + "         odd: " + data[i].odds[data[i].bets[0]] + "\r\n");
            if (data[i].bets.length > 1) {
                resultSTR += ("      ✕       " + data[i].teams + "       bet:  " + data[i].bets[1] +
                    "          mbs: " + data[i].mbs + "         odd: " + data[i].odds[data[i].bets[1]] + "\r\n");
                couponOdd *= Math.max(data[i].odds[data[i].bets[0]], data[i].odds[data[i].bets[1]]);
                continue;
            }
            couponOdd *= data[i].odds[data[i].bets[0]];
        }
        couponCounter++;
        totalOdd += couponOdd;
        resultSTR += ("\r\nCoupon Odd: " + couponOdd.toFixed(2) +
            "\r\n\--------------------------------------------------------------------------------------\r\n\r\n");
        return;
    }
    for (var i = start; i <= end && end - i + 1 >= combination - index; i++) {
        data[index] = games[i];
        couponCalculation(games, data, i + 1, end, index + 1, combination);
    }
}

var games = [];
var bank = [];
var system = [];
var totalOdd = 0;
var couponCounter = 0;
var gameCounter = 0;
var bankCounter = 0;
var maxMbsChecker = 0;
var minMbsChecker = 4;
var minMbsCounter = 0;
var maxBankMbsChecker = 0;
var minBankMbsChecker = 4;
var minBankMbsCounter = 0;
var notComplex = true;

for (var i = 0; i < 5; i++) {
    games[i] = new gameGenerator();
    system[i] = (Math.round(Math.random())) ? true : false;
    if (games[i].bets.length > 2) {
        gameCounter += games[i].bets.length;
    } else {
        gameCounter++;
    }
    if (gameCounter > 30) {
        gameCounter -= games[i].bets.length;
        i--;
        continue;
    }
    for (var j = 0; j < games[i].bets.length; j++) {
        resultSTR += (games[i].teams + "       bet:  " + games[i].bets[j] + "       bank:  " + games[i].isBank +
            "          mbs: " + games[i].mbs + "         odd: " + games[i].odds[games[i].bets[j]] + "\r\n");
    }
    resultSTR += "\r\n\r\n";
}

for (var i = 0; i < games.length; i++) {
    if (games[i].mbs > maxMbsChecker) {
        maxMbsChecker = games[i].mbs;
    }

    if (games[i].mbs < minMbsChecker) {
        minMbsChecker = games[i].mbs;
        minMbsCounter = 1;
    } else if (games[i].mbs == minMbsChecker) {
        minMbsCounter++;
    }

    if (games[i].bets.length > 2 || (games[i].bets.length == 2 && (games[i].bets[0] > 2 || games[i].bets[1] > 2))) {
        notComplex = false;
        for (var j = 0; j < games[i].bets.length; j++) {
            games[games.length] = new gameGenerator();
            games[games.length - 1].teams = games[i].teams;
            games[games.length - 1].bets = (games[i].bets[j] + "").split(" ");
            games[games.length - 1].mbs = games[i].mbs;
            games[games.length - 1].isBank = false;
            games[games.length - 1].odds = games[i].odds;
        }
        games.splice(i, 1);
        i--;
    } else if (games[i].isBank) {
        if (games[i].mbs > maxBankMbsChecker) {
            maxBankMbsChecker = games[i].mbs;
        }
        if (games[i].mbs < minBankMbsChecker) {
            minBankMbsChecker = games[i].mbs;
            minBankMbsCounter = 1;
        } else if (games[i].mbs == minBankMbsChecker) {
            minBankMbsCounter++;
        }
        bank[bankCounter++] = games[i];
        games.splice(i, 1);
        i--;
    }
}

if (!notComplex) {
    for (var i = 0; i < system.length; i++) {
        system[i] = false;
    }
    if (minBankMbsChecker <= minBankMbsCounter || bankCounter >= maxMbsChecker - 1) {
        system[bankCounter] = true;
        if (bankCounter >= maxBankMbsChecker || minBankMbsChecker == 1) {
            system[bankCounter - 1] = true;
        }
    }
}

if ((maxMbsChecker > games.length + bankCounter || !notComplex) && minMbsChecker <= minMbsCounter) {
    if (notComplex) {
        maxMbsChecker = games.length + bankCounter;
    } else {
        maxMbsChecker = minMbsChecker;
    }
}

if (minBankMbsChecker <= minBankMbsCounter && notComplex) {
    maxMbsChecker = bankCounter;
}

for (var i = maxMbsChecker - 1; i < system.length; i++) {
    if (system[i] && !(i + 1 < bankCounter) && (notComplex || bankCounter >= minMbsChecker - 1)) {
        var data = [];
        couponCalculation(games, data, 0, games.length - 1, 0, i - bankCounter + 1);
        resultSTR += ("Coupons with " + (i + 1) + " games:  " + couponCounter +
            "\r\n\r\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\r\n\r\n");
        couponCounter = 0;
    }
}
resultSTR += ("Total Odd:    " + totalOdd.toFixed(2) + "\r\n\r\n\r\n");
writeTxt(resultSTR);