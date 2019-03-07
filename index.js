import React from 'react'
import ReactDOM from 'react-dom'

class Title extends React.Component {
  render() {
    return <h1>{this.props.text}</h1>
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      greet: 'Hello',
      name: 'xiao han',
      count: 0
    }
    this.handleAdd = this.handleAdd.bind(this)
  }

  shoudComponentUpdate(nextProps, nextState) {
    console.log('should update')
    return true
  }

  // render之后的生命周期
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('get snapshot')
    return null
  }

  componentDidMount(prevProps, prevState) {
    console.log('did mount')
    setTimeout(() => {
      this.setState({ name: 'xiao ming' })
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('did update')
  }

  componentWillUnmount() {
    console.log('i will be die')
  }

  handleAdd() {
    this.setState({ count: this.state.count + 1 })
  }

  render() {
    const { greet, name, count } = this.state

    return (
      <div id='app'>
        <Title text={greet} />
        <p>My name is {name}</p>
        <Title text={'count is ' + count} />
        <button onClick={this.handleAdd}>add Count</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
