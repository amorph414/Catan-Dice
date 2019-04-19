var myChart = document.getElementById("myChart").getContext('2d');

var expectNumArray = Array(11);
expectNumArray.fill("00");
var turn = 0;

var dataLabelPlugin = {
    afterDatasetsDraw: function (chart, easing) {
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach(function (element, index) {
                    ctx.fillStyle = 'rgb(50, 55, 55)';

                    var fontSize = 25;
                    var fontStyle = 'normal';
                    var fontFamily = 'Helvetica Neue';
                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                    var dataString = dataset.data[index].toString();
                    var expectNum =  numeral((index+2 < 8) ? (index+1)*turn/36 : (13-index-2)*turn/36).format('0.0'); //Expected number of occurrences
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    var padding = 5;
                    var position = element.tooltipPosition();
                    ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                    ctx.fillText("("+expectNum+")", position.x, position.y - (fontSize*3 / 2) - padding); //display expected number onto apperance num
                })
            }
        })
    }
}; //To display result numbers and expected result numbers above chart bars

var diceRecord = [];
var histogramArray = Array(11);
histogramArray.fill(0);
var turn = 0;
const LASTRESULTNUM = 8;
var showhistory = !!1;

var chart = new Chart(myChart, {
  type: 'bar',
  data: {
    labels: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [{
      backgroundColor: "#E60012",
      data: histogramArray
    }]
  },
    options: {
      legend: {
        display: false
      },
  		title: {
    	display: true,
    	text: 'Dice Histogram',
      fontSize: 30,
      padding: 50
    },
    scales: {
      yAxes: [{
        ticks: {
          fontSize: 25,
          beginAtZero: true,
          userCallback: function(label, index, labels) {
            if (Math.floor(label) === label) {
              return label;
              }
          }
        }
      }],
      xAxes: [{
        ticks: {
          fontSize: 25
        }
      }]
    }
	},
   plugins: [dataLabelPlugin],
});

function createHistogramArray(){
  histogramArray.fill(0);
  for(var i = 0; i < diceRecord.length; i++){
    histogramArray[diceRecord[i]-2]++;
  }
}

function writeLastXResult(){
  var lastXResult = Array(LASTRESULTNUM); // Array of String
  lastXResult.fill("00");
  if(showhistory){
    for(var i = 0; i < Math.min(LASTRESULTNUM, diceRecord.length); i++){
      var iResult = diceRecord[diceRecord.length-1-i];
      lastXResult[LASTRESULTNUM-1-i] = (iResult < 10) ? "0" + iResult.toString() : iResult.toString();
    }
  }
  for(var i = 0; i < LASTRESULTNUM; i++){
    document.getElementById("lastXResult"+i.toString()).innerHTML = lastXResult[i].toString();
  }
}

function writeTurnnum(){
  if(turn > 0){
    document.getElementById("turnnum").innerHTML = numeral(Math.ceil(turn/4)).format('0o') + " round    " + numeral(turn%4 ? turn%4 : 4).format('0o') + " turn";
  }
  else{
    document.getElementById("turnnum").innerHTML = "wating to start...";
  }
}

function writeDiceResult(){
  if(diceRecord.length > 0){
    var diceResult = diceRecord[diceRecord.length-1];
    document.getElementById("resulttext").innerHTML = (diceResult < 10) ? "0" + diceResult.toString() : diceResult.toString();
  }
  else {
    document.getElementById("resulttext").innerHTML = "00";
  }
}
//
// function writeExpctResult(){
//   expectNumArray.fill("00");
//   if(turn > 0){
//     for(var i = 2; i < 13; i++){
//       var expectNum = (i < 8) ? (i-1)*turn/36 : (13-i)*turn/36;
//       expectNumArray[i-2] = (Math.round(expectNum) < 10) ? "0" + Math.round(expectNum).toString() : Math.round(expectNum).toString();
//       document.getElementById("expectnum"+i.toString()).innerHTML = expectNumArray[i-2];
//     }
//   }
//   else{
//     for(var i = 2; i < 13; i++){
//       document.getElementById("expectnum"+i.toString()).innerHTML = "00";
//     }
//   }
//   console.log(expectNumArray);
// }

function refreshALL(){
  createHistogramArray();
  writeTurnnum();
  writeDiceResult();
  writeLastXResult();
  // writeExpctResult();
  chart.update();
}

document.getElementById("castbutton").onclick = function() {
  turn++;
  var dicenum1 = 1 + Math.floor( Math.random() * 6 );
  var dicenum2 = 1 + Math.floor( Math.random() * 6 );
  var randnum = dicenum1 + dicenum2;
  diceRecord.push(randnum);
  refreshALL();
};

document.getElementById("undobutton").onclick = function() {
  diceRecord.pop();
   (turn > 0) ? turn-- : turn = 0;
  refreshALL();
};

document.getElementById("refreshbutton").onclick = function() {
  diceRecord.length = 0; // reset records
  turn = 0;
  refreshALL();
};

document.getElementById("hidebutton").onclick = function() {
  showhistory = !showhistory;
  refreshALL();
};
