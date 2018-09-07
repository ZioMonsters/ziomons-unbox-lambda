const AWS = require("aws-sdk")
// instanzi il document client
const TableName = `cryptomon-monsters-${process.env.NODE_ENV}`
const EventsTable = `cryptomon-events-${process.env.NODE_ENV}`

exports.handler = (event, context, callback) => {
  return Promise.all([
    // promise che mette sulla table di dynamo il mostro con le sue caratteristiche (PartitionKey = monsterId, SortKey = user)
    // promise che fa partire la lambda images
    // promise che segni sulla table events l'evento come processato
  ])
    .then(() => callback(null, event))
}
