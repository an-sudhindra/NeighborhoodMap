import React, {Component} from 'react';
import ListItem from './ListItem';

export default class ListPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: '',
            query: ''
        };

        this.filterLocations = this.filterLocations.bind(this);
    }

    /* Filter items based on user input */
    filterLocations(event) {
        this.props.closeInfoWindow();
        const { value } = event.target;
        let locations = [];
        this.props.allLocations.forEach((loc) => {
            if (loc.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                loc.marker.setVisible(true);
                locations.push(loc);
            } else {
                loc.marker.setVisible(false);
            }
        });

        this.setState({
            locations: locations,
            query: value
        });
    }

    componentWillMount() {
        this.setState({
            locations: this.props.allLocations
        });
    }

    render() {
        var locationsList = this.state.locations.map(function (listItem, index) {
            return (
                <ListItem key={listItem.id} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem} />
            );
        }, this);

        return (
            <div className="search">
                <div align="center" className="searchHeader">
                    <h2>Nearby Places</h2>
                    <input role="search" aria-label="filter" id="searchField" type="text" value={this.state.query} onChange={this.filterLocations}/>
                </div>
                <br/>
                <ul className="dataList">
                    { locationsList }
                </ul>
            </div>
        );
    }
}