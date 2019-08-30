import React from 'react'
import { Segment, Button, Icon } from 'semantic-ui-react'


const sortedSourceKeys = (sources) => {
    return Object.keys(sources).filter((source) => sources[source]).sort().concat(
        Object.keys(sources).filter((source) => !sources[source]).sort()
    )
}

const WallpaperFunctionButtons = ({ sources, selectSubreddit, deleteSubreddit }) => (
    <Segment className="overflow-auto no-drag flex flex-wrap align-center justify-center" style={{backgroundColor: 'transparent', maxHeight:'11em'}}>
        {
            sortedSourceKeys(sources).map((subReddit) => 
                <div className="ma1" key={subReddit}>
                    <Button.Group>
                        <Button 
                            toggle
                            onClick={() => selectSubreddit(subReddit)} 
                            active={sources[subReddit]}>
                            {subReddit}
                        </Button>
                        <Button 
                            icon 
                            color='google plus'
                            onClick={() => deleteSubreddit(subReddit)}>
                                <Icon name='trash'></Icon>
                        </Button>
                    </Button.Group>
                </div>
            )
        }
    </Segment>
)

export default WallpaperFunctionButtons
