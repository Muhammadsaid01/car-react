//@ts-nocheck
import { Component } from 'react'



class Test extends Component<{}, TestState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      brand: "Ford",
      model: "Mustang",
      color: "red",
      year: 1964
    };
  }
  changeDetail = () => {
    this.setState({
			color: "blue",
			brand:"Tesla",
			model:"Medel S",
			year: 2025
		});
  }


	componentDidMount() {
		console.log("componentDidMount");
		// runs after first render => Retrieve Data from  Backend Server
	}

	componentWillUnmount(){
		console.log("componentWillUnmount");
		//runs before unmount
	}


	componentDidUpdate() {}
  render() {
    return (
      <div>
        <h1>My {this.state.brand}</h1>
        <p>
          It is a {this.state.color}
          {this.state.model}
          from {this.state.year}.
        </p>
        <button
          type="button"
          onClick={this.changeDetail}
        >Change color</button>
      </div>
    );
  }
}


export default Test;