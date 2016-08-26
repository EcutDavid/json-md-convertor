import React from 'react'

import 'normalize.css/normalize.css'
import 'styles/main.scss'

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <h3>Schema</h3>
        <textarea name="textarea" rows="10" cols="50" defaultValue='21312' />
        <h3>Original Markdown</h3>
        <textarea name="textarea" rows="10" cols="50" />
        <h3>Edit From</h3>
        <h3>Result</h3>
        <textarea name="textarea" rows="10" cols="50" />
      </div>
    )
  }
}

export default AppComponent
