const Listener = require('./listener')
const Payload = require('./payload')
/**
 * transformer 负责将数据转化为标准化数据， 然后传递给下个transformer 或者listener
 */
export default class Transformer extends Listener {
    constructor (processFunc, connection) {
        super(processFunc, connection)
    }

    async _processAndSendNext (msg, nextListener, routingKey) {
        try {
            let payload = await this.processFunc(msg)
            if (Payload.check(payload)) {
                this.send(nextListener, routingKey, payload)
            } else {

            }
        } catch (e) {
            console.log(`_processAndSendNext error, ${e}`)
            this._errorHandler(e, msg)
        }
    }
}