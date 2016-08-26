import React from 'react'
import Form from 'react-jsonschema-form';

import 'normalize.css/normalize.css'
import 'styles/main.scss'

const ERROR_BORDER = '1px solid red'
const defaultMarkdown =
`---
user: echo
title: Echo Hu
position: Operations Assistant
featured: true
---`

const defaultSchema =
`[{
  "name": "ref", "target": "user", "type": "string"
},{
  "name": "name", "target": "name", "type": "string"
}, {
  "name": "position", "target": "position", "type": "string"
}, {
  "name": "featured", "target": "featured", "type": "boolean"
}]`

const schema = {
  type: 'object',
  properties: {
    title: {type: 'string', title: 'Title', default: 'A new task'},
  }
}

const formData = {
  title: "First task",
  done: true
}

class AppComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      schemaCanBeParsed: true,
      markdownText: defaultMarkdown
    }
  }

  checkSchema() {
    const { schemaInput } = this.refs
    try {
      const obj = JSON.parse(schemaInput.value)
      let schemaCanBeParsed = (typeof obj === 'object') && obj.length > 0
      if(schemaCanBeParsed) {
        for (let i = 0; i < obj.length; i++) {
          if(obj[i].type !== 'boolean' && obj[i].type !== 'string') {
            schemaCanBeParsed = false
          }
        }
      }
      this.setState({ schemaCanBeParsed })

      if(schemaCanBeParsed) this.updateEditFrom()
    } catch (e) {
      this.setState({ schemaCanBeParsed: false })
    }
  }

  updateMarkdown() {
    const { markdownInput } = this.refs

    this.setState({ markdownText: markdownInput.value })
  }

  render() {
    const { markdownText, schemaCanBeParsed } = this.state

    return (
      <div>
        <h3>Schema</h3>
        <textarea
          cols='50'
          defaultValue={defaultSchema}
          name='textarea'
          onChange={() => this.checkSchema()}
          ref='schemaInput'
          rows='10'
          style={{ border: schemaCanBeParsed ? '' : ERROR_BORDER }}
        />
        <h3>Original Markdown</h3>
        <textarea
          cols='50'
          defaultValue={markdownText}
          name='textarea'
          ref='markdownInput'
          rows='10'
          onChange={() => this.updateMarkdown()}
        />
        <h3>Edit From</h3>
        <Form schema={schema}
          onChange={() => console.log("changed")}
          onSubmit={res => console.log(res.formData)}
          onError={() => console.log("errors")}
          formData={formData}
        />
        <h3>Result</h3>
        <textarea name='textarea' rows='10' cols='50' />
      </div>
    )
  }
}

export default AppComponent
