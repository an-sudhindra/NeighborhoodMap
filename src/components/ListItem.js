import React, {Component} from 'react';

export default class ListItem extends Component {
    render() {
        return (
            <li role="button" className="dataListItem" tabIndex="0" onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker)} onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}>
                {this.props.data.name}
                <br/><p>{this.props.data.location.address}</p>
            </li>
        );
    }
}