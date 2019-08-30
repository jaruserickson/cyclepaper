import React from 'react'
import { Input } from 'semantic-ui-react'


const SubredditInput = ({ submit, onChange }) => (
    <Input
        label='r/'
        action={{ 
            icon: 'plus',
            onClick: () => submit()
        }}
        placeholder='subreddit'
        className='mb2 no-drag'
        onChange={onChange}
        onKeyPress={(e) => {
            if(e.key === 'Enter') submit()
        }}
    />
)

export default SubredditInput
