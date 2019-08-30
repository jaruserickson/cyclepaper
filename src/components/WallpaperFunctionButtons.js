import React from 'react'
import { Button, Icon } from 'semantic-ui-react'


const WallpaperFunctionButtons = ({ refreshWallpaper, saveWallpaper }) => (
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
    </div>
)

export default WallpaperFunctionButtons