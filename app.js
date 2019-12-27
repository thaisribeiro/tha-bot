import express from 'express'
import dotenv from 'dotenv'
import AssistantV1 from 'ibm-watson/assistant/v1'
import { IamAuthenticator } from 'ibm-watson/auth'
import bodyParser from 'body-parser'
import { prop } from 'ramda'
import { forEach } from 'async';

const app = express()


dotenv.config()

app.use(bodyParser.json())

const port = process.env.PORT || 3000

const assistant = new AssistantV1({
  authenticator: new IamAuthenticator({ apikey: process.env.API_KEY }),
  version: '2018-02-16'
})

const message_bot = async (text, context = {}) => {
  try {
    const params = {
      workspaceId: process.env.WORKSPACE_ID,
      input: { text: text || '' },
      context
    }

    let response = await assistant.message(params)
    const result = response.result

    if (prop('nodes_visited', result.output)) {
      const dialogNode = result.output.nodes_visited[result.output.nodes_visited.length - 1]

      const dialog = await assistant.getDialogNode({
        workspaceId: process.env.WORKSPACE_ID,
        dialogNode: dialogNode
      })

      result.output.title = dialog.result.title

      dialog.result.output.generic.forEach(generic => {
        if (prop('options', generic)) {
          result.output.options = generic.options
        }
      })

    }

    return result
  } catch (err) {
    throw new Error(err.status)
  }
}

app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body
  message_bot(text, context)
    .then(response => {
      res.status(200).json(response)
    })
    .catch(err => res.status(500).json(err))

})



app.listen(port, () => console.log(`Running on port ${port}`))
