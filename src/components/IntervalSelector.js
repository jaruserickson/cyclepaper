import React, { useState } from 'react'
import { Input, Select } from 'semantic-ui-react'


const isValidTime = (time) => /\d/i.test(time) && time.length > 0

export default function IntervalSelector({ setTime, setTimeUnit }) {
    const [displayTime, setDisplayTime] = useState('30')
    return (
        <div className="no-drag flex align-center justify-center flex-column">
            <span className="f6 tc mb2">refresh wallpaper every:</span>
            <div className="flex align-center justify-center flex-row">
                <Input 
                    className="mr1 w4" 
                    error={!isValidTime(displayTime)} 
                    iconPosition="left" 
                    defaultValue="30" 
                    icon="clock" 
                    onChange={({ target: { value }}) => setDisplayTime(value) || (isValidTime(value) && setTime(value))} />
                <Select className="ml1 fluid w4" defaultValue='mins' options={[
                    { key: 'mins', value: 'mins', text: 'Minutes' },
                    { key: 'hrs', value: 'hrs', text: 'Hours' },
                    { key: 'days', value: 'days', text: 'Days' }
                ]} onChange={(e, { value }) => setTimeUnit(value)} />
            </div>
        </div>
    )
}