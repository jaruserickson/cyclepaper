import React from 'react'
import { Button, Segment, Input, Icon } from 'semantic-ui-react'
import IntervalSelector from './IntervalSelector'
import { setWallpaperFromSources, saveWallpaper } from './wallpaperService'
import axios from 'axios';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sources: {
                'wallpapers': false,
                'wallpaper': false,
                'multiwall': false
            },
            time: 30,
            timeUnit: 'mins',
            subRedditSet: ''
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8124/settings').then((res) => {
            if (res.status === 200) {
                this.setState(res.data)
            } else {
                console.log('No settings found, keeping defaults.')
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        axios.post('http://localhost:8124/settings', { state: this.state }).then((res) => console.log(res))
    }
    
    select = (subReddit) => {
        const copySources = {...this.state.sources}
        copySources[subReddit] = !this.state.sources[subReddit]
        this.setState({ sources: copySources })
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

    sortedSourceKeys = () => {
        return Object.keys(this.state.sources).filter((source) => this.state.sources[source]).sort().concat(
            Object.keys(this.state.sources).filter((source) => !this.state.sources[source]).sort()
        )
    }

    addSubreddit = (sub) => {
        if (sub.length > 2) {
            const copySources = {...this.state.sources}
            copySources[sub] = true
            this.setState({ sources: copySources })
        }
    }

    removeSubreddit = (sub) => {
        let copySources = {...this.state.sources}
        delete copySources[sub]
        this.setState({ sources: copySources })
    }
  
    render() {
        return (
            <div className="bg-near-black white vw-100 vh-100 flex flex-column items-center justify-center">
                <span className="f2-ns tracked-tight helvetica pa3">cyclepaper</span>
                <Segment className="overflow-auto no-drag flex flex-wrap align-center justify-center" style={{backgroundColor: 'transparent', maxHeight:'11em'}}>
                    {
                        this.sortedSourceKeys().map((subReddit) => 
                            <div className="ma1" key={subReddit}>
                                <Button.Group>
                                    <Button 
                                        toggle
                                        onClick={() => this.select(subReddit)} 
                                        active={this.state.sources[subReddit]}>
                                        {subReddit}
                                    </Button>
                                    <Button 
                                        icon 
                                        color='google plus'
                                        onClick={() => this.removeSubreddit(subReddit)}>
                                            <Icon name='trash'></Icon>
                                    </Button>
                                </Button.Group>
                            </div>
                        )
                    }
                </Segment>
                <Input
                    label='r/'
                    action={{ 
                        icon: 'plus',
                        onClick: () => this.addSubreddit(this.state.subRedditSet)
                    }}
                    placeholder='subreddit'
                    className='mb2 no-drag'
                    onChange={({ target: { value }}) => this.setState({ subRedditSet: value})}
                    onKeyPress={(e) => {
                        if(e.key === 'Enter') this.addSubreddit(this.state.subRedditSet)
                    }}
                />
                <IntervalSelector 
                    setTime={(time) => this.setState({ time: parseInt(time) })}
                    setTimeUnit={(timeUnit) => this.setState({ timeUnit: timeUnit })} 
                />
                <div className='absolute right-2 bottom-2'>
                    <Button.Group>
                        <Button
                            icon
                            onClick={this.handleTimeChange}>
                            <Icon name='refresh'></Icon>
                        </Button>
                        <Button
                            icon
                            onClick={saveWallpaper}>
                            <Icon name='save'></Icon>
                        </Button>
                    </Button.Group>
                </div>
            </div>
        );
    }
}
