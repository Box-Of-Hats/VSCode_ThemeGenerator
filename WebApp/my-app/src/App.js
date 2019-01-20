import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            palette: {
                "c0": "#FF0000",
                "c1": "#00FF00",
                "c2": "#0000FF",
                "c3": "#F000F0",
                "c4": "#F0F000",
                "c5": "#000000",
                "c6": "#FFFFFF",
            },
            assets: {
                "activityBar.background": "c0",
                "editor.background": "c1"
            },
            selectedColorName: "c0"
        };
        this.handleColorChange = this.handleColorChange.bind(this);
        this.updateAsset = this.updateAsset.bind(this);
        this.updatePalette = this.updatePalette.bind(this);
    }

    handleColorChange(colorName) {
        this.setState({ selectedColorName: colorName });
    }


    updateAsset(assetName) {
        let prev = JSON.parse(JSON.stringify(this.state.assets))

        prev[assetName] = this.state.selectedColorName;
        this.setState({
            assets: prev
        })
    }

    updatePalette(colorName, colorValue) {
        //Update a value in the palette
        let prev = JSON.parse(JSON.stringify(this.state.palette))
        prev[colorName] = colorValue;
        this.setState({
            palette: prev
        })
    }

    render() {
        return (
            <div className="App">
                <div className="sideBar">
                    <div className="colorPickers">
                        <div className="title">Current: <span style={{ backgroundColor: this.state.palette[this.state.selectedColorName], padding: "3px" }}>{this.state.selectedColorName}</span></div>
                        {Object.keys(this.state.palette).map((i, key) => {
                            return <ColorPicker key={key} colorName={i} color={this.state.palette[i]}
                                handleChange={this.updatePalette} handleSelect={this.handleColorChange} />
                        })}
                    </div>
                </div>
                <WindowPreview palette={this.state.palette} handleChange={this.updateAsset} assets={this.state.assets} />
                <CodePreview assets={this.state.assets} palette={this.state.palette} />
            </div>
        );
    }
}

class CodePreview extends Component {
    constructor(props) {
        super(props)
        this.generatePreviewText = this.generatePreviewText.bind(this);
    }

    generatePreviewText() {
        var text = "";
        Object.keys(this.props.assets).forEach(key => {
            text = text + key + ": " + this.props.palette[this.props.assets[key]] + ",\n";
        });
        return text
    }

    render() {
        var codePreview = this.generatePreviewText();
        return (
            <div className="codePreview">
                {codePreview.split("\n").map((i, key) => { return <div className="codeLine" key={key}>{i}</div> })}
            </div>
        )
    }
}

class WindowPreview extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(assetName) {
        this.props.handleChange(assetName);
    }

    render() {
        return (
            <div className="windowPreview">
                <div className="activityBar" onClick={() => this.handleClick("activityBar.background")} style={{ backgroundColor: this.props.palette[this.props.assets["activityBar.background"]] }}></div>
                <div className="editor" onClick={() => this.handleClick("editor.background")} style={{ backgroundColor: this.props.palette[this.props.assets["editor.background"]] }}></div>

            </div >
        )
    }
}

class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.color ? props.color : "#FFFFFF"
        }
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleSelectButtonClick = this.handleSelectButtonClick.bind(this);
    }

    handleColorChange(event) {
        event.preventDefault();
        console.log("ColorPicker.handleColorChange: ", event.target.value);
        this.setState({ value: event.value });
        this.props.handleChange(this.props.colorName, event.target.value);
        this.props.handleSelect(this.props.colorName);
    }

    handleSelectButtonClick(event) {
        event.preventDefault();
        console.log("ColorPicker.handleSelectButtonClick:", this.props.colorName);
        this.props.handleSelect(this.props.colorName);
    }

    render() {
        return (
            <div className="colorPicker">
                <label>{this.props.colorName}
                    <input className="colorPicker__colorInput" onChange={this.handleColorChange} value={this.state.value} type="color"></input>
                </label>
                <input className="colorPicker__button" type="button" value="Select" onClick={this.handleSelectButtonClick} />
            </div>
        );
    }
}


export default App;
