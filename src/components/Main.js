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
  "name": "name", "target": "title", "type": "string"
}, {
  "name": "position", "target": "position", "type": "string"
}, {
  "name": "featured", "target": "featured", "type": "boolean"
}]`

class AppComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      schemaCanBeParsed: true,
      markdownText: defaultMarkdown,
      formSchema: { type: 'object', properties: {} },
      previousMarkdownState: '',
      resultMarkdown: ''
    }
  }

  componentDidMount() {
    setTimeout(() => this.updateEditFrom(), 500)
  }

  checkSchema() {
    const { schemaInput } = this.refs
    let schemaCanBeParsed = true
    try {
      const obj = JSON.parse(schemaInput.value)
      schemaCanBeParsed = (typeof obj === 'object') && obj.length > 0
      if(schemaCanBeParsed) {
        for (let i = 0; i < obj.length; i++) {
          if(obj[i].type !== 'boolean' && obj[i].type !== 'string') {
            schemaCanBeParsed = false
          }
        }
      }
      this.setState({ schemaCanBeParsed })

    } catch (e) {
      schemaCanBeParsed = false
      this.setState({ schemaCanBeParsed: false })
    }
    if(schemaCanBeParsed) this.updateEditFrom()
  }

  updateEditFrom() {
    const { schemaInput } = this.refs
    let { markdownText, schemaCanBeParsed, formSchema } = this.state

    const schemaObj = JSON.parse(schemaInput.value)
    if (!schemaCanBeParsed) return
    formSchema.properties = {}
    for (let i = 0; i < schemaObj.length; i++) {
      if(!schemaObj[i].name) continue
      const linePattern = new RegExp(schemaObj[i].target + ': ?[\\w ]*')
      const line = linePattern.exec(markdownText)
      const prePattern = new RegExp(schemaObj[i].target + ': ?')
      if(!line) continue
      let defaultValue = line[0].replace(prePattern, '')
      if(schemaObj[i].type === 'boolean') {
        defaultValue = defaultValue === 'true'
      }
      formSchema.properties[schemaObj[i].name] = {
        default: defaultValue,
        title: schemaObj[i].name,
        type: schemaObj[i].type
      }
    }
    this.setState({ formSchema })
  }

  updateMarkdown() {
    const { schemaCanBeParsed } = this.state
    const { markdownInput } = this.refs

    this.setState({ markdownText: markdownInput.value })

    if (schemaCanBeParsed) {
      setTimeout(() => this.updateEditFrom(), 20)
    }
  }

  updateResult(formData) {
    const { schemaInput } = this.refs
    let { markdownText, schemaCanBeParsed } = this.state

    const schemaObj = JSON.parse(schemaInput.value)
    let newMarkdownText = markdownText
    if (!schemaCanBeParsed) return
    for (let i = 0; i < schemaObj.length; i++) {
      const linePattern = new RegExp(schemaObj[i].target + ': ?[\\w ]*')
      const line = linePattern.exec(markdownText)
      const prePattern = new RegExp(schemaObj[i].target + ': ?')
      if(!line) continue
      let newValue = formData[schemaObj[i].name]
      const preText = prePattern.exec(markdownText)[0]
      newMarkdownText =
        newMarkdownText.replace(linePattern, preText + newValue)
    }
    this.setState({ resultMarkdown: newMarkdownText, previousMarkdownState: newMarkdownText })
  }

  render() {
    const { formSchema, markdownText, resultMarkdown, schemaCanBeParsed } = this.state

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
        <Form schema={formSchema}
          onSubmit={res => this.updateResult(res.formData)}
        />
        <h3>Result</h3>
        <textarea name='textarea' rows='10' cols='50' ref='res' value={resultMarkdown} />
      </div>
    )
  }
}

export default AppComponent
