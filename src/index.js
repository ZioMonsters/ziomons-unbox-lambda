const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-3' });
const lambda = new AWS.Lambda({ region: 'eu-west-3' });

const TableName = `cryptomon-monsters-${process.env.NODE_ENV}`;
const EventsTable = `cryptomon-events-${process.env.NODE_ENV}`;

exports.handler = (event/*{ Records: [{ body }] }*/, context, callback) => {
  /*
    qua ci saranno i valori presi dall'evento che poi scrivo su dynamo
  */

  const { Records: [{ body }]} = event;
  const { tokenId, to, atk, def, spd} = JSON.parse(body);
  const transactionId = '1';
  const type = 'test';

  const putMonster = dynamo.put({
    TableName,
    Item: {
      monsterId: tokenId,
      user: to,
      attack: atk,
      defense: def,
      speed: spd
    }
  }).promise();

  const createImageMonster = lambda.invoke({
    FunctionName: `cryptomon-images-lambda-${process.env.NODE_ENV}`,
    Payload: JSON.stringify({ tokenId })
  }).promise();

  const updateEvent = dynamo.put({
    TableName: EventsTable,
    Item: {
      transactionId,
      type,
      processed: true
    }
  }).promise();

  /*return */Promise.all([
    putMonster,
    createImageMonster,
    updateEvent
  // promise che mette sulla table di dynamo il mostro con le sue caratteristiche (PartitionKey = monsterId, SortKey = user)
  // promise che fa partire la lambda images
  // promise che segni sulla table events l'evento come processato
  ])
    .then(console.log)
    .then(() => callback(null, event))
    .catch(console.error)
};
