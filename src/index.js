const AWS = require("aws-sdk");
const params = {
  region: 'eu-west-3',
  credential: new AWS.Credential('../.credentials.json')
};

const dynamo = new AWS.DynamoDB.DocumentClient(params);
const lambda = new AWS.Lambda(params);

const TableName = `cryptomon-monsters-${process.env.NODE_ENV}`;
const EventsTable = `cryptomon-events-${process.env.NODE_ENV}`;

exports.handler = (event, context, callback) => {
  /*
    qua ci saranno i valori presi dall'evento che poi scrivo su dynamo
  */
  const eventId = 1;
  const eventObj = {
    tokenId: 1,
    to: 'fake address',
    atk: 21 /*recupero con web3*/,
    def: 12 /*recupero con web3*/,
    spd: 7 /*recupero con web3*/
  };

  /*return */Promise.all([
    dynamo.put({
      TableName,
      Item: {
        monsterId: eventObj.tokenId,
        user: eventObj.to,
        atk: eventObj.atk,
        def: eventObj.def,
        spd: eventObj.spd
      }
    }).promise(),
    lambda.invoke({
      FunctionName: 'cryptomon-images-lambda',
      Payload: JSON.stringify({ /*id del mostro*/ })
    }).promise(),
    dynamo.put({
      TableName: EventsTable,
      Item: {
        /*attributes dell'evento (non so come e' salvato)*/
        eventId,
        processed: true
      }
    }).promise()
  // promise che mette sulla table di dynamo il mostro con le sue caratteristiche (PartitionKey = monsterId, SortKey = user)
  // promise che fa partire la lambda images
  // promise che segni sulla table events l'evento come processato
  ])
    .then(console.log)
};
