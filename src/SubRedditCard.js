import React from 'react';

export default class SubRedditCard extends React.Component {
    constructor(props) {
        super(props) // ({ children, selectSubReddit})
        this.state = {
            buttonColor: 'bg-dark-gray'
        }
    }

    select = (subReddit) => {
        this.setState(prevState => ({ buttonColor: prevState.buttonColor === 'bg-dark-gray' ? 'bg-gray' : 'bg-dark-gray'}))
        this.props.selectSubReddit(this.props.children)
    }

    render() {
        return (
            <div className={'no-drag w-third-ns pv3 ma1 br2 flex justify-center ' + this.state.buttonColor} onClick={this.select}>
                <span className="f6 helvetica">r/{this.props.children}</span>
            </div>
        )
    }
}