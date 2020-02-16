var myChart = document.getElementById("myChart").getContext('2d');

var expectNumArray = Array(11);
expectNumArray.fill("00"); //Expected number of occurrences
var turn = 0;
var mersenneTwister = new MersenneTwister(new Date().getTime());

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
                    ctx.fillText("("+expectNum+")", position.x, position.y - (fontSize*3 / 2) - padding); //display expected number onto result numbers
                })
            }
        })
    }
}; //To display result numbers and expected result numbers above chart bars

var diceRecord = [];
var histogramArray = Array(11);
histogramArray.fill(0);
var turn = 0;
const LASTRESULTNUM = 8; //The number of past result to display
var showhistory = !!1; //True, To select showing past result or not

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

function writeTurnnum(){
  if(turn > 0){
    document.getElementById("turnnum").innerHTML = numeral(Math.ceil(turn/4)).format('0o') + " round    " + numeral(turn%4 ? turn%4 : 4).format('0o') + " turn";
  }
  else{
    document.getElementById("turnnum").innerHTML = "Waiting for Start...";
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

function writeLastXResult(){
  var lastXResult = Array(LASTRESULTNUM);
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

function refreshALL(){
  createHistogramArray();
  writeTurnnum();
  writeDiceResult();
  writeLastXResult();
  chart.update();
}

const doCast = function() {
  turn++;
  var dicenum1 = mersenneTwister.nextInt(1, 6 + 1);
  var dicenum2 = mersenneTwister.nextInt(1, 6 + 1)
  var randnum = dicenum1 + dicenum2;
  diceRecord.push(randnum);
  refreshALL();
};
document.getElementById("castbutton").onclick = doCast;

const doUndo = function() {
  diceRecord.pop();
   (turn > 0) ? turn-- : turn = 0;
  refreshALL();
};
document.getElementById("undobutton").onclick = doUndo;

const doRefresh = function() {
  diceRecord.length = 0; // reset records
  turn = 0;
  refreshALL();
};
document.getElementById("refreshbutton").onclick = doRefresh;

const doHide = function() {
  showhistory = !showhistory; //Change showing history or not
  refreshALL();
};
document.getElementById("hidebutton").onclick = doHide;

document.addEventListener("keydown", (event) => {
  const keyName = event.key;
  if(keyName == "c"){
    doCast();
  }else if(keyName == "u"){
    doUndo();
  }else if(keyName == "h"){
    doHide();
  }else if(keyName == "r"){
    doRefresh();
  }
  if(keyName === " " && document.activeElement.tagName !== "BUTTON"){
    if(event.shiftKey){
      doUndo();
    }else{
      doCast();
    }
  }
});
