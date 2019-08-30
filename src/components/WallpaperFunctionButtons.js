import React from 'react'
import { Button, Icon } from 'semantic-ui-react'


const WallpaperFunctionButtons = ({ refreshWallpaper, saveWallpaper, toggleTrash }) => (
    <div className='absolute right-2 bottom-2'>
        <Button.Group>
            <Button
                icon
                onClick={refreshWallpaper}>
                <Icon name='refresh'></Icon>
            </Button>
            <Button
                icon
                onClick={saveWallpaper}>
                <Icon name='save'></Icon>
            </Button>
        </Button.Group>
        <Button
            icon
            onClick={toggleTrash}
            style={{margin:5}}>
            <Icon name='trash'></Icon>
        </Button>
    </div>
)

export default WallpaperFunctionButtons