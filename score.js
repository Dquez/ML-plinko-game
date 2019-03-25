const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([...arguments]);
  console.log(outputs);
}

function runAnalysis() {
  // Write code here to analyze stuff
}

const predictionPoint = 300;
const k = 3;
// bucket element might fall into based on three nearest neighbors' buckets

function distancePoint (point) {
  return Math.abs(point - predictionPoint);
}
function kNearestNeighbor (outputs) {
  return _.chain(outputs)
            .map(row => [distancePoint(row[0]), row[3]])
            // sort by abs dropPosition
            .sortBy(row => row[0])
            // slice from 0 to k nearest neighbors
            .slice(0,k)
            // count how many times a ball landed into bucket 
            .countBy(row => row[1])
            // make an array from the object output from countBy
            .toPairs()
            // sort by amount of occurences per bucket
            .sortBy(row => row[1])
            // grab the bucket with the greatest occurences
            .last()
            // take the first element in the pair which is the bucket number
            .first()
            // parse the element from a stringified key to an integer
            .parseInt()
            // end the chain by returning a value()
            .value()
}