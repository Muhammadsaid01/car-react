
import  React, {Component} from  "react";


class Test extends Component {
  constructor(props) {
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
        brand: "Tesla",
        model: "Model 5",
        year: 2023,
    });
  };

  componentDidMount() {
   console.log("componentDidMount");
   //Runs after first render => RETRIEVE DATA FROM BACKEND SERVER   
  }


  componentWillUnmount(): void {
      console.log("componentWillUnmount");
      //Runs before component unmount
  }

  componentDidUpdate() {
}

  render() {
    return (
      <div>
        <h1>My {this.state.brand}</h1>
        <p>
         Color {this.state.color}
          -Model {this.state.model}
          from {this.state.year}.
        </p>
        <button
          type="button"
          onClick={this.changeDetail}
        >Change Details</button>
      </div>
    );
  }
}

export default Test;