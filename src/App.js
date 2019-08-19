import React from 'react';
import SubRedditCard from './SubRedditCard';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.defaultSubRedditSources = [
      'wallpapers',
      'wallpaper',
      'multiwall'
    ]
  }

  select = (subReddit) => {
    
  }
  
  render() {
    return (
      <div className="bg-near-black white vw-100 vh-100 flex flex-column items-center justify-center">
        <span className="f2-ns tracked-tight helvetica pa3">cyclepaper</span>
        {
          this.defaultSubRedditSources.map((subReddit) => (
            <SubRedditCard selectSubReddit={this.select}>{subReddit}</SubRedditCard>
          ))
        }
        {/* <button></button> */}
      </div>
    );
  }
}

export default App;
