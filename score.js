const outputs = [];
const predictionPoint = 300;


function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([...arguments]);
}

function runAnalysis() {
  const testSize = 10;
  const [testSet, trainingSet] = splitDataSet(outputs, testSize);
  const k = 10
    const accuracy = _.chain(testSet)
                      // take the training set and the dropPoint from each test set and compare the result to the testSet's bucket
                      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
                      // get the size of the array of matching test and training buckets
                      .size()
                      // divide the size by the testSize i.e. 4 correct / 10 total = 40% accurate
                      .divide(testSize)
                      .value()
    console.log('Accuracy: ', accuracy);  
}

function knn (data, point, k) {
  // point is an array with THREE values, all the values from testSet less the bucket
  return _.chain(data)
            .map(row => {
              return [
                distancePoint(_.initial(row), point),
                // last (row) is the bucket number
                _.last(row)
              ];
            }) 
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

function distancePoint (pointA, pointB) {
  return _.chain(pointA)
            // make a new array that pairs the corresponding values from pointA to pointB 
            .zip(pointB)
            // use array destructuring to take out an element from pointA array and its corresponding element from the pointB array. Subtract the values and square the result
            .map(([a,b]) => (a-b) **2)
            .sum()
            // take the square root of the result, and it's equal to the hypotenuse
            .value() ** 0.5;
}

function splitDataSet (data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);
  for(let i = 0; i < featureCount; i++){
    const column = clonedData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);

    for(let j = 0; j < column.length; j++){
      clonedData[j][i] = (clonedData[j][i]- min) / (max-min);
    }
  }
  return clonedData;
}