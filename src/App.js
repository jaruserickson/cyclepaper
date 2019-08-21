import React from 'react'
import { Button } from 'semantic-ui-react'
import IntervalSelector from './IntervalSelector'
import { setWallpaperFromSources } from './wallpaperService'


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sources: {
                'wallpapers': false,
                'wallpaper': false,
                'multiwall': false
            },
            time: 30,
            timeUnit: "mins"
        }
    }

    select = (subReddit, cb) => {
        const copySources = {...this.state.sources}
        copySources[subReddit] = !this.state.sources[subReddit]
        this.setState({ sources: copySources }, cb)
    }
    
    getMultiplier = () => {
        return this.state.timeUnit === 'mins' ? 60000 : 
                this.state.timeUnit === 'hrs' ? 3.6e+6 : 8.64e+7 // days
    }

    handleTimeChange = () => {
        window.clearInterval(this.interval)
        let filteredSources = Object.keys(this.state.sources).filter((item) => this.state.sources[item])
        setWallpaperFromSources(filteredSources)
        
        this.interval = setInterval(() => {
            setWallpaperFromSources(filteredSources)
        }, this.state.time * this.getMultiplier())
    }
  
    render() {
        return (
            <div className="bg-near-black white vw-100 vh-100 flex flex-column items-center justify-center">
                <span className="f2-ns tracked-tight helvetica pa4">cyclepaper</span>
                {
                    Object.keys(this.state.sources).map((subReddit) => 
                        <div className="ma1">
                            <Button 
                            toggle
                            onClick={() => this.select(subReddit, () => this.handleTimeChange())} 
                            active={this.state.sources[subReddit]}>
                                {subReddit}
                            </Button>
                        </div>
                    )
                }
                <IntervalSelector 
                    setTime={(time) => this.setState({ time: parseInt(time) }, this.handleTimeChange)}
                    setTimeUnit={(timeUnit) => this.setState({ timeUnit: timeUnit }, this.handleTimeChange)} 
                />
            </div>
        );
    }
}

export default App;
