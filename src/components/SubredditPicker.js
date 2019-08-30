import React from 'react'
import { Segment, Button, Icon, Transition } from 'semantic-ui-react'


const sortedSourceKeys = (sources) => {
    return Object.keys(sources).filter((source) => sources[source]).sort().concat(
        Object.keys(sources).filter((source) => !sources[source]).sort()
    )
}

const WallpaperFunctionButtons = ({ sources, selectSubreddit, deleteSubreddit, toggleAnimation, trashVisible }) => (
    <Segment className="overflow-auto no-drag flex flex-wrap align-center justify-center" style={{backgroundColor: 'transparent', maxHeight:'11em'}}>
        {
            sortedSourceKeys(sources).map((subReddit) => 
                <div className="ma1 flex flex-row" key={subReddit}>
                    <div className="flex justify-center" style={{ width: '22vw'}}>
                        <Transition animation='scale' visible={toggleAnimation} duration={500}>
                            <Button 
                                style={{ width: '100%' }}
                                toggle
                                onClick={() => selectSubreddit(subReddit)} 
                                active={sources[subReddit]}>
                                {subReddit}
                            </Button>
                        </Transition>
                        <Transition animation='scale' visible={trashVisible}>
                            <Button 
                                icon 
                                color='google plus'
                                onClick={() => deleteSubreddit(subReddit)}>
                                <Icon name='trash'></Icon>
                            </Button>
                        </Transition>
                    </div>
                </div>
            )
        }
    </Segment>
)

export default WallpaperFunctionButtons
