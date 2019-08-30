import React from 'react'
import axios from 'axios';
import { setWallpaperFromSources, saveWallpaper } from './service/wallpaperService'
import IntervalSelector from './components/IntervalSelector'
import WallpaperFunctionButtons from './components/WallpaperFunctionButtons';
import SubredditPicker from './components/SubredditPicker'
import SubredditInput from './components/SubredditInput'


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

    componentDidUpdate(p, prevState) {
        if (JSON.stringify(prevState.sources) !== JSON.stringify(this.state.sources)) {
            axios.post('http://localhost:8124/settings', { state: this.state }).then((res) => console.log(res))
        }
    }
    
    getTimeMultiplier = () => {
        return this.state.timeUnit === 'mins' ? 60000 : 
                this.state.timeUnit === 'hrs' ? 3.6e+6 : 8.64e+7 // days
    }

    handleTimeChange = () => {
        window.clearInterval(this.interval)
        let filteredSources = Object.keys(this.state.sources).filter((item) => this.state.sources[item])
        setWallpaperFromSources(filteredSources)
        
        this.interval = setInterval(() => {
            setWallpaperFromSources(filteredSources)
        }, this.state.time * this.getTimeMultiplier())
    }

    addSubreddit = (sub) => {
        if (sub.length > 2) {
            const copySources = {...this.state.sources}
            copySources[sub] = true
            this.setState({ sources: copySources })
        }
    }

    selectSubreddit = (subReddit) => {
        const copySources = {...this.state.sources}
        copySources[subReddit] = !this.state.sources[subReddit]
        this.setState({ sources: copySources })
    }

    deleteSubreddit = (sub) => {
        let copySources = {...this.state.sources}
        delete copySources[sub]
        this.setState({ sources: copySources })
    }
  
    render() {
        return (
            <div className="bg-near-black white vw-100 vh-100 flex flex-column items-center justify-center">
                <span className="f2-ns tracked-tight helvetica pa3">cyclepaper</span>
                <SubredditPicker
                    sources={this.state.sources}
                    selectSubreddit={(subReddit) => this.selectSubreddit(subReddit)}
                    deleteSubreddit={(subReddit) => this.deleteSubreddit(subReddit)}
                />
                <SubredditInput 
                    submit={() => this.addSubreddit(this.state.subRedditSet)}
                    onChange={({ target: { value }}) => this.setState({ subRedditSet: value})}
                />
                <IntervalSelector 
                    setTime={(time) => this.setState({ time: parseInt(time) })}
                    setTimeUnit={(timeUnit) => this.setState({ timeUnit: timeUnit })} 
                />
                <WallpaperFunctionButtons 
                    refreshWallpaper={this.handleTimeChange}
                    saveWallpaper={saveWallpaper}
                />
            </div>
        );
    }
}
