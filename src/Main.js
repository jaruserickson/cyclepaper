import React from 'react'
import axios from 'axios';
import { Message, Transition, Loader } from 'semantic-ui-react'
import { 
    setWallpaperFromSources, 
    saveWallpaper, 
    validateSubreddit 
} from './service/wallpaperService'
import IntervalSelector from './components/IntervalSelector'
import WallpaperFunctionButtons from './components/WallpaperFunctionButtons';
import SubredditPicker from './components/SubredditPicker'
import SubredditInput from './components/SubredditInput'


const statesMatch = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sources: {
                'wallpapers': false,
                'wallpaper': false,
                'multiwall': false
            },
            currentWallpaper: '',
            time: 30,
            timeUnit: 'mins',
            subRedditSet: '',
            error: false,
            loading: false
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
        if (!statesMatch(prevState.sources, this.state.sources) ||
            !statesMatch(prevState.currentWallpaper, this.state.currentWallpaper) ||
            !statesMatch(prevState.time, this.state.time) ||
            !statesMatch(prevState.timeUnit, this.state.timeUnit)) {
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
        this.setState({ loading: true })
        setWallpaperFromSources(filteredSources).then((cur) => {
            this.setState({ loading: false, currentWallpaper: cur, })
        })
        
        this.interval = setInterval(async () => {
            this.setState({ loading: true })
            setWallpaperFromSources(filteredSources).then((cur) => {
                this.setState({ loading: false, currentWallpaper: cur, })
            })
        }, this.state.time * this.getTimeMultiplier())
    }

    addSubreddit = (sub) => {
        if (sub.length > 2) {
            validateSubreddit(sub).then((res) => {
                const copySources = {...this.state.sources}
                copySources[sub] = true
                this.setState({ sources: copySources })
            }).catch(() => {
                this.setState({ error: true }, () => {
                    setTimeout(() => {
                        this.setState({ error: false })
                    }, 2000)
                })
                console.log('Subreddit does not exist.')
            })
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
                <a href={this.state.currentWallpaper.url} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 left-2 gray">{this.state.currentWallpaper.sub}</a>
                <div className="absolute bottom-1">
                    <Transition visible={this.state.error} animation='scale' duration={500}>
                        <Message
                            error
                            header="That subreddit doesn't exist!"
                        />
                    </Transition>
                </div>
                <div className="absolute top-2 right-2">
                    <Loader active={this.state.loading}/>
                </div>
            </div>
        );
    }
}
