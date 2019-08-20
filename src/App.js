import React from 'react';
import { Button } from 'semantic-ui-react'
import IntervalSelector from './IntervalSelector';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sources: {
                'wallpapers': false,
                'wallpaper': false,
                'multiwall': false
            }
        }
    }

    select = (subReddit) => {
        const copySources = {...this.state.sources}
        copySources[subReddit] = !this.state.sources[subReddit]
        this.setState({ sources: copySources })
    }
  
    render() {
        return (
            <div className="bg-near-black white vw-100 vh-100 flex flex-column items-center justify-center">
                <span className="f2-ns tracked-tight helvetica pa4">cyclepaper</span>
                {
                    Object.keys(this.state.sources).map((subReddit) => (
                        <div className="ma1">
                            <Button 
                            onClick={() => this.select(subReddit)} 
                            active={this.state.sources[subReddit]}>
                                {subReddit}
                            </Button>
                        </div>
                    ))
                }
                <IntervalSelector />
            </div>
        );
    }
}

export default App;
