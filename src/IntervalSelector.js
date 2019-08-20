import React from 'react'
import { Input, Select } from 'semantic-ui-react'

export default function IntervalSelector() {
    return (
        <div className="flex align-center justify-center flex-column">
            <span className="f6 tc ma2">refresh wallpaper every:</span>
            <div className="flex align-center justify-center flex-row">
                <Input className="mr1 w4" placeholder="30" icon="clock"/>
                <Select className="ml1 fluid w4" placeholder='Minutes' options={[
                    { key: 'mins', value: 'mins', text: 'Minutes' },
                    { key: 'hrs', value: 'hrs', text: 'Hours' },
                    { key: 'days', value: 'days', text: 'Days' },
                ]}/>
            </div>
        </div>
    )
}