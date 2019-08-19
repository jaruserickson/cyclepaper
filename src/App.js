import React from 'react';
import SubRedditCard from './SubRedditCard';

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
                <span className="f2-ns tracked-tight helvetica pa3">cyclepaper</span>
                {
                    Object.keys(this.state.sources).map((subReddit) => (
                        <SubRedditCard selectSubReddit={this.select}>{subReddit}</SubRedditCard>
                    ))
                }
                {/* <button></button> */}
            </div>
        );
    }
}

export default App;
